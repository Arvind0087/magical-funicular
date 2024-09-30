const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize, Op } = require("sequelize");
const { getActiveParams } = require("./service");
const _ = require("lodash");
const batchType = db.batchTypes;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const RolePermission = db.permissionRole;

//ANCHOR : create dataType
const addBatchType = async (req, res) => {
  try {
    const { courseId, boardId, classId, name } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    const BatchType = await batchType.findOne({
      where: {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        name: name,
      },
    });
    if (BatchType) {
      return res.status(400).send({
        status: 400,
        message: msg.BATCH_TYPE_ALREADY_EXIST,
      });
    }

    const newBatchType = new batchType({
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      name: name.replace(/\s+/g, " ").trim(),
      createdById: id,
    });

    await newBatchType.save();
    return res.status(200).send({
      status: 200,
      message: msg.BATCH_CREATED,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ status: 500, message: err.message, data: [] });
  }
};

//ANCHOR : get batchType by id
const getBatchTypeById = async (req, res) => {
  try {
    const getBatchType = await batchType.findOne({
      where: { id: req.params.id },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
      ],
    });
    if (!getBatchType) {
      return res
        .status(400)
        .send({ status: 400, message: msg.BATCH_TYPE_NOT_FOUND });
    }

    const result = {
      id: getBatchType.id,
      name: getBatchType.name,
      courseId: getBatchType.courseId,
      course: getBatchType.course?.name,
      boardId: getBatchType.boardId,
      board: getBatchType.board?.name,
      classId: getBatchType.classId,
      class: getBatchType.class?.name,
      status: getBatchType.status,
      createdAt: getBatchType.createdAt,
      updatedAt: getBatchType.updatedAt,
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

//ANCHOR : get batchType by all ids
const getBatchTypeByClassId = async (req, res) => {
  try {
    const { classId } = req.body;

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (["teacher", "mentor"].includes(req?.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const teacherDetails = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });

        //NOTE - push all batch ids
        const batchIds = teacherDetails.map(
          (item) => item.dataValues.batchTypeId
        );

        params = batchIds.every((id) => id === null)
          ? { classId }
          : {
              id: { [Sequelize.Op.in]: batchIds.filter((id) => id !== null) },
              classId,
            };
      }

    //NOTE - Get all class details
    const getClass = await Class.findOne({
      where: { id: classId },
    });

    //NOTE - parameter based on the token
    let parameter;
    if (["teacher", "mentor"].includes(req?.user?.role.toLowerCase())) {
      parameter = {
        ...params,
      };
    } else {
      parameter = {
        courseId: getClass.courseId,
        boardId: getClass.boardId,
        classId: classId,
      };
    }

    //NOTE - Get all batch details
    const getBatchType = await batchType.findAll({
      where: {
        ...parameter,
        status: 1,
      },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
      ],
    });
    if (!getBatchType)
      return res
        .status(200)
        .send({ status: 200, message: msg.BATCH_TYPE_NOT_FOUND, data: [] });

    //NOTE: final push result

    const result = getBatchType.map((item) => ({
      id: item.id,
      name: item.name,
      courseId: item.courseId,
      course: item.course?.name,
      boardId: item.boardId,
      board: item.board?.name,
      classId: item.classId,
      class: item.class?.name,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
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

//ANCHOR : get all batchType
const getAllBatchType = async (req, res) => {
  try {
    const { page, limit, search, classes, status } = req.query;

    //NOTE - add pagination
    const query =
      page && limit
        ? {
            offset: Number(page - 1) * limit,
            limit: Number(limit),
          }
        : {};

    //NOTE - filter based on id ,name and type
    const val = search
      ? {
          [Op.or]: [
            { id: search },
            { name: { [Op.like]: "%" + search + "%" } },
          ],
        }
      : {};
    //NOTE - filter based on classId
    if (classes) {
      val.classId = classes;
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
      if (["teacher", "mentor", "Teacher", "Mentor"].includes(req.user?.role)) {
        //NOTE - get Teacher subject details
        const staffDetails = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: ["classId", "batchTypeId"],
        });
        //NOTE - push all user class Ids for
        const classIds = staffDetails.map((item) => item.classId);

        //NOTE - push all batch ids
        const batchIds = staffDetails.map((item) => item.batchTypeId);

        //NOTE - params based on class or batch type
        params = batchIds.every((id) => id === null)
          ? { classId: { [Sequelize.Op.in]: classIds } }
          : { id: { [Sequelize.Op.in]: batchIds } };
      }

    const { count, rows } = await batchType.findAndCountAll({
      ...query,
      where: { ...val, ...params, ...value },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
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
        .send({ status: 200, message: msg.BATCH_TYPE_NOT_FOUND, data: [] });

    //NOTE - push final result
    const result = rows.map((allBatchType) => ({
      id: allBatchType.id,
      batchTypeName: allBatchType?.name,
      courseId: allBatchType.courseId,
      course: allBatchType.course?.name,
      boardId: allBatchType.boardId,
      board: allBatchType.board?.name,
      classId: allBatchType.classId,
      class: allBatchType.class?.name,
      status: allBatchType.status,
      createdByName: allBatchType.creator ? allBatchType.creator?.name : null,
      createdByRole: allBatchType.creator
        ? allBatchType.creator?.permission_role?.role
        : null,
      updateByName: allBatchType.updater ? allBatchType.updater?.name : null,
      updateByRole: allBatchType.updater
        ? allBatchType.updater?.permission_role.role
        : null,
      createdAt: allBatchType.createdAt,
      updatedAt: allBatchType.updatedAt,
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

//ANCHOR : update BatchType
const updateBatchTypeById = async (req, res) => {
  try {
    const { batchTypeId, courseId, boardId, classId, name } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    //NOTE - Find batch type
    const getBatchType = await batchType.findOne({
      where: { id: batchTypeId },
    });
    if (!getBatchType)
      return res
        .status(400)
        .send({ status: 400, message: msg.BATCH_TYPE_NOT_FOUND });

    //NOTE - find data from db
    let dbObject = {
      courseId: getBatchType.courseId,
      boardId: getBatchType.boardId,
      classId: getBatchType.classId,
      name: getBatchType.name.toLowerCase(),
    };

    //NOTE -data given by the user
    let userObject = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      name: name.toLowerCase(),
    };

    //NOTE - payload for push data
    let payload = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      name: name.replace(/\s+/g, " ").trim(),
      updatedById: id,
    };

    //NOTE - If same name is coming update it
    if (
      dbObject.name === userObject.name &&
      dbObject.classId === userObject.classId &&
      dbObject.boardId === userObject.boardId &&
      dbObject.courseId === userObject.courseId
    ) {
      await batchType.update(payload, {
        where: { id: batchTypeId },
      });
    } else {
      //NOTE - if different name is check batchtype  is already exist or not
      const getBatchType = await batchType.findOne({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          name: name,
        },
      });

      if (getBatchType) {
        return res.status(400).send({
          status: 400,
          message: msg.BATCH_TYPE_ALREADY_EXIST,
        });
      } else {
        //NOTE - if batch type not found update it
        await batchType.update(payload, {
          where: { id: batchTypeId },
        });
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.BATCH_TYPE_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: delete BatchType
const deleteBatchTypeById = async (req, res) => {
  try {
    const getBatchType = await batchType.findOne({
      where: { id: req.params.id },
    });
    if (!getBatchType) {
      return res
        .status(400)
        .send({ status: 400, message: msg.BATCH_TYPE_NOT_FOUND });
    }
    await batchType.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res
      .status(200)
      .send({ status: 200, message: msg.BATCH_TYPE_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Get multiple batch based on class id
const getMultipleBatch = async (req, res) => {
  try {
    const { classIds } = req.body;

    //NOTE - Find batch type based on class
    const getBatchType = await batchType.findAll({
      where: {
        classId: {
          [Sequelize.Op.in]: classIds,
        },
        status: 1,
      },
      include: {
        model: Class,
        attributes: ["name"],
      },
    });

    if (!getBatchType)
      return res
        .status(400)
        .send({ status: 400, message: msg.BATCH_TYPE_NOT_FOUND });

    //NOTE - push final data
    const result = getBatchType.map((data) => ({
      id: data.id,
      batchType: data.name,
      classId: data.classId,
      className: data.class?.name,
    }));

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

const getBatchByBoardId = async (req, res) => {
  try {
    const { boardId } = req.query;

    //NOTE : get class and batch type based on active, inactive and teacher
    const params = await getActiveParams(boardId, req.user?.role, req.user?.id);

    //NOTE - Get all batch details
    const getBatchType = await batchType.findAll({
      where: { boardId: boardId, ...params, status: 1 },
      include: [{ model: Class, attributes: ["name"] }],
    });

    if (!getBatchType)
      return res
        .status(200)
        .send({ status: 200, message: msg.BATCH_TYPE_NOT_FOUND, data: [] });

    //NOTE: final push result
    const result = getBatchType.map((data) => ({
      id: data.id,
      name: data.name,
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

//ANCHOR : get batchType by all ids
const getBatchTypeByClassIdForWebApp = async (req, res) => {
  try {
    const { classId } = req.body;

    //NOTE - Get all class details
    const getClass = await Class.findOne({
      where: { id: classId },
    });

    //NOTE - Get all batch details
    const getBatchType = await batchType.findAll({
      where: {
        courseId: getClass.courseId,
        boardId: getClass.boardId,
        classId: getClass.id,
        status: 1,
      },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
      ],
    });
    if (!getBatchType)
      return res
        .status(200)
        .send({ status: 200, message: msg.BATCH_TYPE_NOT_FOUND, data: [] });

    //NOTE: final push result

    const result = getBatchType.map((item) => ({
      id: item.id,
      name: item.name,
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

//ANCHOR: update batch status
const updateBatchTypeStatus = async (req, res) => {
  try {
    const { status, batchTypeId } = req.body;

    //NOTE - userId from token
    const userId = req.user.id;

    const getBatch = await batchType.findOne({
      where: { id: batchTypeId },
    });
    if (!getBatch)
      return res
        .status(200)
        .send({ status: 200, message: msg.BATCH_TYPE_NOT_FOUND, data: [] });

    //NOTE - payload for push data
    let payload = {
      status: status,
      updatedById: userId,
    };

    //NOTE - update status
    await batchType.update(payload, {
      where: { id: batchTypeId },
    });

    return res.status(200).send({
      status: 200,
      message: msg.BATCH_TYPE_STATUS_UPDATE,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  addBatchType,
  getBatchTypeById,
  getBatchTypeByClassId,
  getAllBatchType,
  updateBatchTypeById,
  deleteBatchTypeById,
  getMultipleBatch,
  getBatchByBoardId,
  getBatchTypeByClassIdForWebApp,
  updateBatchTypeStatus,
};
