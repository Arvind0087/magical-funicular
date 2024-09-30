const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { getRandomObjects } = require("../../helpers/service");
const { isJson } = require("./service");
const { Sequelize, Op } = require("sequelize");
const questionBank = db.questionBank;
const batchType = db.batchTypes;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;
const Subject = db.subject;
const Chapter = db.chapter;
const Topic = db.topic;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const ScholarshipClassMap = db.scholarship_class_map;
const RolePermission = db.permissionRole;

//ANCHOR: create questionBank
const createQuestionBank = async (req, res) => {
  try {
    const {
      courseId,
      boardId,
      classId,
      batchTypeId,
      subjectId,
      chapterId,
      topicId,
      question,
      option1,
      option2,
      option3,
      option4,
      answer,
      explanation,
      difficultyLevel
    } = req.body;

    //NOTE - id from token
    const userId = req.user.id;

    //NOTE - Create question
    const newQuestionBank = new questionBank({
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      subjectId: subjectId,
      chapterId: chapterId,
      topicId: topicId,
      question: question,
      A: option1,
      B: option2,
      C: option3,
      D: option4,
      answer: answer,
      explanation: explanation,
      difficultyLevel: difficultyLevel,
      createdById: userId,
    });

    await newQuestionBank.save();
    return res.status(200).send({
      status: 200,
      message: msg.QUESTION_BANK_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get question by id
const getQuestionById = async (req, res) => {
  try {
    const getQuestionBank = await questionBank.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },

      include: [
        {
          model: Course,
          attributes: ["name"],
        },
        {
          model: Boards,
          attributes: ["name"],
        },
        {
          model: Class,
          attributes: ["name"],
        },
        {
          model: batchType,
          attributes: ["name"],
        },
        {
          model: Subject,
          attributes: ["name"],
        },
        {
          model: Chapter,
          attributes: ["name"],
        },
        {
          model: Topic,
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    let getQuestion = {
      id: getQuestionBank.id,
      courseId: getQuestionBank.courseId,
      course: getQuestionBank.course?.name,
      boardId: getQuestionBank.boardId,
      board: getQuestionBank.board?.name,
      classId: getQuestionBank.classId,
      class: getQuestionBank.class?.name,
      batchTypeId: getQuestionBank.batchTypeId,
      batchType: getQuestionBank.batchType?.name,
      subjectId: getQuestionBank.subjectId,
      subject: getQuestionBank.subject?.name,
      chapterId: getQuestionBank.chapterId,
      chapter: getQuestionBank.chapter?.name,
      topicId: getQuestionBank.topicId,
      topic: getQuestionBank.topic?.name,
      question: getQuestionBank.question,
      option1: getQuestionBank.A,
      option2: getQuestionBank.B,
      option3: getQuestionBank.C,
      option4: getQuestionBank.D,
      answer: getQuestionBank.answer,
      explanation: getQuestionBank.explanation,
      difficultyLevel: getQuestionBank.difficultyLevel,
      status: getQuestionBank.status,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getQuestion,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all question
const getAllQuestion = async (req, res) => {
  try {
    let subjectDetails;
    let getAllQuestions = [];
    const { page, limit, difficultyLevel, subject, chapter, classes } =
      req.query;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE - filter diffculty level
    let final = {};
    if (difficultyLevel) {
      final = {
        difficultyLevel: difficultyLevel,
      };
    }

    //NOTE - filter class
    if (classes) {
      final = {
        ...final,
        classId: classes,
      };
    }

    const IsjsonSubject = isJson(subject);
    const IsjsonChapter = isJson(chapter);

    //NOTE - filter subject
    if (IsjsonSubject && IsjsonSubject.length > 0) {
      final = {
        ...final,
        subjectId: {
          [Sequelize.Op.in]: IsjsonSubject,
        },
      };
    }

    //NOTE - filter chapter
    if (IsjsonChapter && IsjsonChapter.length > 0) {
      final = {
        ...final,
        chapterId: {
          [Sequelize.Op.in]: IsjsonChapter,
        },
      };
    }

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (["teacher", "mentor", "Teacher", "Mentor"].includes(req.user?.role)) {
        //NOTE - Get  User details from token
        const getAdmin = await AdminUser.findOne({
          where: { id: req.user.id },
        });

        let subject_details;
        //NOTE - get Teacher subject details
        subject_details = await TeacherSubjectMap.findAll({
          where: { teacherId: getAdmin.id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });

        //NOTE - push all user class Ids for
        const classIds = subject_details.map((item) => item.dataValues.classId);

        //NOTE - push all batch ids
        const batchIds = subject_details.map(
          (item) => item.dataValues.batchTypeId
        );

        if (batchIds.every((id) => id === null)) {
          //NOTE - all chapter are being taught in the same batch, filter based on classId only
          params = {
            classId: {
              [Sequelize.Op.in]: classIds,
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
    //NOTE - find all question
    const getQuestionBank = await questionBank.findAndCountAll({
      ...query,
      where: { ...final, ...params },
      include: [
        {
          model: Course,
          attributes: ["name"],
        },
        {
          model: Boards,
          attributes: ["name"],
        },
        {
          model: Class,
          attributes: ["name"],
        },
        {
          model: batchType,
          attributes: ["name"],
        },
        {
          model: Subject,
          attributes: ["name"],
        },
        {
          model: Chapter,
          attributes: ["name"],
        },
        {
          model: Topic,
          attributes: ["name"],
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

    //NOTE - Push all result
    for (const allQuestionBank of getQuestionBank.rows) {
      getAllQuestions.push({
        id: allQuestionBank.id,
        courseId: allQuestionBank.courseId,
        course: allQuestionBank.course?.name,
        boardId: allQuestionBank.boardId,
        board: allQuestionBank.board?.name,
        classId: allQuestionBank.classId,
        class: allQuestionBank.class?.name,
        batchTypeId: allQuestionBank.batchTypeId,
        batchType: allQuestionBank.batchType?.name,
        subjectId: allQuestionBank.subjectId,
        subject: allQuestionBank.subject?.name,
        chapterId: allQuestionBank.chapterId,
        chapter: allQuestionBank.chapter?.name,
        topicId: allQuestionBank.topicId,
        topic: allQuestionBank.topic?.name,
        question: allQuestionBank.question,
        option1: allQuestionBank.A,
        option2: allQuestionBank.B,
        option3: allQuestionBank.C,
        option4: allQuestionBank.D,
        answer: allQuestionBank.answer,
        explanation: allQuestionBank.explanation,
        difficultyLevel: allQuestionBank.difficultyLevel,
        status: allQuestionBank.status,
        createdByName: allQuestionBank.creator
          ? allQuestionBank.creator?.name
          : null,
        createdByRole: allQuestionBank.creator
          ? allQuestionBank.creator?.permission_role?.role
          : null,
        updateByName: allQuestionBank.updater
          ? allQuestionBank.updater?.name
          : null,
        updateByRole: allQuestionBank.updater
          ? allQuestionBank.updater?.permission_role.role
          : null,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getQuestionBank.count,
      data: getAllQuestions,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get all question  WITH SPECIFIC COURSE AND BOARD
const getAllQuestionWithId = async (req, res) => {
  try {
    let getAllQuestions = [];
    const { page, limit } = req.query;
    const {
      courseId,
      boardId,
      classId,
      batchTypeId,
      subjectId,
      chapterId,
      topicId,
      difficultyLevel,
    } = req.body;

    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    let final = {};
    if (difficultyLevel) {
      final = {
        difficultyLevel: difficultyLevel,
      };
    }

    const getQuestionBank = await questionBank.findAndCountAll({
      ...query,
      where: {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
        subjectId: subjectId,
        chapterId: chapterId,
        topicId: topicId,
        ...final,
      },
      include: [
        {
          model: Course,
          attributes: ["name"],
        },
        {
          model: Boards,
          attributes: ["name"],
        },
        {
          model: Class,
          attributes: ["name"],
        },
        {
          model: batchType,
          attributes: ["name"],
        },
        {
          model: Subject,
          attributes: ["name"],
        },
        {
          model: Chapter,
          attributes: ["name"],
        },
        {
          model: Topic,
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    for (const allQuestionBank of getQuestionBank.rows) {
      getAllQuestions.push({
        id: allQuestionBank.id,
        courseId: allQuestionBank.courseId,
        course: allQuestionBank.course?.name,
        boardId: allQuestionBank.boardId,
        board: allQuestionBank.board?.name,
        classId: allQuestionBank.classId,
        class: allQuestionBank.class?.name,
        batchTypeId: allQuestionBank.batchTypeId,
        batchType: allQuestionBank.batchType?.name,
        subjectId: allQuestionBank.subjectId,
        subject: allQuestionBank.subject?.name,
        chapterId: allQuestionBank.chapterId,
        chapter: allQuestionBank.chapter?.name,
        topicId: allQuestionBank.topicId,
        topic: allQuestionBank.topic?.name,
        question: allQuestionBank.question,
        option1: allQuestionBank.A,
        option2: allQuestionBank.B,
        option3: allQuestionBank.C,
        option4: allQuestionBank.D,
        answer: allQuestionBank.answer,
        explanation: allQuestionBank.explanation,
        difficultyLevel: allQuestionBank.difficultyLevel,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getQuestionBank.count,
      data: getAllQuestions,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: update questionBanks
const updateQuestionBankId = async (req, res) => {
  try {
    const {
      courseId,
      boardId,
      classId,
      batchTypeId,
      question,
      option1,
      option2,
      option3,
      option4,
      answer,
      explanation,
      difficultyLevel,
      questionId,
    } = req.body;
    const geQuestionBank = await questionBank.findOne({
      where: { id: questionId },
    });
    if (!geQuestionBank)
      return res
        .status(400)
        .send({ status: 400, message: msg.QUESTION_BANK_NOT_FOUND });

    await questionBank.update(
      {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
        question: question,
        A: option1,
        B: option2,
        C: option3,
        B: option4,
        answer: answer,
        explanation: explanation,
        difficultyLevel: difficultyLevel,
      },
      { where: { id: questionId } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.QUESTION_BANK_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: delete question
const deleteQuestionById = async (req, res) => {
  try {
    const getQuestionBank = await questionBank.findOne({
      where: { id: req.params.id },
    });
    if (!getQuestionBank)
      return res
        .status(400)
        .send({ status: 400, message: msg.QUESTION_BANK_NOT_FOUND });

    await questionBank.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res
      .status(200)
      .send({ status: 200, message: msg.QUESTION_BANK_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get filterAnswerById
const filterAnswerById = async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const getQuestionBank = await questionBank.findOne({
      where: { id: questionId, answer: answer },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!getQuestionBank) {
      return res.status(400).send({
        status: false,
      });
    } else {
      return res.status(200).send({
        status: true,
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//ANCHOR : Get question by id
const getQuestionDetailsById = async (req, res) => {
  try {
    const getQuestionBank = await questionBank.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["createdAt", "DESC"]],
    });

    if (!getQuestionBank)
      return res
        .status(400)
        .send({ status: 400, message: msg.QUESTION_BANK_NOT_FOUND });

    let getQuestion = {
      id: getQuestionBank.id,
      question: getQuestionBank.question,
      option1: getQuestionBank.A,
      option2: getQuestionBank.B,
      option3: getQuestionBank.C,
      option4: getQuestionBank.D,
      answer: getQuestionBank.answer,
      explanation: getQuestionBank.explanation,
      difficultyLevel: getQuestionBank.difficultyLevel,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getQuestion,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : Get question by batch type
const getQuestionsByBatchType = async (req, res) => {
  try {
    const { courseId, boardId, classId, batchTypeIds } = req.body;

    let finalResult = [];

    //NOTE - Get all questions by batch Type
    const getQuestions = await questionBank.findAll({
      where: {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: {
          [Sequelize.Op.in]: batchTypeIds,
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Subject,
          attributes: ["name"],
        },
        {
          model: Chapter,
          attributes: ["name"],
        },
      ],
    });

    //NOTE - Push all results
    for (const questions of getQuestions) {
      finalResult.push({
        id: questions.id,
        question: questions.question,
        difficultyLevel: questions.difficultyLevel,
        answer: questions.answer,
        subject: questions.subject?.name,
        chapter: questions.chapter?.name,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: finalResult,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : Get question by batch type
const getRelatedQuestionsById = async (req, res) => {
  try {
    const { questionId } = req.body;

    let finalResult = [];

    //NOTE - Get question details
    const getQuestions = await questionBank.findOne({
      where: {
        id: questionId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    //NOTE - get all question based
    const getAllQuestions = await questionBank.findAll({
      where: {
        subjectId: getQuestions.subjectId,
        classId: getQuestions.classId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    //NOTE - Get Unique array of question
    const uniqueArr = getAllQuestions.filter((obj) => obj.id !== questionId);

    //NOTE - Get random question
    const randomQuestionsArray = await getRandomObjects(uniqueArr, 5);

    //NOTE - Get final result
    for (const questions of randomQuestionsArray) {
      finalResult.push({
        id: questions.id,
        question: questions.question,
        difficultyLevel: questions.difficultyLevel,
        subject: questions.subject?.name,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: finalResult,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - get Scholarship questions based on the subject id
const getScholarshipQuestions = async (req, res) => {
  try {
    const { scholarshipId, classId } = req.body;

    let params;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const staffDetails = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: ["classId", "batchTypeId"],
        });

        //NOTE - push all batch ids
        const batchIds = staffDetails.map((item) => item.batchTypeId);
        const filteredBatchIds = batchIds.filter((id) => id !== null);

        if (filteredBatchIds.length > 0) {
          const batchTypeConditions = filteredBatchIds.map((id) => ({
            batchTypeId: { [Op.like]: `%${id}%` },
          }));
          params = {
            [Op.or]: batchTypeConditions,
          };
        } else {
          params = {};
        }
      }

    //NOTE - get scholarship Details
    const scholarshipDetails = await ScholarshipClassMap.findAll({
      where: {
        scholarshipId: scholarshipId,
        classId: {
          [Sequelize.Op.like]: `%${classId}%`,
        },
        ...params,
      },
    });

    //NOTE - get subject of scholarship class
    let subjectIds = [];
    for (const data of scholarshipDetails) {
      subjectIds.push(...JSON.parse(data.subjectId));
    }

    //NOTE - get all question
    const getQuestions = await questionBank.findAll({
      where: {
        classId: classId,
        subjectId: {
          [Sequelize.Op.in]: subjectIds,
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    //NOTE - push final result
    const finalResult = getQuestions.map((question) => ({
      id: question.id,
      question: question.question,
      option1: question.A,
      option2: question.B,
      option3: question.C,
      option4: question.D,
    }));


    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: finalResult,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR : Get question by batch type , subject and chapter
const getQuestionBatchSubject = async (req, res) => {
  try {
    const { batchTypeIds, subjectIds, chapterIds } = req.body;

    let finalResult = [];

    //NOTE - params based on the condition
    let params;
    if (batchTypeIds && !subjectIds && !chapterIds) {
      params = {
        batchTypeId: {
          [Sequelize.Op.in]: batchTypeIds,
        },
      };
    } else if (batchTypeIds && subjectIds && !chapterIds) {
      params = {
        batchTypeId: {
          [Sequelize.Op.in]: batchTypeIds,
        },
        subjectId: {
          [Sequelize.Op.in]: subjectIds,
        },
      };
    } else if (batchTypeIds && subjectIds && chapterIds) {
      params = {
        batchTypeId: {
          [Sequelize.Op.in]: batchTypeIds,
        },
        subjectId: {
          [Sequelize.Op.in]: subjectIds,
        },
        chapterId: {
          [Sequelize.Op.in]: chapterIds,
        },
      };
    }

    //NOTE - Get all questions by batch Type
    const getQuestions = await questionBank.findAll({
      where: { ...params, status: 1 },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Subject,
          attributes: ["name"],
        },
        {
          model: Chapter,
          attributes: ["name"],
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

    //NOTE - Push all results
    for (const questions of getQuestions) {
      finalResult.push({
        id: questions.id,
        question: questions.question,
        option1: questions.A,
        option2: questions.B,
        option3: questions.C,
        option4: questions.D,
        subjectId: questions?.subjectId,
        subject: questions?.subject?.name,
        chapterId: questions?.chapterId,
        chapter: questions?.chapter?.name,
        createdByName: questions.creator ? questions.creator?.name : null,
        createdByRole: questions.creator
          ? questions.creator?.permission_role?.role
          : null,
        updateByName: questions.updater ? questions.updater?.name : null,
        updateByRole: questions.updater
          ? questions.updater?.permission_role.role
          : null,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: finalResult,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};


//ANCHOR: update status of questions
const updateQuestionsStatus = async (req, res) => {
  try {

    const { questionIds, status } = req.body;

    // NOTE - update question status
    questionBank.update(
      { status: status },
      { where: { id: questionIds } }
    )
    return res
      .status(200)
      .send({ status: 200, message: msg.QUESTION_BANK_STATUS_UPDATE });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createQuestionBank,
  getQuestionById,
  getAllQuestion,
  updateQuestionBankId,
  deleteQuestionById,
  filterAnswerById,
  getAllQuestionWithId,
  getQuestionDetailsById, //TODO -  use for mobile and web view
  getQuestionsByBatchType, //TODO -  use for admin panel (test create section)
  getRelatedQuestionsById, //TODO - use for web and mobile
  getScholarshipQuestions, //TODO -  use for admin panel Scholarship section
  getQuestionBatchSubject, //TODO -  use for admin panel (test create section)
  updateQuestionsStatus
};
