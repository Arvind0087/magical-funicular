const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize, Op } = require("sequelize");
const Chapter = db.chapter;
const Subject = db.subject;
const batchType = db.batchTypes;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const RolePermission = db.permissionRole;
const QuestionBank = db.questionBank;
const studentPackages = db.student_course_package_map;


//ANCHOR: add Chapter
const addChapter = async (req, res) => {
  try {
    const { courseId, boardId, classId, batchTypeId, subjectId, name } =
      req.body;

    //NOTE - id from token
    const id = req.user.id;

    const Chapters = await Chapter.findOne({
      where: {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
        subjectId: subjectId,
        name: name,
      },
    });
    if (Chapters) {
      return res.status(400).send({
        status: 400,
        message:
          "Chapter already exist with course,Board,class ,batchType and subject",
      });
    }
    const newChapter = new Chapter({
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      subjectId: subjectId,
      name: name.replace(/\s+/g, " ").trim(),
      createdById: id,
    });

    await newChapter.save();
    return res.status(200).send({
      status: 200,
      message: msg.CHAPTER_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get chapter by id
const getChapterById = async (req, res) => {
  try {
    const getChapter = await Chapter.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
        { model: batchType, attributes: ["name"] },
        { model: Subject, attributes: ["name"] },
      ],
    });

    if (!getChapter)
      return res
        .status(400)
        .send({ status: 400, message: msg.CHAPTER_NOT_FOUND });

    const result = {
      id: getChapter.id,
      name: getChapter.name,
      courseId: getChapter.courseId,
      course: getChapter.course?.name,
      boardId: getChapter.boardId,
      board: getChapter.board?.name,
      classId: getChapter.classId,
      class: getChapter.class?.name,
      batchTypeId: getChapter.batchTypeId,
      batchType: getChapter.batchType?.name,
      subjectId: getChapter.subjectId,
      subject: getChapter.subject?.name,
      status: getChapter.status,
      createdAt: getChapter.createdAt,
      updatedAt: getChapter.updatedAt,
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

//ANCHOR : get chapter by all ids
const getChapterBySubjectId = async (req, res) => {
  try {
    let chapters = [];
    const { subjectId } = req.body;

    //NOTE - get chapter details
    const getChapter = await Chapter.findAll({
      where: {
        subjectId: subjectId,
        status: 1,
      },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
        { model: batchType, attributes: ["name"] },
        { model: Subject, attributes: ["name"] },
      ],
    });
    if (!getChapter)
      return res
        .status(200)
        .send({ status: 200, message: msg.CHAPTER_NOT_FOUND, data: [] });

    let count = 1;
    for (let data of getChapter) {
      chapters.push({
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
        subjectId: data.subjectId,
        subject: data.subject?.name,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        lockStatus: count == 1 || count == 2 ? false : true
      })
      count++;
    }

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: chapters,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all Chapter
const getAllChapter = async (req, res) => {
  try {
    const { page, limit, subject, chapter, classes, status } = req.query;

    //NOTE - add pagination
    const query =
      page && limit
        ? {
          offset: Number(page - 1) * limit,
          limit: Number(limit),
        }
        : {};

    //NOTE - add filter for subject
    const subjectParams = subject
      ? {
        [Op.or]: [{ id: subject }, { name: { [Op.like]: `%${subject}%` } }],
      }
      : null;

    //NOTE - add filter for chapter
    const chapterParams = chapter
      ? {
        [Op.or]: [{ id: chapter }, { name: { [Op.like]: `%${chapter}%` } }],
      }
      : null;

    //NOTE - add filter for class
    const classParams = classes ? { id: classes } : null;

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
      if (["teacher", "mentor"].includes(req.user.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const teachersSubject = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: ["classId", "batchTypeId"],
        });

        //NOTE - push all user class Ids for
        const classesIds = teachersSubject.map((item) => item.classId);

        //NOTE - push all batch ids
        const batchIds = teachersSubject.map((item) => item.batchTypeId);

        if (batchIds.every((id) => id === null)) {
          //NOTE - all chapter are being taught in the same batch, filter based on classId only
          params = {
            classId: {
              [Sequelize.Op.in]: classesIds,
            },
          };
        } else {
          //NOTE - filter based on batchTypeId
          params = {
            batchTypeId: {
              [Sequelize.Op.in]: batchIds,
            },
          };
        }
      }

    const { count, rows } = await Chapter.findAndCountAll({
      ...query,
      where: { ...chapterParams, ...params, ...value },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"], where: classParams },
        { model: batchType, attributes: ["name"] },
        {
          model: Subject,
          attributes: ["name"],
          where: {
            ...subjectParams,
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

    //NOTE: push final data
    const result = rows.map((allChapter) => ({
      id: allChapter.id,
      courseId: allChapter.courseId,
      boardId: allChapter.boardId,
      classId: allChapter.classId,
      batchTypeId: allChapter.batchTypeId,
      subjectId: allChapter.subjectId,
      chapterName: allChapter.name,
      course: allChapter.course?.name,
      board: allChapter.board?.name,
      class: allChapter.class?.name,
      batchType: allChapter.batchType?.name,
      subject: allChapter.subject?.name,
      status: allChapter.status,
      createdByName: allChapter.creator?.name || null,
      createdByRole: allChapter.creator?.permission_role?.role || null,
      updateByName: allChapter.updater?.name || null,
      updateByRole: allChapter.updater?.permission_role?.role || null,
      createdAt: allChapter.createdAt,
      updatedAt: allChapter.updatedAt,
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

//ANCHOR : update chapter
const updateChapterById = async (req, res) => {
  try {
    const {
      chapterId,
      courseId,
      boardId,
      classId,
      batchTypeId,
      subjectId,
      name,
    } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    //NOTE: Find chapter details
    const getChapter = await Chapter.findOne({
      where: { id: chapterId },
    });
    if (!getChapter)
      return res
        .status(400)
        .send({ status: 400, message: msg.CHAPTER_NOT_FOUND });

    //NOTE - find data from db
    let dbObject = {
      courseId: getChapter.courseId,
      boardId: getChapter.boardId,
      classId: getChapter.classId,
      batchTypeId: getChapter.batchTypeId,
      subjectId: getChapter.subjectId,
      name: getChapter.name.toLowerCase(),
    };

    //NOTE -data given by the user
    let userObject = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      subjectId: subjectId,
      name: name.toLowerCase(),
    };

    //NOTE - payload for push data
    let payload = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      subjectId: subjectId,
      name: name.replace(/\s+/g, " ").trim(),
      updatedById: id,
    };

    //NOTE - If same name is coming update it
    if (
      dbObject.name === userObject.name &&
      dbObject.subjectId === userObject.subjectId &&
      dbObject.batchTypeId === userObject.batchTypeId &&
      dbObject.classId === userObject.classId &&
      dbObject.boardId === userObject.boardId &&
      dbObject.courseId === userObject.courseId
    ) {
      await Chapter.update(payload, {
        where: { id: chapterId },
      });
    } else {
      //NOTE - if different name is check chapter is already exist or not
      const getChapter = await Chapter.findOne({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          subjectId: subjectId,
          batchTypeId: batchTypeId,
          name: name,
        },
      });
      if (getChapter) {
        return res.status(400).send({
          status: 400,
          message:
            "Chapter already exist with course,board,class,batchType and subjectName",
        });
      } else {
        //NOTE - if chapter not found update it
        await Chapter.update(payload, {
          where: { id: chapterId },
        });
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.CHAPTER_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//ANCHOR : delete chapter
const deleteChapterById = async (req, res) => {
  try {
    const getChapter = await Chapter.findOne({
      where: { id: req.params.id },
    });

    if (!getChapter) {
      return res
        .status(400)
        .send({ status: 400, message: msg.CHAPTER_NOT_FOUND });
    }
    await Chapter.destroy({
      where: {
        id: req.params.id,
      },
    });
    //await getChapter.destroy();
    return res.status(200).send({ status: 200, message: msg.CHAPTER_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get chapter by multiple Subject ids
const getChapterByMultipleSubjectId = async (req, res) => {
  try {
    const { subjectId } = req.body;

    //NOTE - get all chapter details
    const getAllChapter = await Promise.all(
      subjectId.map(async (data) => {
        const getChapter = await Chapter.findAll({
          where: {
            subjectId: data,
            status: 1,
          },
          attributes: ["id", "name"],
        });
        return getChapter;
      })
    );

    //NOTE - push final result
    const result = getAllChapter.flat();

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get chapter by subject id
const getChapterByOnlySubjectId = async (req, res) => {
  try {
    const { subjectId } = req.query;

    //NOTE - get all chapter deatils
    const chapters = await Chapter.findAll({
      where: { subjectId: subjectId, status: 1 },
    });

    //NOTE - push final result
    const result = chapters.map((chapter) => ({
      id: chapter.id,
      name: chapter.name,
      subjectId: subjectId,
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

//ANCHOR : get chapter by multiple Subject ids, if questions are there for that chapter
const getChapterForQuestions = async (req, res) => {
  try {
    const { subjectIds } = req.body;

    //NOTE - check in question bank with the subject id,
    const questions = await Chapter.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: [
            Sequelize.literal(
              `(SELECT DISTINCT chapterId FROM questionBanks WHERE subjectId IN (${subjectIds.join()}))`
            ),
          ],
        },
        status: 1,
      },
      attributes: ["id", "name"],
    });

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: questions,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: update batch status
const updateChapterStatus = async (req, res) => {
  try {
    const { status, chapterId } = req.body;

    //NOTE - userId from token
    const userId = req.user.id;

    const getChapter = await Chapter.findOne({
      where: { id: chapterId },
    });
    if (!getChapter)
      return res
        .status(200)
        .send({ status: 200, message: msg.CHAPTER_NOT_FOUND, data: [] });

    //NOTE - payload for push data
    let payload = {
      status: status,
      updatedById: userId,
    };

    //NOTE - update status
    await Chapter.update(payload, {
      where: { id: chapterId },
    });

    return res.status(200).send({
      status: 200,
      message: msg.CHAPTER_STATUS_UPDATE,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};


//ANCHOR : get chapter by all by user
const userChapterBySubjectId = async (req, res) => {
  try {
    let chapters = [];
    const { subjectId } = req.body;

    //NOTE - user by token
    const userId = req.user.id;

    //NOTE - get chapter details
    const getChapter = await Chapter.findAll({
      where: {
        subjectId: subjectId,
        status: 1,
      },
    });
    if (!getChapter)
      return res
        .status(200)
        .send({ status: 200, message: msg.CHAPTER_NOT_FOUND, data: [] });

    //NOTE - user package
    const packages = await studentPackages.findOne({
      where: {
        userId: userId,
        batchTypeId: getChapter[0].batchTypeId,
      },
    });


    let count = 1;
    for (let data of getChapter) {
      chapters.push({
        id: data.id,
        name: data.name,
        lockStatus: packages ? false : count == 1 || count == 2 ? false : true
      })
      count++;
    }

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: chapters,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  addChapter,
  getChapterById,
  getChapterBySubjectId,
  getAllChapter,
  updateChapterById,
  deleteChapterById,
  getChapterByMultipleSubjectId,
  getChapterByOnlySubjectId,
  getChapterForQuestions, //TODO - use in web and mobile
  updateChapterStatus,
  userChapterBySubjectId
};
