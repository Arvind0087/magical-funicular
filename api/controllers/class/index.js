const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize } = require("sequelize");
const _ = require("lodash");
const Class = db.class;
const Course = db.courses;
const Boards = db.boards;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const BatchType = db.batchTypes;
const RolePermission = db.permissionRole;

//ANCHOR : create class
const createClass = async (req, res) => {
  try {
    const { courseId, boardId, name, telegramUrl } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    const Classes = await Class.findOne({
      where: { courseId: courseId, boardId: boardId, name: name },
    });
    if (Classes)
      return res.status(400).send({
        status: 400,
        message: msg.CLASS_ALREADY_EXIST,
      });

    const newClass = new Class({
      courseId: courseId,
      boardId: boardId,
      name: name.replace(/\s+/g, " ").trim(),
      telegramUrl: telegramUrl,
      createdById: id,
    });

    await newClass.save();
    return res.status(200).send({
      status: 200,
      message: msg.CLASS_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get one class
const getClassById = async (req, res) => {
  try {
    //NOTE - get class deatils
    const getClass = await Class.findOne({
      where: { id: req.params.id },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
      ],
    });

    if (!getClass)
      return res
        .status(400)
        .send({ status: 400, message: msg.CLASS_NOT_FOUND });

    //NOTE - push final result
    const result = {
      id: getClass.id,
      name: getClass.name,
      courseId: getClass.courseId,
      course: getClass.course?.name,
      boardId: getClass.boardId,
      board: getClass.board?.name,
      telegramLink: getClass.telegramUrl,
      status: getClass.status,
      createdAt: getClass.createdAt,
      updatedAt: getClass.updatedAt,
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

//ANCHOR : get class by board id
const getClassByBoardId = async (req, res) => {
  try {
    const { boardId } = req.body;

    let params;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const staffDetails = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: ["classId"],
        });

        //NOTE - push all user class Ids for
        const classIds = staffDetails.map((item) => item.classId);

        //NOTE - send class Id of teacher
        params = {
          id: {
            [Sequelize.Op.in]: classIds,
          },
        };
      }

    //NOTE - Find board details
    const board = await Boards.findOne({
      where: { id: boardId },
    });

    //NOTE - get all class details
    const getClass = await Class.findAll({
      where: {
        courseId: board.courseId,
        boardId: boardId,
        ...params,
        status: 1,
      },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
      ],
    });

    if (!getClass)
      return res
        .status(400)
        .send({ status: 400, message: msg.CLASS_NOT_FOUND });

    //NOTE - push all final result
    const response = getClass.map((data) => ({
      id: data.id,
      name: data.name,
      courseId: data.courseId,
      course: data.course?.name,
      boardId: data.boardId,
      board: data.board?.name,
      telegramLink: data?.telegramUrl,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: response,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all class
const getAllClass = async (req, res) => {
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

    ///NOTE - search based id
    const val = search ? { id: search } : {};

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
        const teacherDetails = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: ["classId"],
        });

        //NOTE - push all user class Ids for
        const classIds = teacherDetails.map((item) => item.classId);

        //NOTE - send class Id of teacher
        params = {
          id: {
            [Sequelize.Op.in]: classIds,
          },
        };
      }

    //NOTE - get all class details
    const { count, rows } = await Class.findAndCountAll({
      ...query,
      where: { ...val, ...params, ...value },

      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
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
        .send({ status: 200, message: msg.CLASS_NOT_FOUND, data: [] });

    //NOTE - push final result
    const result = rows.map((allClass) => ({
      id: allClass.id,
      courseId: allClass.courseId,
      className: allClass.name,
      course: allClass.course?.name,
      boardId: allClass.boardId,
      board: allClass.board?.name,
      telegramLink: allClass?.telegramUrl,
      status: allClass.status,
      createdByName: allClass.creator?.name,
      createdByRole: allClass.creator?.permission_role?.role,
      updateByName: allClass.updater ? allClass.updater?.name : null,
      updateByRole: allClass.updater
        ? allClass.updater?.permission_role.role
        : null,
      createdAt: allClass.createdAt,
      updatedAt: allClass.updatedAt,
    }));

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

//ANCHOR : update class by Id
const updateClassById = async (req, res) => {
  try {
    const { classId, courseId, boardId, name, telegramUrl } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    //NOTE: Find class details
    const getClass = await Class.findOne({
      where: { id: classId },
    });
    if (!getClass)
      return res
        .status(400)
        .send({ status: 400, message: msg.CLASS_NOT_FOUND });

    //NOTE - find data from db
    let dbObject = {
      courseId: getClass.courseId,
      boardId: getClass.boardId,
      name: getClass.name.toLowerCase(),
    };

    //NOTE -data given by the user
    let userObject = {
      courseId: courseId,
      boardId: boardId,
      name: name.toLowerCase(),
    };

    //NOTE - payload for push data
    let payload = {
      courseId: courseId,
      boardId: boardId,
      name: name.replace(/\s+/g, " ").trim(),
      telegramUrl: telegramUrl,
      updatedById: id,
    };

    //NOTE - If same name is coming update it
    if (
      dbObject.name === userObject.name &&
      dbObject.boardId === userObject.boardId &&
      dbObject.courseId === userObject.courseId
    ) {
      await Class.update(payload, {
        where: { id: classId },
      });
    } else {
      const getClass = await Class.findOne({
        where: {
          courseId: courseId,
          boardId: boardId,
          name: name,
        },
      });
      if (getClass) {
        return res.status(400).send({
          status: 400,
          message: msg.CLASS_ALREADY_EXIST,
        });
      } else {
        //NOTE - if class not found update it
        await Class.update(payload, {
          where: { id: classId },
        });
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.CLASS_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete class
const deleteClassById = async (req, res) => {
  try {
    const getClass = await Class.findOne({
      where: { id: req.params.id },
    });
    if (!getClass)
      return res
        .status(400)
        .send({ status: 400, message: msg.CLASS_NOT_FOUND });

    await Class.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({ status: 200, message: msg.CLASS_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get class by board id
const getClassByBoardIdForWebApp = async (req, res) => {
  try {
    const { boardId } = req.body;

    //NOTE - Find board details
    const board = await Boards.findOne({
      where: { id: boardId },
    });

    //NOTE - get all class details
    const getClass = await Class.findAll({
      where: { courseId: board.courseId, boardId: boardId, status: 1 },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
      ],
    });

    if (!getClass)
      return res
        .status(200)
        .send({ status: 200, message: msg.CLASS_NOT_FOUND, data: [] });

    //NOTE - push all final result
    const response = getClass.map((data) => ({
      id: data.id,
      name: data.name,
      courseId: data.courseId,
      course: data.course?.name,
      boardId: data.boardId,
      board: data.board?.name,
      telegramLink: data?.telegramUrl,
    }));

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: response,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: update Class status
const updateClassStatus = async (req, res) => {
  try {
    const { status, classId } = req.body;

    //NOTE - userId from token
    const userId = req.user.id;

    const getClass = await Class.findOne({
      where: { id: classId },
    });
    if (!getClass)
      return res
        .status(200)
        .send({ status: 200, message: msg.CLASS_NOT_FOUND, data: [] });

    //NOTE - update status
    await Class.update(
      { status: status, updatedById: userId },
      {
        where: { id: classId },
      }
    );

    return res.status(200).send({
      status: 200,
      message: msg.CLASS_STATUS_UPDATE,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createClass,
  getClassById,
  getClassByBoardId,
  getAllClass,
  updateClassById,
  deleteClassById,
  getClassByBoardIdForWebApp,
  updateClassStatus,
};
