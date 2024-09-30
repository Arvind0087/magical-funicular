const db = require("../../models/index");
const msg = require("../../constants/Messages");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const getSignedUrl = require("../../helpers/getSignedUrl");
const { Op } = require("sequelize");
const _ = require("lodash");
const Courses = db.courses;
const UserData = db.users;
const StudentDetails = db.student;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const RolePermission = db.permissionRole;

//ANCHOR:  create courses
const createCourse = async (req, res) => {
  try {
    const { name, image, shortDescription, list } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    //NOTE - find course details exist or not
    const newCourses = await Courses.findOne({
      where: { name: name },
    });

    if (newCourses)
      return res.status(400).send({
        status: 400,
        message: msg.COURSE_ALREADY_EXIST,
      });

    //NOTE: payload for create courses
    let payload = {
      name: name.replace(/\s+/g, " ").trim(),
      shortDescription: shortDescription,
      list: list,
      createdById: id,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(image, msg.COURSE_FOLDER_CREATED);
      payload = { ...payload, image: uploadImage.Key };
    }

    const course = new Courses(payload);
    await course.save();

    return res.status(200).send({
      status: 200,
      message: msg.COURSE_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get one course
const getCourse = async (req, res) => {
  try {
    //NOTE - find course details
    const course = await Courses.findOne({
      where: { id: req.params.id },
    });

    if (!course)
      return res
        .status(400)
        .send({ status: 400, message: msg.COURSE_NOT_FOUND });

    course.image = await getSignedUrl(course.dataValues.image);

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: course,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all courses
const getAllCourses = async (req, res) => {
  try {
    const { page, limit, search, status } = req.query;

    //NOTE - add pagination
    const query =
      page && limit
        ? {
            offset: Number(page - 1) * limit,
            limit: Number(limit),
          }
        : {};

    let searchParams;
    if (search) {
      if (/^\d/.test(search) && search.includes("-")) {
        const [start, end] = search.split("-").map(Number);
        searchParams = { name: { [Op.between]: [start, end] } };
      } else {
        searchParams = {
          [Op.or]: [{ id: search }, { name: { [Op.like]: `%${search}%` } }],
        };
      }
    }

    //NOTE - check status if all then return only status 1
    const value =
      status === "all"
        ? undefined
        : status === "active"
        ? { status: 1 }
        : status === "inactive"
        ? { status: 0 }
        : { status: 1 };

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const staffDetails = await TeacherSubjectMap.findOne({
          where: { teacherId: req.user.id },
          attributes: ["courseId"],
        });
        //NOTE - send course Id of teacher
        params = {
          id: staffDetails.courseId,
        };
      }

    //NOTE - find course details
    const { rows, count } = await Courses.findAndCountAll({
      ...query,
      where: {
        ...searchParams,
        ...params, //TODO - only send course id of the user
        ...value,
      },
      include: [
        {
          model: AdminUser,
          as: "creator",
          attributes: ["id", "name"],
          include: {
            model: RolePermission,
            attributes: ["role"],
          },
        },
        {
          model: AdminUser,
          as: "updater",
          attributes: ["id", "name"],
          include: {
            model: RolePermission,
            attributes: ["role"],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!rows)
      return res
        .status(200)
        .send({ status: 200, message: msg.COURSE_NOT_FOUND, data: [] });

    //NOTE - push final data
    const result = await Promise.all(
      rows.map(async (allCourses) => {
        const imageUrl = allCourses.dataValues.image
          ? await getSignedUrl(allCourses.dataValues.image)
          : null;

        return {
          id: allCourses.id,
          name: allCourses.name,
          image: imageUrl,
          shortDescription: allCourses.shortDescription,
          list: allCourses.list,
          status: allCourses.status,
          createdByName: allCourses.creator ? allCourses.creator?.name : null,
          createdByRole: allCourses.creator
            ? allCourses.creator?.permission_role?.role
            : null,
          updateByName: allCourses.updater ? allCourses.updater?.name : null,
          updateByRole: allCourses.updater
            ? allCourses.updater?.permission_role.role
            : null,
          createdAt: allCourses.createdAt,
          updatedAt: allCourses.updatedAt,
        };
      })
    );

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

//ANCHOR : update courses
const updateCoursesById = async (req, res) => {
  try {
    let { name, image, shortDescription, list, courseId } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    const course = await Courses.findOne({
      where: { id: courseId },
    });

    if (!course) {
      return res
        .status(400)
        .send({ status: 400, message: msg.COURSE_NOT_FOUND });
    }

    let obj1 = {
      id: course.id,
      name: course.name,
    };

    let obj2 = {
      id: courseId,
      name: name,
    };

    //NOTE: check if the same name of course is already exist or not
    if (!_.isEqual(obj1, obj2)) {
      const getCourses = await Courses.findOne({
        where: {
          name: name,
        },
      });

      if (getCourses)
        return res.status(400).send({
          status: 400,
          message: msg.COURSE_ALREADY_EXIST,
        });
    }

    ///NOTE - payload for update course
    let payload = {
      name: name.replace(/\s+/g, " ").trim(),
      shortDescription: shortDescription,
      list: list,
      updatedById: id,
    };
    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(image, msg.COURSE_FOLDER_CREATED);
      payload = { ...payload, image: uploadImage.Key };
    }

    await Courses.update(payload, {
      where: { id: courseId },
    });

    return res.status(200).send({
      status: 200,
      message: msg.COURSE_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get one course by student id
const getCourseByStudentId = async (req, res) => {
  try {
    //NOTE - get user id for token
    const userId = req.user.id;

    //NOTE - get user details
    const userDetails = await UserData.findOne({
      where: {
        id: userId,
      },
      include: {
        model: StudentDetails,
        attributes: ["courseId"],
        include: { model: Courses, attributes: ["name", "shortDescription"] },
      },
    });

    if (!userDetails)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    //NOTE : push final response
    const result = {
      id: userDetails.student?.courseId,
      courseName: userDetails.student?.course?.name,
      description: userDetails.student?.course?.shortDescription,
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

//ANCHOR : delete course
const deleteCourse = async (req, res) => {
  try {
    const course = await Courses.findOne({
      where: { id: req.params.id },
    });
    if (!course) {
      return res
        .status(400)
        .send({ status: 400, message: msg.COURSE_NOT_FOUND });
    }
    await course.destroy({
      where: {
        id: course.id,
      },
    });
    return res.status(200).send({ status: 200, message: msg.COURSE_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all courses
const getAllCoursesForWebApp = async (req, res) => {
  try {
    const courseDetails = await Courses.findAll({
      where: { status: 1 },
      order: [["createdAt", "DESC"]],
    });

    if (!courseDetails)
      return res
        .status(200)
        .send({ status: 200, message: msg.COURSE_NOT_FOUND, data: [] });

    //NOTE - push final data
    const result = await Promise.all(
      courseDetails.map(async (allCourses) => {
        const imageUrl = allCourses.dataValues.image
          ? await getSignedUrl(allCourses.dataValues.image)
          : null;

        return {
          id: allCourses.id,
          name: allCourses.name,
          image: imageUrl,
          shortDescription: allCourses.shortDescription,
          list: allCourses.list,
        };
      })
    );

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: update course status
const updateCourseStatus = async (req, res) => {
  try {
    const { status, courseId } = req.body;

    //NOTE - userId from token
    const userId = req.user.id;

    const getCourses = await Courses.findOne({
      where: { id: courseId },
    });
    if (!getCourses)
      return res
        .status(200)
        .send({ status: 200, message: msg.COURSE_NOT_FOUND, data: [] });

    //NOTE - payload for push data
    let payload = {
      status: status,
      updatedById: userId,
    };

    //NOTE - update status
    await Courses.update(payload, {
      where: { id: courseId },
    });

    return res.status(200).send({
      status: 200,
      message: msg.COURSE_STATUS_UPDATE,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createCourse,
  getCourse,
  getAllCourses,
  updateCoursesById,
  deleteCourse,
  getCourseByStudentId,
  getAllCoursesForWebApp, //TODO - use in web and mobile
  updateCourseStatus,
};
