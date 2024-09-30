const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize, Op} = require("sequelize");
const batchDate = db.batchDate;
const batchType = db.batchTypes;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const RolePermission = db.permissionRole;

//ANCHOR : create dataDate
const addBatchDate = async (req, res) => {
  try {
    const { courseId, boardId, classId, batchTypeId, batchName , date } = req.body;

    //NOTE - id from token
    const id = req.user.id;

     const BatchName = await batchDate.findOne({
      where: {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
        batchName:batchName,
      
      },
    });
    if (BatchName)
      return res.status(400).send({
        status: 400,
        message: msg.BATCH_NAME_ALREADY_EXIST,
      });  


    const BatchDate = await batchDate.findOne({
      where: {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
        date: date,
      },
    });
    if (BatchDate)
      return res.status(400).send({
        status: 400,
        message: msg.BATCH_DATE_ALREADY_EXIST,
      });  

    const newBatchDate = new batchDate({
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      batchName:batchName,
      date: date,
      createdById: id,
    });

    await newBatchDate.save();
    return res.status(200).send({
      status: 200,
      message: msg.BATCH_DATE_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get one dataDate
const getBatchDateById = async (req, res) => {
  try {
    const getBatchDate = await batchDate.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
      ],
    });
    if (!getBatchDate)
      return res
        .status(400)
        .send({ status: 400, message: msg.BATCH_DATE_NOT_FOUND });

    //NOTE - push final data
    const result = {
      id: getBatchDate.id,
      date: getBatchDate.date,
      courseId: getBatchDate.courseId,
      course: getBatchDate.course?.name,
      boardId: getBatchDate.boardId,
      board: getBatchDate.board?.name,
      classId: getBatchDate.classId,
      class: getBatchDate.class?.name,
      status: getBatchDate.status,
      batchTypeId: getBatchDate.batchTypeId,
      batchType: getBatchDate.batchType?.name,
      batchName:getBatchDate.batchName,//sarvendra Changes//
      createdAt: getBatchDate.createdAt,
      updatedAt: getBatchDate.updatedAt,
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

//ANCHOR: get dataDate all course,board,class,batchType ids
const getBatchDateByBatchTypeId = async (req, res) => {
  try {
    const { batchTypeId } = req.body;

    //NOTE - find batch type
    const getBatchType = await batchType.findOne({
      where: { id: batchTypeId },
    });

    //NOTE - find batch date
    const getBatchDate = await batchDate.findAll({
      where: {
        courseId: getBatchType.courseId,
        boardId: getBatchType.boardId,
        classId: getBatchType.classId,
        batchTypeId: batchTypeId,
        status: 1,
      },
    });
    if (!getBatchDate)
      return res
        .status(400)
        .send({ status: 400, message: msg.BATCH_DATE_NOT_FOUND });

    //NOTE - push final data
    const result = getBatchDate.map((data) => ({
      id: data.id,
      date: data.date,
      courseId: data.courseId,
      course: data.course?.name,
      boardId: data.boardId,
      board: data.board?.name,
      classId: data.classId,
      class: data.class?.name,
      status: data.status,
      batchTypeId: data.batchTypeId,
      batchType: data.batchType?.name,
      batchName:data.batchName,//sarvendra Changes//
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

//ANCHOR: get all dataDate
const getAllBatchDate = async (req, res) => {
  try {
    const { page, limit, classes, batches, status } = req.query;
    //NOTE - add pagination
    const query =
      page && limit
        ? {
            offset: Number(page - 1) * limit,
            limit: Number(limit),
          }
        : {};

    //NOTE - if search classes
    const classParams = classes
      ? {
          [Op.or]: [
            { id: classes },
            { name: classes },
            { name: { [Op.like]: "%" + classes + "%" } },
          ],
        }
      : undefined;

    //NOTE - if search batch
    const batchParams = batches
      ? {
          [Op.or]: [
            { id: batches },
            { name: batches },
            { name: { [Op.like]: "%" + batches + "%" } },
          ],
        }
      : undefined;

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
    if (["teacher", "mentor"].includes(req.user.role.toLowerCase())) {
      //NOTE - check teachers details
      const subject_details = await TeacherSubjectMap.findAll({
        where: { teacherId: req.user.id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      const classIds = [];
      const batchTypeIds = [];

      subject_details.forEach((data) => {
        if (data.batchTypeId === null) {
          classIds.push(data.classId);
        } else {
          batchTypeIds.push(data.batchTypeId);
        }
      });

      if (classIds.length > 0 || batchTypeIds.length > 0) {
        params = {};

        if (classIds.length > 0) {
          params.classId = { [Sequelize.Op.in]: classIds };
        }

        if (batchTypeIds.length > 0) {
          params.batchTypeId = { [Sequelize.Op.in]: batchTypeIds };
        }
      }
    }

    //NOTE - get all batch date
    const { count, rows } = await batchDate.findAndCountAll({
      ...query,
      where: { ...params, ...value },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"], where: classParams },
        {
          model: batchType,
          attributes: ["name"],
          where: {
            ...batchParams,
          },
        },
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

    //NOTE - push final data
    const result = rows.map((allBatchDate) => ({
      id: allBatchDate.id,
      date: allBatchDate.date,
      courseId: allBatchDate.courseId,
      boardId: allBatchDate.boardId,
      classId: allBatchDate.classId,
      batchTypeId: allBatchDate.batchTypeId,
      batchDate: allBatchDate.date,
      course: allBatchDate.course?.name,
      board: allBatchDate.board?.name,
      class: allBatchDate.class?.name,
      status: allBatchDate.status,
      batchType: allBatchDate.batchType?.name,
      batchName:allBatchDate.batchName,  //sarvendra changes//
      createdByName: allBatchDate.creator ? allBatchDate.creator?.name : null,
      createdByRole: allBatchDate.creator
        ? allBatchDate.creator?.permission_role?.role
        : null,
      updateByName: allBatchDate.updater ? allBatchDate.updater?.name : null,
      updateByRole: allBatchDate.updater
        ? allBatchDate.updater?.permission_role.role
        : null,
      createdAt: allBatchDate.createdAt,
      updatedAt: allBatchDate.updatedAt,
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

//NOTE: update batchDate by Id 
const updateBatchDateById = async (req, res) => {
  try {
    const { courseId, boardId, classId, batchTypeId, batchDateId, batchName, date } =
      req.body;

    //NOTE - id from token
    const token = req.user.id;

    const getBatchDate = await batchDate.findOne({
      where: { id: batchDateId },
    });
    if (!getBatchDate)
      return res
        .status(400)
        .send({ status: 400, message: msg.BATCH_DATE_NOT_FOUND });

    await batchDate.update(
      {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
        batchName:batchName,
        date: date,
        updatedById: token,
      },
      { where: { id: batchDateId } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.BATCH_DATE_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: delete dataDate
const deleteBatchDateById = async (req, res) => {
  try {
    const getBatchDate = await batchDate.findOne({
      where: { id: req.params.id },
    });
    if (!getBatchDate)
      return res
        .status(400)
        .send({ status: 400, message: msg.BATCH_DATE_NOT_FOUND });
    await batchDate.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res
      .status(200)
      .send({ status: 200, message: msg.BATCH_DATE_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Get multiple batch date based on batch Type
const getMultipleBatchDate = async (req, res) => {
  try {
    const { batchTypeIds } = req.body;

    let allBatchDate = [];

    //NOTE - Find batch Date based on batch type
    const getBatchDate = await batchDate.findAll({
      where: {
        batchTypeId: {
          [Sequelize.Op.in]: batchTypeIds,
        },
        status: 1,
      },

      include: {
        model: batchType,
        attributes: ["name"],
      },
    });
    if (!getBatchDate)
      return res
        .status(400)
        .send({ status: 400, message: msg.BATCH_DATE_NOT_FOUND });

    for (let data of getBatchDate) {
      allBatchDate.push({
        id: data.id,
        batchType: data.batchType?.name,
        date: data.date,
      });
    }
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allBatchDate,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get dataDate all course,board,class,batchType ids
const getBatchDateByBatchTypeIdForWebApp = async (req, res) => {
  try {
    const { batchTypeId } = req.body;

    const getBatchType = await batchType.findOne({
      where: { id: batchTypeId },
    });
    if (!getBatchType)
      return res
        .status(200)
        .send({ status: 200, message: msg.BATCH_TYPE_NOT_FOUND, data: [] });

    const getBatchDate = await batchDate.findAll({
      where: {
        courseId: getBatchType.courseId,
        boardId: getBatchType.boardId,
        classId: getBatchType.classId,
        batchTypeId: batchTypeId,
        status: 1,
      },
    });
    if (!getBatchDate)
      return res
        .status(200)
        .send({ status: 200, message: msg.BATCH_DATE_NOT_FOUND, data: [] });

    //NOTE - push final data
    const result = getBatchDate.map((data) => {
    
      return {
        id: data.id,
        batchName: data.batchName,
        date: data.date,
      };
    });

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: update Date status
const updateBatchDateStatus = async (req, res) => {
  try {
    const { status, batchDateId } = req.body;

    //NOTE - userId from token
    const userId = req.user.id;

    const getBatchDate = await batchDate.findOne({
      where: { id: batchDateId },
    });
    
    if (!getBatchDate)
      return res
        .status(400)
        .send({ status: 400, message: msg.BATCH_DATE_NOT_FOUND });


    //NOTE - update status
    await batchDate.update(
      { status: status, updatedById: userId },
      { where: { id: batchDateId } }
    );
    return res.status(200).send({
      status: 200,
      message: msg.BATCH_DATE_STATUS_UPDATE,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  addBatchDate,
  getBatchDateById,
  getBatchDateByBatchTypeId,
  getAllBatchDate,
  updateBatchDateById,
  deleteBatchDateById,
  getMultipleBatchDate, //TODO - Get multiple batch date based on batch type
  getBatchDateByBatchTypeIdForWebApp, // TODO: use in web and mobile
  updateBatchDateStatus,
};