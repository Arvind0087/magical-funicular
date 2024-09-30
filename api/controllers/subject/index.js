const _ = require("lodash");
const db = require("../../models/index");
const msg = require("../../constants/Messages");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const getSignedUrl = require("../../helpers/getSignedUrl");
const { getSignedUrlCloudFront } = require("../../helpers/cloudFront");
const { Sequelize, Op } = require("sequelize");
const Subject = db.subject;
const batchType = db.batchTypes;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;
const Chapter = db.chapter;
const Topics = db.topic;
const AdminUser = db.admin;
const User = db.users;
const TeacherSubjectMap = db.teacher_subject_map;
const RolePermission = db.permissionRole;
const client = require("../../helpers/init_redis");
const { batchClassBase } = require("../../helpers/teacherValidation");

//ANCHOR : add Subject
const addSubject = async (req, res) => {
  try {
    const {
      courseId,
      boardId,
      classId,
      batchTypeId,
      name,
      image,
      isAllSubject,
    } = req.body;
    let avatar;

    //NOTE - user id from token
    const token = req.user.id;

    //NOTE: find subjcet details
    const findSubject = await Subject.findOne({
      where: {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
        name: name,
      },
    });

    //NOTE - if subject already exist with same name
    if (findSubject) {
      return res.status(400).send({
        status: 400,
        message: msg.SUBJECT_ALREADY_EXIST,
      });
    }

    //NOTE - check if all subject is already exist with the same class and batch
    if (isAllSubject === true) {
      const findAllSubject = await Subject.findOne({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
          isAllSubject: 1,
        },
      });

      //NOTE - if subject already exist with same name
      if (findAllSubject) {
        return res.status(400).send({
          status: 400,
          message: msg.ALL_SUBJECT_ALREADY_EXIST,
        });
      }
    }

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(
        image,
        msg.SUBJECT_FOLDER_CREATED,
        name
      );
      avatar = uploadImage.Key;
    }
    const newSubject = new Subject({
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      name: name.replace(/\s+/g, " ").trim(),
      image: avatar,
      isAllSubject: isAllSubject,
      createdById: token,
    });

    await newSubject.save();
    return res.status(201).send({
      status: 200,
      message: msg.SUBJECT_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get Subject by id
const getSubjectById = async (req, res) => {
  try {
    const getSubject = await Subject.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
        { model: batchType, attributes: ["name"] },
      ],
    });

    if (!getSubject)
      return res
        .status(400)
        .send({ status: 400, message: msg.SUBJECT_NOT_FOUND });

    getSubject.image = await getSignedUrl(getSubject.dataValues.image);

    const result = {
      id: getSubject.id,
      name: getSubject.name,
      courseId: getSubject.courseId,
      course: getSubject.course?.name,
      boardId: getSubject.boardId,
      board: getSubject.board?.name,
      classId: getSubject.classId,
      class: getSubject.class?.name,
      batchTypeId: getSubject.batchTypeId,
      batchType: getSubject.batchType?.name,
      image: getSubject.image,
      status: getSubject.status,
      isAllSubject: getSubject?.isAllSubject ? getSubject?.isAllSubject : false,
      createdAt: getSubject.createdAt,
      updatedAt: getSubject.updatedAt,
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

//ANCHOR : get Subject by all ids
const getSubjectByBatchTypeId = async (req, res) => {
  try {
    const { batchTypeId } = req.body;
    let allSubject = [];

    //NOTE - get batchtype details
    const getBatchType = await batchType.findOne({
      where: { id: batchTypeId, status: 1 },
    });

    if (!getBatchType)
      return res
        .status(400)
        .send({ status: 400, message: msg.BATCH_TYPE_NOT_ACTIVE });

    const getSubject = await Subject.findAll({
      where: {
        batchTypeId: getBatchType.id,
        isAllSubject: 0,
        status: 1,
      },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
        { model: batchType, attributes: ["name"] },
      ],
    });
    if (!getSubject)
      return res
        .status(200)
        .send({ status: 200, message: msg.SUBJECT_NOT_FOUND });

    for (let data of getSubject) {
      //NOTE - Push final data
      allSubject.push({
        id: data.id,
        name: data.name,
        courseId: data.courseId,
        course: data.course?.name,
        boardId: data.boardId,
        board: data.board?.name,
        classId: data.classId,
        class: data.class?.name,
        batchTypeId: data.batchTypeId,
        batchType: data.batchType?.name,
        status: data.status,
        image: data.image ? await getSignedUrlCloudFront(data.image) : null,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allSubject,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all Subject
const getAllSubject = async (req, res) => {
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

    //NOTE - add filter
    const searchParams = {
      ...(search && {
        [Op.or]: [
          { id: search },
          { name: search },
          { name: { [Op.like]: "%" + search + "%" } },
        ],
      }),
      ...(classes && { classId: classes }),
    };

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
      //NOTE - Get Teacher subject details
      const subject_details = await TeacherSubjectMap.findAll({
        where: { teacherId: req.user.id },
        attributes: ["classId", "batchTypeId"],
      });

      //NOTE - Get all user class Ids
      const classIds = subject_details.map((item) => item.classId);

      //NOTE - Get all batch Ids
      const batchIds = subject_details.map((item) => item.batchTypeId);

      if (batchIds.every((id) => id === null)) {
        //NOTE - Filter based on classId if either all batchIds are null or classIds are not null
        params = {
          classId: {
            [Sequelize.Op.in]: classIds.filter((id) => id !== null),
          },
        };
      } else {
        //NOTE - Filter based on batchTypeId if any batchTypeId is not null
        params = {
          batchTypeId: {
            [Sequelize.Op.in]: batchIds.filter((id) => id !== null),
          },
        };
      }
    }

    //NOTE - get all subject details
    const { count, rows } = await Subject.findAndCountAll({
      ...query,
      where: { ...searchParams, ...params, ...value },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
        { model: batchType, attributes: ["name"] },
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

    //NOTE - push final result
    const getAllSubject = await Promise.all(
      rows.map(async (allSubject) => {
        const imageUrl = allSubject.dataValues.image
          ? await getSignedUrl(allSubject.dataValues.image)
          : null;
        return {
          id: allSubject.id,
          courseId: allSubject.courseId,
          boardId: allSubject.boardId,
          classId: allSubject.classId,
          batchTypeId: allSubject.batchTypeId,
          subjectName: allSubject.name,
          course: allSubject.course?.name,
          board: allSubject.board?.name,
          class: allSubject.class?.name,
          batchType: allSubject.batchType?.name,
          image: imageUrl,
          status: allSubject.status,
          createdByName: allSubject.creator ? allSubject.creator?.name : null,
          createdByRole: allSubject.creator
            ? allSubject.creator?.permission_role?.role
            : null,
          updateByName: allSubject.updater ? allSubject.updater?.name : null,
          updateByRole: allSubject.updater
            ? allSubject.updater?.permission_role.role
            : null,
          isAllSubject: allSubject?.isAllSubject === 1,
          createdAt: allSubject.createdAt,
          updatedAt: allSubject.updatedAt,
        };
      })
    );

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: getAllSubject,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all Subject by redis
const RedisgetAllSubject = async (req, res, next) => {
  try {
    client.get("getAllsubject", (err, redis_data) => {
      if (err) {
        throw err;
      } else if (redis_data) {
        return res.send(JSON.parse(redis_data));
      } else {
        next();
      }
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - update subject
const updateSubjectById = async (req, res) => {
  try {
    const {
      subjectId,
      courseId,
      boardId,
      classId,
      batchTypeId,
      name,
      image,
      isAllSubject,
    } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    //NOTE: Find subject details
    const subjectDetails = await Subject.findOne({
      where: {
        id: subjectId,
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
      },
    });

    if (!subjectDetails) {
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });
    }

    //NOTE - check if all subject is already exist with the same class and batch
    if (isAllSubject === true) {
      const findAllSubject = await Subject.findOne({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
          isAllSubject: 1,
        },
      });

      //NOTE - if subject already exist with same name
      if (findAllSubject) {
        return res.status(400).send({
          status: 400,
          message: msg.ALL_SUBJECT_ALREADY_EXIST,
        });
      }

      const findChapterDetails = await Chapter.findOne({
        where: {
          subjectId: subjectId,
        },
      });

      if (findChapterDetails) {
        return res.status(400).send({
          status: 400,
          message: msg.CHAPTER_ALREADY_EXIST,
        });
      }
    }

    //NOTE - find data from db
    let obj1 = {
      courseId: subjectDetails.courseId,
      boardId: subjectDetails.boardId,
      classId: subjectDetails.classId,
      batchTypeId: subjectDetails.batchTypeId,
      name: subjectDetails.name.toLowerCase(),
    };

    //NOTE -data given by the user
    let obj2 = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      name: name.toLowerCase(),
    };

    //NOTE - payload to push data
    let payload = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      name: name.replace(/\s+/g, " ").trim(),
      isAllSubject: isAllSubject,
      updatedById: token,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(image, msg.SUBJECT_FOLDER_CREATED);
      payload = { ...payload, image: uploadImage.Key };
    }

    //NOTE - If same name is coming update it
    if (obj1.name === obj2.name) {
      await Subject.update(payload, {
        where: { id: subjectId },
      });
    } else {
      //NOTE - if different name is check subject is already exist or not
      const Subjects = await Subject.findOne({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
          name: {
            [Sequelize.Op.like]: `%${name}%`,
          },
        },
      });
      if (Subjects) {
        return res.status(400).send({
          status: 400,
          message:
            "Subject already exist with course,board,class,batchType and subjectName",
        });
      } else {
        //NOTE - if subject not found update it
        await Subject.update(payload, {
          where: { id: subjectId },
        });
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.SUBJECT_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete subject
const deleteSubjectById = async (req, res) => {
  try {
    const getSubject = await Subject.findOne({
      where: { id: req.params.id },
    });
    if (!getSubject) {
      return res
        .status(400)
        .send({ status: 400, message: msg.SUBJECT_NOT_FOUND });
    }
    await Subject.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({ status: 200, message: msg.SUBJECT_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - get subject and chapter
const subjectChapterCount = async (req, res) => {
  try {
    const { courseId, boardId, classId, batchTypeId } = req.body;
    let getAllSubject = [];
    let subjectCount = 0;

    //NOTE - get user details
    const userId = req.user.id;

    //NOTE - check user details
    const userDetails = await User.findOne({
      where: { id: userId },
      attributes: ["id", "subscriptionType"],
    });

    if (!userDetails)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    //NOTE - get all subject
    const getSubject = await Subject.findAndCountAll({
      where: {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
        status: 1,
      },
    });

    for (const subject of getSubject.rows) {
      //NOTE - get all chapter details
      const getChapter = await Chapter.findAndCountAll({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
          subjectId: subject.id,
          status: 1,
        },
      });

      //NOTE - push final result
      getAllSubject.push({
        id: subject?.id,
        name: subject?.name,
        image: subject?.image
          ? await getSignedUrlCloudFront(subject?.image)
          : null,
        chaptersCount:
          ["Free"].includes(userDetails.subscriptionType) &&
          getChapter.count > 0
            ? 1
            : getChapter.count, //TODO - if user is a free subscribe and even if there is more than 1 chapter count , but it will show 1
        isAllSubject: subject?.isAllSubject,
      });
    }

    //NOTE - sort the array where isAllSubject is true
    const sortedData = getAllSubject.sort(
      (a, b) => b.isAllSubject - a.isAllSubject
    );

    //NOTE - convert isAllSubject key to true false
    const updatedData = sortedData.map((item) => {
      if (item.isAllSubject === 0) {
        return {
          ...item,
          isAllSubject: false,
        };
      } else if (item.isAllSubject === 1) {
        return {
          ...item,
          isAllSubject: true,
        };
      }
      return item;
    });

    //NOTE - push subject count in all subject
    for (let i = 0; i < updatedData.length; i++) {
      if (updatedData[i].isAllSubject) {
        subjectCount = updatedData.length - 1;
        delete updatedData[i].chaptersCount;
        updatedData[i].subjectCount = subjectCount;
        break;
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getSubject.count,
      data: updatedData,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - get subject,chapter and topic count
const chapterTopicsCount = async (req, res) => {
  try {
    const { courseId, boardId, classId, batchTypeId, subjectId } = req.body;
    let getAllTopic = [];
    let getChapter;

    //NOTE - get userid  from token
    const userId = req.user.id;

    //NOTE - get user detials
    const userDetails = await User.findOne({
      where: { id: userId },
      attributes: ["id", "subscriptionType"],
    });

    //NOTE - check subjectId is a all subject or not
    const checkSubjectDetails = await Subject.findOne({
      where: { id: subjectId, status: 1 },
    });

    if (!checkSubjectDetails)
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });

    //NOTE - chapter payloadd
    let chapterPayload;
    if (checkSubjectDetails.isAllSubject === 1) {
      //NOTE - get Assignment id based on the student id
      chapterPayload = {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
      };
    } else {
      chapterPayload = {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
        subjectId: subjectId,
      };
    }

    if (["Free"].includes(userDetails.subscriptionType)) {
      getChapter = await Chapter.findOne({
        where: { ...chapterPayload, status: 1 },
        order: [["createdAt", "ASC"]],
      });

      if (!getChapter)
        return res.status(400).send({ status: 400, message: msg.NOT_FOUND });
    } else {
      getChapter = await Chapter.findAndCountAll({
        where: { ...chapterPayload, status: 1 },
      });
      if (!getChapter)
        return res.status(400).send({ status: 400, message: msg.NOT_FOUND });
    }

    if (["Free"].includes(userDetails.subscriptionType)) {
      const topicsPayload = {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
      };
      const topicCount = await Topics.count({
        where: {
          ...topicsPayload,
          chapterId: getChapter.id,
          status: 1,
        },
      });

      //NOTE - push final result
      getAllTopic.push({
        id: getChapter.id,
        name: getChapter.name,
        conceptsCount: topicCount,
      });
    } else {
      const topicPromises = getChapter.rows.map(async (chapter) => {
        const topicsPayload = {
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
        };
        if (checkSubjectDetails.isAllSubject !== 1) {
          topicsPayload.subjectId = subjectId;
        }
        const topicCount = await Topics.count({
          where: {
            ...topicsPayload,
            chapterId: chapter.id,
          },
        });
        return {
          id: chapter.id,
          name: chapter.name,
          conceptsCount: topicCount,
        };
      });
      //NOTE - push final result
      getAllTopic = await Promise.all(topicPromises);
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: ["Free"].includes(userDetails.subscriptionType)
        ? 1
        : getChapter.count,
      data: getAllTopic,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get all Subject ONLY NAME AND IDS
const getAllSubjectSelect = async (req, res) => {
  try {
    const getSubject = await Subject.findAll({
      where: { status: 1 },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "name"],
    });

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getSubject,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get Subject by all class ids
const getSubjectByMultipleClassId = async (req, res) => {
  try {
    const { courseId, boardId, classId, batchTypeId } = req.body;

    let getAllSubject = [];
    for (let data of classId) {
      const getSubject = await Subject.findAll({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: data,
          batchTypeId: batchTypeId,
          isAllSubject: 0,
          status: 1,
        },
        attributes: ["id", "name"],
      });
      getAllSubject.push(getSubject);
    }

    var result = getAllSubject.reduce((r, e) => (r.push(...e), r), []);
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all Subject
const getAllSubjectwithClass = async (req, res) => {
  try {
    let getAllSubject = [];
    const getSubject = await Subject.findAll({
      where: { status: 1 },
      include: [
        {
          model: Boards,
          attributes: ["name"],
        },
        {
          model: Class,
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!getSubject)
      return res
        .status(400)
        .send({ status: 400, message: msg.SUBJECT_NOT_FOUND });

    for (let data of getSubject) {
      getAllSubject.push({
        id: data.id,
        name: data.name,
        class: data.class?.name,
        board: data.board?.name,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getAllSubject,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get Subject by all batch type id
const getSubjectByOnlyBatchTypeId = async (req, res) => {
  try {
    const { batchTypeId } = req.query;
    let allSubject = [];

    const getSubjects = await Subject.findAll({
      where: { batchTypeId: batchTypeId, status: 1 },
    });

    for (let data of getSubjects) {
      allSubject.push({
        id: data.id,
        name: data.name,
        image: data.image ? await getSignedUrl(data.image) : null,
        batchTypeId: batchTypeId,
      });
    }
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allSubject,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get Subject by all class ids
const getSubjectByMultipleClassIds = async (req, res) => {
  try {
    const { classId, batchTypeIds } = req.body;
    let final = [];
    let getAllSubject = [];

    let val;
    if (classId && classId.length > 0) {
      val = {
        ...val,
        classId: {
          [Sequelize.Op.in]: classId,
        },
      };
    }

    if (batchTypeIds && batchTypeIds.length > 0) {
      val = {
        batchTypeId: {
          [Sequelize.Op.in]: batchTypeIds,
        },
        ...val,
      };
    }

    if (classId.length > 0 || batchTypeIds.length > 0) {
      const getSubject = await Subject.findAll({
        where: { ...val, status: 1 },
        attributes: ["id", "name"],
        include: [
          {
            model: batchType,
            attributes: ["id", "name"],
          },
          {
            model: Class,
            attributes: ["id", "name"],
          },
        ],
      });

      getAllSubject.push(getSubject);

      var result = getAllSubject.reduce((r, e) => (r.push(...e), r), []);

      for (let data of result) {
        final.push({
          id: data.id,
          subject: data.name,
          classId: data.class?.id,
          class: data.class?.name,
          batchTypeId: data.batchType?.id,
          batchTypeName: data.batchType?.name,
        });
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: final,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - get subject and chapter BY multiple subject
const subjectWithChapterCount = async (req, res) => {
  try {
    let getAllSubject = [];
    const { subjectId } = req.body;

    const getSubject = await Subject.findAndCountAll({
      where: {
        id: {
          [Sequelize.Op.in]: subjectId,
        },
        status: 1,
      },
    });

    for (const subject of getSubject.rows) {
      const getChapter = await Chapter.findAndCountAll({
        where: {
          subjectId: subject.id,
          status: 1,
        },
        include: {
          model: Subject,
          attributes: ["id", "name"],
          distinct: true,
        },
      });
      getAllSubject.push({
        id: subject?.id,
        name: subject?.name,
        chaptersCount: getChapter.count,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      getChapter: getAllSubject,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

const getSubjectByBoardId = async (req, res) => {
  try {
    const { boardId } = req.query;

    //NOTE - get Active class and batch Type
    const getActiveParams = async (boardId, role, userId) => {
      if (!["teacher", "mentor"].includes(role.toLowerCase())) {
        const activeClassDetails =
          (await Class.findAll({
            where: { boardId: boardId, status: 1 },
          })) ?? [];

        const activeBatchDetails = await getActiveBatchDetails(
          boardId,
          activeClassDetails
        );

        return {
          classId: activeClassDetails.map((activeClass) => activeClass.id),
          batchTypeId: activeBatchDetails.map((activeBatch) => activeBatch.id),
        };
      } else {
        //NOTE - If login by a teacher or mentor
        return await batchClassBase(userId, role);
      }
    };

    //NOTE - get Active BatchType
    const getActiveBatchDetails = async (boardId, activeClassDetails) => {
      if (activeClassDetails.length > 0) {
        return await batchType.findAll({
          where: {
            boardId: boardId,
            classId: {
              [Sequelize.Op.in]: activeClassDetails.map(
                (activeClass) => activeClass.id
              ),
            },
            status: 1,
          },
        });
      }
      return [];
    };

    const params = await getActiveParams(boardId, req.user?.role, req.user?.id);

    //NOTE - get all subject details
    const getSubject = await Subject.findAll({
      where: { boardId: boardId, status: 1, ...params },
      include: [
        { model: Class, attributes: ["name"] },

        { model: batchType, attributes: ["name"] },
      ],
    });

    if (!getSubject)
      return res
        .status(200)
        .send({ status: 200, message: msg.SUBJECT_NOT_FOUND, data: [] });

    //NOTE: final push result
    const result = getSubject.map((data) => ({
      id: data.id,
      name: data.name,
      classId: data.classId,
      className: data.class?.name,
      batchTypeId: data.batchTypeId,
      batchTypeName: data.batchType?.name,
    }));

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR: update subject status
const updateSubjectStatus = async (req, res) => {
  try {
    const { status, subjectId } = req.body;

    //NOTE - userId from token
    const userId = req.user.id;

    const getSubject = await Subject.findOne({
      where: { id: subjectId },
    });
    if (!getSubject)
      return res
        .status(200)
        .send({ status: 200, message: msg.SUBJECT_NOT_FOUND, data: [] });

    //NOTE - payload for push data
    let payload = {
      status: status,
      updatedById: userId,
    };

    //NOTE - update status
    await Subject.update(payload, {
      where: { id: subjectId },
    });

    return res.status(200).send({
      status: 200,
      message: msg.SUBJECT_STATUS_UPDATE,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  addSubject,
  getSubjectById,
  getSubjectByBatchTypeId,
  getAllSubject,
  updateSubjectById,
  deleteSubjectById,
  subjectChapterCount,
  chapterTopicsCount, //TODO - use in web and mobile
  getAllSubjectSelect,
  getSubjectByMultipleClassId,
  getAllSubjectwithClass,
  getSubjectByOnlyBatchTypeId,
  getSubjectByMultipleClassIds,
  subjectWithChapterCount, //TODO - use in web and mobile
  getSubjectByBoardId, //TODO - use in admin panel
  RedisgetAllSubject,
  updateSubjectStatus,
};
