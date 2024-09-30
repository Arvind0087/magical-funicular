const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Response } = require("../../helpers/response.helper");
const { Sequelize, Op } = require("sequelize");
const { createActivity } = require("./service");
const { retriveLeads } = require("../../helpers/leadsquard");
const { config } = require("../../config/db.config");
const { captureLead } = require("../users/service");
const { userDetails } = require("../../helpers/userdetails");
const Feedback = db.feedback;
const UserDetails = db.users;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const StudentDetails = db.student;

//ANCHOR : create feedback
const createFeedback = async (req, res) => {
  try {
    const { studentId, feedback } = req.body;
    const newFeedback = new Feedback({
      studentId: studentId,
      feedback: feedback,
    });

    //NOTE - get user details and post activity
    const userDetail = await userDetails(studentId);

    //NOTE - retrive Lead
    let retriveData;
    retriveData = await retriveLeads(
      config.LEADSQUARD_API_KEY,
      config.LEADSQUARD_CLIENT_SECRET,
      config.LEADSQUARD_HOST,
      userDetail.phone
    );

    if (retriveData.length < 1) {
      //NOTE - lead capture
      await captureLead(
        config.LEADSQUARD_API_KEY,
        config.LEADSQUARD_CLIENT_SECRET,
        config.LEADSQUARD_HOST,
        userDetail.name,
        userDetail.student.course.name,
        userDetail.student.board.name,
        userDetail.student.class.name,
        userDetail.phone
      );
    }

    // //NOTE - if lead capture for user
    if (retriveData.length < 1) {
      retriveData = await retriveLeads(
        config.LEADSQUARD_API_KEY,
        config.LEADSQUARD_CLIENT_SECRET,
        config.LEADSQUARD_HOST,
        userDetail.phone
      );
    }

    //NOTE - create activity for user
    await createActivity(
      config.LEADSQUARD_API_KEY,
      config.LEADSQUARD_CLIENT_SECRET,
      config.LEADSQUARD_HOST,
      retriveData[0].ProspectID,
      studentId,
      feedback,
      userDetail.student.course.name,
      userDetail.student.board.name,
      userDetail.student.class.name
    );

    await newFeedback.save();
    return res.status(200).send({
      status: 200,
      message: msg.FEEDBACK_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all feedback
const getAllFeedback = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    //NOTE - add pagination
    const query =
      page && limit
        ? {
            offset: Number(page - 1) * limit,
            limit: Number(limit),
          }
        : {};

    //NOTE - filter based on id, name
    const val = search
      ? {
          [Op.or]: [{ id: search }, { name: { [Op.like]: `%${search}%` } }],
        }
      : undefined;

    let studentIds;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const teachersSubject = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: ["classId", "batchTypeId"],
        });

        //NOTE - push all user class Ids for
        const classesIds = teachersSubject.map((item) => item.classId);

        //NOTE - push all batch ids
        const batchIds = teachersSubject.map((item) => item.batchTypeId);

        //NOTE - params based on class or batch type
        const idParams = batchIds.every((id) => id === null)
          ? { classId: { [Sequelize.Op.in]: classesIds } }
          : { batchTypeId: { [Sequelize.Op.in]: batchIds } };

        //NOTE - find student data based on the batchType
        const students = await StudentDetails.findAll({
          where: {
            ...idParams,
          },
        });

        //NOTE - push all user type ids for student ids
        const type_id = students.map((item) => item.dataValues.id);

        //NOTE - send typeIds based on the batch type id
        studentIds = {
          id: {
            [Sequelize.Op.in]: type_id,
          },
        };
      }

    //NOTE - get all feedback
    const { count, rows } = await Feedback.findAndCountAll({
      ...query,
      include: [
        {
          model: UserDetails,
          attributes: ["name", "phone"],
          where: {
            ...val,
            ...studentIds,
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!rows)
      return res
        .status(200)
        .send({ status: 200, message: msg.FEEDBACK_NOT_FOUND, data: [] });

    //NOTE - push final data
    const response = rows.map((allFeedback) => ({
      id: allFeedback.id,
      studentId: allFeedback.studentId,
      student: allFeedback.user?.name,
      phone: allFeedback.user?.phone,
      feedback: allFeedback?.feedback,
      createdAt: allFeedback.createdAt,
      updatedAt: allFeedback.updatedAt,
    }));

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: response,
    });
  } catch (err) {
    return Response(res, 500, err.message);
  }
};

//ANCHOR : get feedback by id
const getFeedbackById = async (req, res) => {
  try {
    const getFeedback = await Feedback.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ["updatedAt"],
      },
      include: {
        model: UserDetails,
        attributes: ["name"],
      },
    });

    let feedback = {
      id: getFeedback.id,
      studentId: getFeedback.studentId,
      student: getFeedback.user?.name,
      feedback: getFeedback.feedback,
      createdAt: getFeedback.createdAt,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: feedback,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete Feedback
const deleteFeedbackById = async (req, res) => {
  try {
    const getFeedback = await Feedback.findOne({
      where: { id: req.params.id },
    });
    if (!getFeedback) {
      return res
        .status(400)
        .send({ status: 400, message: msg.FEEDBACK_NOT_FOUND });
    }
    await Feedback.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).send({ status: 200, message: msg.FEEDBACK_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  deleteFeedbackById,
};
