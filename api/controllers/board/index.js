const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Response } = require("../../helpers/response.helper");
const { Op } = require("sequelize");
const _ = require("lodash");
const Boards = db.boards;
const Course = db.courses;
const batchType = db.batchTypes;
const Class = db.class;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const RolePermission = db.permissionRole;

//ANCHOR: create Boards
const createBoards = async (req, res) => {
  try {
    const { courseId, name } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    const board = await Boards.findOne({
      where: { courseId: courseId, name: name },
    });
    if (board) {
      return res.status(400).send({
        status: 400,
        message: msg.BOARD_ALREADY_EXIST,
      });
    }

    const boards = new Boards({
      courseId: courseId,
      name: name.replace(/\s+/g, " ").trim(),
      createdById: id,
    });

    await boards.save();
    return Response(res, 200, msg.BOARD_CREATED);
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get one Boards
const getBoardsById = async (req, res) => {
  try {
    const board = await Boards.findOne({
      where: { id: req.params.id },
      include: {
        model: Course,
        attributes: ["name"],
      },
    });

    if (!board) {
      return res
        .status(400)
        .send({ status: 400, message: msg.BOARD_NOT_FOUND });
    }

    //NOTE - push final data
    const result = {
      id: board.id,
      name: board.name,
      courseId: board.courseId,
      course: board.course?.name,
      status: board?.status === 1 ? 1 : 0,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
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

//ANCHOR get Boards BY COURSE ID
const getBoardsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.body;

    //NOTE - If login by a teacher or mentor
    let boardId;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const staffDetails = await TeacherSubjectMap.findOne({
          where: { teacherId: req.user.id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        //NOTE - send board Id of teacher
        boardId = {
          id: staffDetails.boardId,
        };
      }

    //NOTE - get all board details
    const board = await Boards.findAll({
      where: { courseId: courseId, ...boardId, status: 1 },
      include: { model: Course, attributes: ["name"] },
    });

    if (!board)
      return res
        .status(200)
        .send({ status: 200, message: msg.BOARD_NOT_FOUND, data: [] });

    //NOTE - push final data
    const result = board.map((data) => ({
      id: data.id,
      name: data.name,
      courseId: data.courseId,
      course: data.course?.name,
      status: board?.status === 1 ? 1 : 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all Boards
const getAllBoards = async (req, res) => {
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

    //NOTE - search based name and id
    const searchParams = search
      ? {
          [Op.or]: [{ id: search }, { name: { [Op.like]: `%${search}%` } }],
        }
      : undefined;

    //NOTE - check status if all then return only status 1
    const activeParams =
      status === "all"
        ? undefined
        : status === "active"
        ? { status: 1 }
        : status === "inactive"
        ? { status: 0 }
        : { status: 1 };

    //NOTE - If login by a teacher or mentor
    let boardId;
    if (req.user)
      if (["teacher", "mentor", "Teacher", "Mentor"].includes(req.user?.role)) {
        //NOTE - get Teacher subject details
        const staffDetails = await TeacherSubjectMap.findOne({
          where: { teacherId: req.user.id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        //NOTE - send board Id of teacher
        boardId = {
          id: staffDetails.boardId,
        };
      }

    const { count, rows } = await Boards.findAndCountAll({
      ...query,
      where: { ...searchParams, ...boardId, ...activeParams },
      include: [
        { model: Course, attributes: ["name"] },
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
        .send({ status: 200, message: msg.BOARD_NOT_FOUND, data: [] });

    //NOTE - push final data
    const result = rows.map((data) => ({
      id: data.id,
      courseId: data.courseId,
      name: data.name,
      course: data.course?.name,
      status: data?.status === 1 ? 1 : 0,
      createdByName: data.creator?.name,
      createdByRole: data.creator?.permission_role?.role,
      updateByName: data.updater ? data.updater?.name : null,
      updateByRole: data.updater ? data.updater?.permission_role.role : null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
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

//ANCHOR: update Boards
const updateBoards = async (req, res) => {
  try {
    const { courseId, name, status } = req.body;

    //NOTE - userId from token
    const userId = req.user.id;

    //NOTE - board id
    const boardId = req.params.id;

    const board = await Boards.findOne({
      where: { id: boardId },
    });

    if (!board)
      return res
        .status(400)
        .send({ status: 400, message: msg.BOARD_NOT_FOUND });

    //NOTE - find data from db
    let dbObject = {
      courseId: board.courseId,
      name: board.name.toLowerCase(),
    };

    //NOTE -data given by the user
    let userObject = {
      courseId: courseId,
      name: name.toLowerCase(),
    };

    //NOTE - payload for push data
    let payload = {
      courseId: courseId,
      name: name.replace(/\s+/g, " ").trim(),
      status: status,
      updatedById: userId,
    };

    //NOTE - If same name is coming update it
    if (
      dbObject.name === userObject.name &&
      dbObject.courseId === userObject.courseId
    ) {
      await Boards.update(payload, {
        where: { id: boardId },
      });
    } else {
      //NOTE - If name not same check the name in db, if its's exist or not
      const getBoards = await Boards.findOne({
        where: {
          courseId: courseId,
          name: name,
        },
      });
      if (getBoards) {
        return res.status(400).send({
          status: 400,
          message: msg.BOARD_ALREADY_EXIST,
        });
      } else {
        await Boards.update(payload, {
          where: { id: boardId },
        });
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.BOARD_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: delete Boards
const deleteBoards = async (req, res) => {
  try {
    const board = await Boards.findOne({
      where: { id: req.params.id },
    });
    if (!board)
      return res
        .status(200)
        .send({ status: 200, message: msg.BOARD_NOT_FOUND });

    //NOTE - delete board
    await board.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({ status: 200, message: msg.BOARD_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get BatchType and Class by board id
const getBatchTypeClassByBoardId = async (req, res) => {
  try {
    const { boardId } = req.body;

    const getBatchType = await batchType.findAll({
      where: { boardId: boardId, status: 1 },
      include: [{ model: Class, attributes: ["id", "name"] }],
    });


    if (!getBatchType)
      return res
        .status(400)
        .send({ status: 400, message: msg.BATCH_TYPE_NOT_FOUND });

    //NOTE - Push final value
    const result = getBatchType.map((data) => ({
      boardId: boardId,
      batchTypeId: data.id,
      batchType: data.name,
      classId: data.classId,
      class: data.class?.name,
    }));

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR get Boards BY COURSE ID
const getBoardsByCourseIdForWebApp = async (req, res) => {
  try {
    const { courseId } = req.body;

    //NOTE - get all board details
    const board = await Boards.findAll({
      where: { courseId: courseId, status: 1 },
      include: { model: Course, attributes: ["name"] },
    });
    if (!board)
      return res
        .status(200)
        .send({ status: 200, message: msg.BOARD_NOT_FOUND, data: [] });

    //NOTE - push final data
    const result = board.map((data) => ({
      id: data.id,
      name: data.name,
      courseId: data.courseId,
      course: data.course?.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: update Boards status
const updateBoardStatus = async (req, res) => {
  try {
    const { status, boardId } = req.body;

    //NOTE - userId from token
    const userId = req.user.id;

    const board = await Boards.findOne({
      where: { id: boardId },
    });
    if (!board)
      return res
        .status(400)
        .send({ status: 400, message: msg.BOARD_NOT_FOUND });

    //NOTE - update status
    await Boards.update(
      { status: status, updatedById: userId },
      { where: { id: boardId } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.BOARD_STATUS_UPDATE,
    });
    
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createBoards,
  getBoardsById,
  getBoardsByCourseId, //TODO - use in admin panel
  getAllBoards,
  updateBoards,
  deleteBoards,
  getBatchTypeClassByBoardId,
  getBoardsByCourseIdForWebApp, //TODO - use in web and mobile
  updateBoardStatus,
};
