const { Sequelize } = require("sequelize");
const db = require("../../models/index");
const msg = require("../../constants/Messages");
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const UserDetails = db.users;
const StudentDetails = db.student;
const Rating = db.rating;

//ANCHOR - Add and Update rating
const addRating = async (req, res) => {
  try {
    const { studentId, rating, issue, comment } = req.body;

    //NOTE - if rating coming less than  or equal to 0
    if (rating <= 0)
      return res.status(400).send({
        status: 400,
        message: msg.RATING_US,
      });

    //NOTE - check if rating exist or not
    const ratingExists = await Rating.findOne({
      where: { studentId: studentId },
    });

    //NOTE - payload for rating
    const ratingData = {
      studentId: studentId,
      rating: rating,
      issue: JSON.stringify(issue),
      comment: comment,
      createdAt: new Date(),
    };

    if (ratingExists) {
      //NOTE - check if rating exist update it
      await Rating.update(ratingData, { where: { studentId: studentId } });
    } else {
      //NOTE - check if rating not exist create it
      await Rating.create(ratingData);
    }

    return res.status(200).send({
      status: 200,
      message: ratingExists ? msg.RATING_UPDATED : msg.RATING_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - get rating by user id
const getRatingByUserId = async (req, res) => {
  try {
    const { studentId } = req.query;
    const getRating = await Rating.findOne({
      where: { studentId: studentId },
      include: [{ model: UserDetails, attributes: ["name"] }],
      attributes: {
        exclude: ["updatedAt"],
      },
    });

    if (!getRating)
      return res
        .status(200)
        .send({ status: 200, message: msg.RATING_NOT_FOUND, data: [] });

    const arr = JSON.parse(getRating?.issue || "[]");
    const response = arr.filter((final) => final);

    //NOTE - push final data
    const result = {
      id: getRating.id,
      studentId: getRating.studentId,
      name: getRating.user?.name || null,
      rating: getRating.rating,
      issue: response,
      comment: getRating.comment,
      createdAt: getRating.createdAt,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - get all RATING
const getAllRating = async (req, res) => {
  try {
    const { page, limit } = req.query;

    //NOTE - add pagination
    const query = {
      offset: Number((page || 1) - 1) * Number(limit || 20),
      limit: Number(limit || 20),
    };

    let staffParams = null;
    if (
      req.user?.role &&
      ["teacher", "mentor"].includes(req.user.role.toLowerCase())
    ) {
      //NOTE - get staff class and batch details
      const staffDetails = await TeacherSubjectMap.findAll({
        where: { teacherId: req.user.id },
        attributes: ["classId", "batchTypeId"],
      });

      //NOTE - get all class details
      const classesIds = staffDetails.map((item) => item.classId);
      //NOTE - get all batch details
      const batchIds = staffDetails.map((item) => item.batchTypeId);

      //NOTE - params based on class or batch type
      const idParams = batchIds.every((id) => id === null)
        ? { classId: { [Sequelize.Op.in]: classesIds } }
        : { batchTypeId: { [Sequelize.Op.in]: batchIds } };

      //NOTE - get all student details
      const students = await StudentDetails.findAll({
        where: idParams,
        attributes: ["id"],
      });
      //NOTE - get all students type ids
      const typeIds = students.map((item) => item.id);

      staffParams = { studentId: { [Sequelize.Op.in]: typeIds } };
    }

    //NOTE - get all ratings
    const { count, rows } = await Rating.findAndCountAll({
      ...query,
      where: staffParams,
      include: [{ model: UserDetails, attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });

    if (!rows)
      return res
        .status(200)
        .send({ status: 200, message: msg.RATING_NOT_FOUND, data: [] });

    //NOTE - push final data
    const result = rows.map((data) => {
      const arr = JSON.parse(data?.issue || "[]");
      const response = arr.filter((final) => final);

      return {
        id: data.id,
        studentId: data.studentId,
        name: data.user?.name || null,
        rating: data.rating,
        issue: response,
        comment: data.comment,
        createdAt: data.createdAt,
      };
    });

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - delete RATING
const deleteRatingByUserId = async (req, res) => {
  try {
    const getRating = await Rating.findOne({
      where: { studentId: req.params.id },
    });
    if (!getRating) {
      return res
        .status(400)
        .send({ status: 400, message: msg.RATING_NOT_FOUND });
    }

    await Rating.destroy({
      where: {
        studentId: req.params.id,
      },
    });
    return res.status(200).send({ status: 200, message: msg.RATING_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  addRating,
  getRatingByUserId,
  getAllRating,
  deleteRatingByUserId,
};
