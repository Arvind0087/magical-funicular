const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Response } = require("../../helpers/response.helper");
const { getRandomObjects } = require("../../helpers/service.js");
const { Sequelize, Op } = require("sequelize");
const Subject = db.subject;
const User = db.users;
const Admin = db.admin;
const Test = db.test;
const Test_Question_Map = db.test_question_map;
const TestSubjectMap = db.test_subject_map;
const TestBatchMap = db.test_batch_map;
const batchType = db.batchTypes;
const BatchDate = db.batchDate;
const StudentDetails = db.student;
const UserDetails = db.users;
const Course = db.courses;
const Board = db.boards;
const Class = db.class;
const BatchTypes = db.batchTypes;
const AllQuestions = db.questionBank;
const Chapter = db.chapter;
const RolePermission = db.permissionRole;
const StudentTestMap = db.student_test_map;
const StudentTestAttemptMap = db.test_student_attempt_map;
const QuizDetails = db.quiz;
const TeacherSubjectMap = db.teacher_subject_map;

//ANCHOR : create Test
const createTest = async (req, res) => {
  try {
    const {
      batchTypeIds,
      batchStartDateIds,
      category,
      title,
      testTime,
      questionsId,
    } = req.body;

    let chapterIds = [];

    //NOTE - Get  User details from token
    const getAdmin = await Admin.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: RolePermission,
          attributes: ["role"],
        },
      ],
    });

    //NOTE - create new test
    const createdTest = await Test.create({
      category: category,
      title: title,
      numberOfQuestions: questionsId.length,
      testTime: testTime,
      createdId: getAdmin.id,
      createdBy: getAdmin.permission_role?.role,
    });

    //NOTE - Find all questions details
    const questionDetails = await AllQuestions.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: questionsId,
        },
      },
    });

    //NOTE - if questions bget subject and chapter ids
    for (const qu of questionDetails) {
      //NOTE -  push chapter
      chapterIds.push(qu.chapterId);
    }

    //NOTE - get unique chapter
    const uniqueArrChapter = chapterIds.filter(
      (value, index) => chapterIds.indexOf(value) === index
    );
    //NOTE - If subject and chapter both come
    if (uniqueArrChapter) {
      for (const ids of uniqueArrChapter) {
        const getChapter = await Chapter.findOne({
          where: {
            id: ids,
          },
        });

        //NOTE - push data in test subject map table
        await TestSubjectMap.create({
          testId: createdTest.id,
          courseId: getChapter.courseId,
          boardId: getChapter.boardId,
          classId: getChapter.classId,
          batchTypeId: getChapter.batchTypeId,
          subjectId: getChapter.subjectId,
          chapterId: getChapter.chapterId,
          topicId: null,
          createdId: getAdmin.id,
          createdBy: getAdmin.permission_role?.role,
        });
      }
    }

    //NOTE - push all questions for test
    for (const id of questionsId) {
      await Test_Question_Map.create({
        testId: createdTest.id,
        questionId: id,
      });
    }

    if (batchTypeIds && batchStartDateIds) {
      const batchIds = new Set();

      //NOTE - find data bsed on the batch dates
      for (const dates of batchStartDateIds) {
        const date = await BatchDate.findOne({
          where: {
            id: dates,
          },
        });

        //NOTE -  push batchType ids
        batchIds.add(date.batchTypeId);

        //NOTE - create mapping batch
        await TestBatchMap.create({
          testId: createdTest.id,
          batchTypeId: date.batchTypeId,
          batchStartDateId: date.id,
        });
      }
      //NOTE : Convert the Set to an array
      const uniqueBatchIds = [...batchIds];

      //NOTE : get the batch whose batch start date was not come
      const uniqueValues = batchTypeIds.filter(
        (value) => !uniqueBatchIds.includes(value)
      );

      if (uniqueValues.length > 0) {
        //NOTE - push the batchtype where  batchStartDate is null
        for (const data of uniqueValues) {
          await TestBatchMap.create({
            testId: createdTest.id,
            batchTypeId: data,
            batchStartDateId: null,
          });
        }
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.TEST_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all test
const getAllTest = async (req, res) => {
  try {
    let getAllTest = [];

    const { page, limit, category, title } = req.query;
    let query = {};

    if (page && limit) {
      query.offset = Number(page - 1) * limit;
      query.limit = Number(limit);
    }

    if (category) {
      query.where = {
        category: category,
      };
    }

    if (title) {
      query.where = {
        ...query.where,
        title: { [Op.like]: "%" + title + "%" },
      };
    }

    //NOTE - user filter based on class and batch type
    let testParams = null;
    if (
      req.user?.role &&
      ["teacher", "mentor",].includes(req?.user?.role.toLowerCase())
    ) {
      //NOTE - get staff details
      const getAdmin = await Admin.findOne({ where: { id: req.user.id } });
      //NOTE - get staff class and batch details
      const teachersSubject = await TeacherSubjectMap.findAll({
        where: { teacherId: getAdmin.id },
        attributes: ["classId", "batchTypeId"],
      });
      //NOTE - get all class details
      const classesIds = teachersSubject.map((item) => item.classId);
      //NOTE - get all batch details
      const batchIds = teachersSubject.map((item) => item.batchTypeId);

      //NOTE - params based on class or batch type
      const idParams = batchIds.every((id) => id === null)
        ? { classId: { [Sequelize.Op.in]: classesIds } }
        : { batchTypeId: { [Sequelize.Op.in]: batchIds } };

      //NOTE - get all student details
      const tests = await TestSubjectMap.findAll({
        where: idParams,
        attributes: ["testId"]
      });
      //NOTE - Get test unique
      const testkey = "testId";
      const uniqueTest = [
        ...new Map(tests.map((item) => [item[testkey], item])).values(),
      ].sort();
      const testIds = uniqueTest.map((item) => item.dataValues.testId);
      testParams = { id: { [Sequelize.Op.in]: testIds } };
    }

    //NOTE - get all test 
    const getTest = await Test.findAndCountAll({
      where: {
        category: {
          [Op.notIn]: ["Own Tests", "Scholarship Test"],
        },
        ...testParams,
        ...query.where,
      },
      include: {
        model: Admin,
        as: "creator",
        attributes: ["id", "name"],
        include: {
          model: RolePermission,
          attributes: ["role"],
        },
      },
      offset: query.offset || 0,
      limit: query.limit || 10,
      order: [["createdAt", "DESC"]],
    });

    for (const allTest of getTest.rows) {
      getAllTest.push({
        id: allTest.id,
        category: allTest.category,
        title: allTest.title,
        numberOfQuestions: allTest.numberOfQuestions,
        time: allTest.testTime,
        createdByName: allTest.creator?.name,
        createdByRole: allTest.creator?.permission_role?.role,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getTest.count,
      data: getAllTest,
    });
  } catch (err) {
    return Response(res, 500, err.message, []);
  }
};

//ANCHOR : get test by id
const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const testID = id;
    const question = [];
    let batchTypeNames = [];

    //NOTE - Get test details
    const getTest = await Test.findOne({
      where: { id: testID },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!getTest)
      return res.status(400).send({
        status: 400,
        message: msg.TEST_NOT_FOUND,
      });

    //NOTE: get mapping question details from mapping table
    const getAllMappingQuestions = await Test_Question_Map.findAll({
      where: { testId: getTest.id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!getAllMappingQuestions)
      return res.status(400).send({
        status: 400,
        message: msg.TEST_NOT_FOUND,
      });

    //NOTE - get test course, board, class details
    const mappingClass = await TestSubjectMap.findAll({
      where: { testId: getTest.id },
      include: [
        {
          model: Course,
          attributes: ["name"],
        },
        {
          model: Board,
          attributes: ["name"],
        },
        {
          model: Class,
          attributes: ["name"],
        },
      ],
    });

    //NOTE - get test batchtype details
    const mappingBatch = await TestBatchMap.findAll({
      where: { testId: getTest.id },
      include: {
        model: BatchTypes,
        attributes: ["name"],
      },
    });

    for (const data of mappingBatch) {
      batchTypeNames.push(data.batchType.name); //TODO - push all batchType name
    }

    //NOTE - unique batch name
    const uniqueBatchTypeNames = [...new Set(batchTypeNames)];

    //NOTE : get all question details
    for (const questions of getAllMappingQuestions) {
      const getQuestions = await AllQuestions.findOne({
        where: { id: questions?.questionId },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      question.push({
        id: getQuestions?.id,
        question: getQuestions.question,
        A: getQuestions.A,
        B: getQuestions.B,
        C: getQuestions.C,
        D: getQuestions.D,
        answer: getQuestions.answer,
      });
    }

    //NOTE: push all data
    const getAllTest = {
      id: getTest?.id,
      category: getTest.category,
      type: getTest?.type,
      title: getTest?.title,
      numberOfQuestions: getTest?.numberOfQuestions,
      time: getTest?.testTime,
      courseName: mappingClass[0].course.name,
      boardName: mappingClass[0].board.name,
      className: mappingClass[0].class.name,
      batchType: uniqueBatchTypeNames,
      questions: question,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getAllTest,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: update test
const updateTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const testID = id;

    const {
      batchTypeId,
      subjectId, //TODO - Use if admin or student wants to change Subject
      category,
      type, //TODO - only use when student create text
      title,
      numberOfQuestions,
      testTime,
      questionsId,
    } = req.body;

    let testDetails = {};

    if (subjectId && batchTypeId) {
      testDetails = await Subject.findOne({
        where: { id: subjectId, batchTypeId: batchTypeId },
      });
    } else {
      testDetails = await batchType.findOne({
        where: { id: batchTypeId },
      });
    }

    //NOTE - get test details
    const getTest = await Test.findOne({
      where: { id: testID },
    });
    if (!getTest) {
      return res.status(400).send({ status: 400, message: msg.TEST_NOT_FOUND });
    }

    //NOTE: get mapping question details from mapping table
    const getAllMappingQuestions = await Test_Question_Map.findAll({
      where: { testId: getTest.id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (getAllMappingQuestions) {
      //NOTE - Destory all data
      await Test_Question_Map.destroy({
        where: {
          testId: getTest.id,
        },
      });
    }

    //NOTE: update test table
    await getTest.update(
      {
        courseId: testDetails.courseId,
        boardId: testDetails.boardId,
        classId: testDetails.classId,
        subjectId: subjectId && batchTypeId ? testDetails.id : null,
        batchTypeId:
          subjectId && batchTypeId ? testDetails.batchTypeId : testDetails.id,
        category: category,
        type: type,
        title: title,
        numberOfQuestions: numberOfQuestions,
        testTime: testTime,
      },
      { where: { id: getTest.id } }
    );

    //NOTE - Update test question map table
    for (const ids of questionsId) {
      const mapQuestions = new Test_Question_Map({
        testId: getTest.id,
        questionId: ids,
      });
      await mapQuestions.save();
    }

    return res.status(200).send({
      status: 200,
      message: msg.TEST_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete Test
const deleteTestById = async (req, res) => {
  try {
    const getTest = await Test.findOne({
      where: { id: req.params.id },
    });
    if (!getTest) {
      return res.status(400).send({ status: 400, message: msg.TEST_NOT_FOUND });
    }
    await Test.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({ status: 200, message: msg.TEST_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Create test by student
//TODO - Use on Mobile and web screen
const createTestByStudent = async (req, res) => {
  try {
    const {
      subjectIds,
      chapterIds,
      difficultyLevels,
      numberOfQuestions,
      testTime,
    } = req.body;
    let getChapter;
    let question = [];
    let finalQuestion = [];

    //NOTE - Get question based on the difficultyLevel and subject
    const allQuestion = await AllQuestions.findAll({
      where: {
        status: 1,
        subjectId: {
          [Sequelize.Op.in]: subjectIds,
        },
        chapterId: {
          [Sequelize.Op.in]: chapterIds,
        },
      },
    });

    //NOTE - if questions not there for the selected subject or chapter
    if (allQuestion.length === 0)
      return res
        .status(400)
        .send({ status: 400, message: msg.QUESTION_NOT_FOUND });

    //NOTE - Get User details from token
    const getUser = await User.findOne({
      where: { id: req.user.id }, //TODO - get student id from token
    });

    //NOTE - Create Test
    const newTest = new Test({
      title: "Custom Test",
      testTime: testTime,
      category: "Own Tests",
      createdBy: "Student",
      createdId: getUser.id,
      difficultyLevels: JSON.stringify(difficultyLevels),
    });

    const createdTest = await newTest.save();
    //NOTE - Mapping Subject and chapter
    if (subjectIds && chapterIds) {
      for (const chaIds of chapterIds) {
        getChapter = await Chapter.findOne({
          where: {
            id: chaIds,
          },
        });

        const mappingSubject = new TestSubjectMap({
          testId: createdTest.id,
          courseId: getChapter.courseId,
          boardId: getChapter.boardId,
          classId: getChapter.classId,
          subjectId: getChapter.subjectId,
          batchTypeId: getChapter.batchTypeId,
          chapterId: getChapter.id,
          createdBy: "Student",
          createdId: getUser.id,
        });
        await mappingSubject.save();

        //NOTE - Get question based on the difficultyLevel and subject
        const allQuestion = await AllQuestions.findAll({
          where: {
            status:1,
            chapterId: chaIds,
            difficultyLevel: {
              [Sequelize.Op.in]: difficultyLevels,
            },
          },

          attributes: ["id", "question", "A", "B", "C", "D"],
        });
        for (const q of allQuestion) {
          question.push({
            id: q.id,
            question: q.question,
            A: q.A,
            B: q.B,
            C: q.C,
            D: q.D,
          });
        }
      }
    } else {
      for (const subIds of subjectIds) {
        const mappingSubject = new TestSubjectMap({
          testId: createdTest.id,
          subjectId: subIds,
        });
        await mappingSubject.save();

        //NOTE - Get question based on the difficultyLevel and subject
        const allQuestion = await AllQuestions.findAll({
          where: {
            status:1,
            chapterId: subIds,
            difficultyLevel: {
              [Sequelize.Op.in]: difficultyLevels,
            },
          },
        });

        for (const q of allQuestion) {
          question.push({
            id: q.id,
            question: q.question,
            A: q.A,
            B: q.B,
            C: q.C,
            D: q.D,
          });
        }
      }
    }

    //NOTE - select questions dynamically
    const randomQuestionsArray = getRandomObjects(question, numberOfQuestions);

    //NOTE - Push all questions
    for (const quu of randomQuestionsArray) {
      finalQuestion.push({
        id: quu.id,
        question: quu.question,
        options: [(A = quu.A), (B = quu.B), (C = quu.C), (D = quu.D)],
      });
    }

    for (const data of randomQuestionsArray) {
      const mappingQuestions = new Test_Question_Map({
        testId: createdTest.id,
        questionId: data.id,
      });
      await mappingQuestions.save();
    }

    //NOTE - Update Test with question count
    await Test.update(
      {
        numberOfQuestions: randomQuestionsArray.length,
      },
      { where: { id: createdTest.id } }
    );

    //NOTE - push final result
    const results = {
      id: createdTest.id,
      numberOfQuestions: createdTest.numberOfQuestions,
      time: createdTest?.testTime,
      questions: finalQuestion,
    };

    return res.status(200).send({
      status: 200,
      message: msg.TEST_CREATED,
      data: results,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get test by subject and chapter Id
const getTestByUserId = async (req, res) => {
  try {
    const { subjectId, chapterId, topicId } = req.body;
    const result = [];
    let getTest = [];

    //NOTE - user id from token
    const userId = req.user.id;

    //NOTE - Find user Details
    const user = await UserDetails.findOne({
      where: { id: userId },
      include: {
        model: StudentDetails,
        attributes: ["batchTypeId"],
      },
    });

    if (!user)
      return res.status(400).send({
        status: 400,
        message: msg.USER_NOT_FOUND,
      });

    //NOTE - params when subject, chapter and topic is comimg
    let parms;
    if (subjectId && chapterId) {
      //NOTE - params when subjectId and chapterId
      parms = {
        subjectId,
        chapterId,
        scholarshipId: null,
      };
    } else if (subjectId && chapterId && topicId) {
      //NOTE - params when subjectId , chapterId and topicId
      parms = {
        subjectId,
        chapterId,
        topicId,
        scholarshipId: null,
      };
    } else if (subjectId) {
      //TODO - if only subject id is come
      //NOTE - check subject details
      const subjectDetails = await Subject.findOne({
        where: { id: subjectId },
      });
      //NOTE - if subject is a all subject
      if (subjectDetails.isAllSubject === 1) {
        const subjectIds = (
          await Subject.findAll({
            where: { batchTypeId: user.student.batchTypeId, isAllSubject: 0 },
          })
        ).map(({ id }) => id); //TODO - find all subject details

        const chapterIds = (
          await Chapter.findAll({
            where: { subjectId: subjectIds },
            order: [["createdAt", "ASC"]],
          })
        ).map(({ id }) => id); //TODO - find all chapter details

        //NOTE - to get all test details
        parms = {
          chapterId: {
            [Sequelize.Op.in]: chapterIds,
          },
          scholarshipId: null,
        };
      } else {
        //NOTE - to get  test details based on the subject id
        parms = {
          subjectId,
          scholarshipId: null,
        };
      }
    }

    ///TODO - if no parameter is coming
    let testParams;
    if (["Free"].includes(user.subscriptionType)) {
      try {
        //NOTE - get all subject details
        const subject_details = await Subject.findAll({
          where: { batchTypeId: user.student.batchTypeId, isAllSubject: 0 },
        });

        //NOTE - get all chapter details
        const chapterIds = await Promise.allSettled(
          subject_details.map(async (data) => {
            const chapter_details = await Chapter.findOne({
              where: { subjectId: data.id },
              order: [["createdAt", "ASC"]],
            });
            return chapter_details.id;
          })
        );

        testParams = {
          chapterId: {
            [Sequelize.Op.in]: chapterIds.map((chapter) => chapter.value),
          },
          scholarshipId: null,
        };
      } catch (error) {
        //NOTE: handle error
      }
    } else {
      testParams = {
        batchTypeId: user.student.batchTypeId,
        scholarshipId: null,
      };
    }

    //NOTE - if user id is comimg but subject and chapter is not there
    if (user && !subjectId && !chapterId && !topicId) {
      //NOTE: get mapping subject details from mapping table
      getTest = await TestSubjectMap.findAll({
        where: { ...testParams },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: {
          model: Test,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      });

      if (!getTest)
        return res.status(200).send({
          status: 200,
          message: msg.TEST_NOT_FOUND,
          data: [],
        });
    } else if (
      (user && subjectId && chapterId) ||
      (user && subjectId && chapterId && !topicId) ||
      (user && subjectId && !chapterId && !topicId)
    ) {
      //NOTE: get mapping subjcet details from mapping table
      getTest = await TestSubjectMap.findAll({
        where: { ...parms },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: {
          model: Test,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        group: ["test_subject_map.id", "test.id"],
        tableName: "test_subject_map",
      });

      if (!getTest)
        return res.status(200).send({
          status: 200,
          message: msg.TEST_NOT_FOUND,
          data: [],
        });
    }

    //NOTE - only filter own test values
    const uniqueTestByKey = getTest
      .filter((item) => item.test.category !== "Own Tests")
      .sort((a, b) => a.id - b.id);

    //NOTE :  Query for all the attempted tests for the current user
    const attemptedTests = await StudentTestMap.findAll({
      where: { studentId: userId },
      order: [["testId"], ["attemptCount", "DESC"]],
    });

    //NOTE Organize the attempted tests into a dictionary
    const latestAttemptByTestId = {};
    attemptedTests.forEach((attemptedTest) => {
      if (!(attemptedTest.testId in latestAttemptByTestId)) {
        latestAttemptByTestId[attemptedTest.testId] = attemptedTest;
      }
    });

    //NOTE : Loop over the unique tests and push the final data
    for (const data of uniqueTestByKey) {
      let attemptedTest = latestAttemptByTestId[data.testId];
      let correct = 0;

      if (attemptedTest) {
        const aa = await StudentTestMap.findAll({
          where: {
            testId: attemptedTest.testId,
            studentId: userId,
            attemptCount: attemptedTest.attemptCount,
            status: "Answered",
          },
          attributes: ["answer"],
          include: [
            {
              model: AllQuestions,
              attributes: ["answer"],
            },
          ],
        });

        for (const data of aa) {
          if (data.answer === data.questionBank.answer) {
            correct = correct + 1;
          }
        }
      }

      //NOTE - push final data
      result.push({
        id: data.testId,
        category: data.test?.category,
        title: data.test?.title,
        testTime: data.test?.testTime,
        questionCount: data.test?.numberOfQuestions,
        marks: data.test?.numberOfQuestions,
        score: correct,
        attempt: attemptedTest !== undefined,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Get question based on test id
const getTestQuestions = async (req, res) => {
  try {
    const { testId, quizId, scholarshipId } = req.query;
    //NOTE - constant to push result
    let result = [];
    let allAttemptCount = [];
    let count;
    let teststartBystudent;
    let scholarshipTestDetails;

    //NOTE - studentId from token
    const studentId = req.user.id;
    //NOTE - Get  User details from token
    const getUserDetails = await User.findOne({
      where: { id: studentId },
      include: [
        {
          model: StudentDetails,
          attributes: ["courseId", "boardId", "classId"],
        },
      ],
    });

    if (!getUserDetails)
      return res.status(400).send({
        status: 400,
        message: msg.USER_NOT_FOUND,
      });

    if (scholarshipId) {
      //NOTE - get Scholarship Test details
      scholarshipTestDetails = await TestSubjectMap.findOne({
        where: {
          scholarshipId: scholarshipId,
          courseId: getUserDetails.student?.courseId,
          boardId: getUserDetails.student?.boardId,
          classId: getUserDetails.student?.classId,
        },
      });
    }

    if (testId || scholarshipId) {
      if (scholarshipId) {
        //NOTE - create a column as test started
        teststartBystudent = await StudentTestAttemptMap.create({
          testId: scholarshipTestDetails.testId,
          scholarshipId: scholarshipId,
          studentId: studentId,
          attemptCount: count,
          status: "On going",
        });
      } else {
        //NOTE - push as test started
        const findTestDetails = await StudentTestAttemptMap.findAll({
          where: {
            testId: testId,
            studentId: studentId,
          },
        });

        if (findTestDetails) {
          //NOTE - Push all count
          for (const mapping of findTestDetails) {
            allAttemptCount.push(mapping.attemptCount);
          }

          //NOTE - generate next attemptCount if again student comes to give same test
          if (allAttemptCount.length !== 0) {
            count = Math.max(...allAttemptCount) + 1;
          } else {
            //TODO - if coming first time
            count = 1;
          }
        }

        //NOTE - find test details
        const getTestDetails = await Test.findOne({
          where: { id: testId },
          attributes: ["category"],
        });

        //NOTE - create a column as test started
        teststartBystudent = await StudentTestAttemptMap.create({
          testId: testId,
          studentId: studentId,
          attemptCount: count,
          category: getTestDetails.category,
          status: "On going",
        });
      }
    } else {
      teststartBystudent = await StudentTestAttemptMap.findOne({
        where: {
          quizId: quizId,
        },
      });
    }

    let parameter;
    if (testId) {
      parameter = {
        testId: testId,
      };
    } else if (quizId) {
      parameter = {
        quizId: quizId,
      };
    } else if (scholarshipId) {
      parameter = {
        scholarshipId: scholarshipId,
        testId: scholarshipTestDetails.testId,
      };
    }

    //NOTE - find all test question from question map table
    const questions = await Test_Question_Map.findAll({
      where: { ...parameter },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: AllQuestions,
        attributes: [
          "id",
          "question",
          "A",
          "B",
          "C",
          "D",
          "answer",
          "difficultyLevel",
        ],
      },
    });

    if (testId || scholarshipId) {
      //NOTE : push all question in student test map table
      for (const data of questions) {
        await StudentTestMap.create({
          startId: teststartBystudent.id,
          studentId: studentId,
          testId: testId || scholarshipTestDetails.testId,
          scholarshipId: scholarshipId || null,
          questionId: data.questionBank.id,
          answer: "",
          time: "00:00:00",
          startDate: new Date(),
          attemptCount: count,
          status: "Not Visited", //TODO - status will be skipped
        });
      }
    }

    let testMapParams;
    if (testId) {
      testMapParams = {
        testId: testId,
        startId: teststartBystudent.id,
      };
    } else if (quizId) {
      testMapParams = {
        quizId: quizId,
        startId: teststartBystudent.id,
      };
    } else if (scholarshipId) {
      testMapParams = {
        scholarshipId: scholarshipId,
        startId: teststartBystudent.id,
      };
    }

    //NOTE - get all question details
    const allQuestionData = await StudentTestMap.findAll({
      where: {
        ...testMapParams,
      },
      include: [
        {
          model: Test,
          attributes: ["id", "numberOfQuestions", "testTime"],
        },
        {
          model: QuizDetails,
          attributes: ["id", "time", "numberOfQuestions"],
        },
        {
          model: AllQuestions,
          attributes: [
            "id",
            "question",
            "A",
            "B",
            "C",
            "D",
            "answer",
            "difficultyLevel",
          ],
        },
      ],
    });

    //NOTE - Push all question details
    for (const data of allQuestionData) {
      result.push({
        id: data.id,
        questionCount:
          testId || scholarshipId
            ? data.test.numberOfQuestions
            : data.quiz.numberOfQuestions,
        questionId: data.questionBank.id,
        questions: data.questionBank.question,
        A: data.questionBank.A,
        B: data.questionBank.B,
        C: data.questionBank.C,
        D: data.questionBank.D,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: {
        testStartId: teststartBystudent.id,
        testId: testId || scholarshipId ? allQuestionData[0].testId : null,
        time:
          testId || scholarshipId
            ? allQuestionData[0].test.testTime
            : allQuestionData[0].quiz.time,
        questions: result,
      },
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR : get all test
const getOwnTest = async (req, res) => {
  try {
    const { page, limit } = req.query;

    //NOTE - add pagination
    const query =
      page && limit
        ? {
          offset: Number(page - 1) * limit,
          limit: Number(limit),
        }
        : {};

    //NOTE - user filter based on class and batch type
    let testParams = null;
    if (
      req.user?.role &&
      ["teacher", "mentor"].includes(req?.user?.role.toLowerCase())
    ) {
      //NOTE - get staff class and batch details
      const teachersSubject = await TeacherSubjectMap.findAll({
        where: { teacherId: req.user.id },
        attributes: ["classId", "batchTypeId"],
      });
      //NOTE - get all class details
      const classesIds = teachersSubject.map((item) => item.classId);
      //NOTE - get all batch details
      const batchIds = teachersSubject.map((item) => item.batchTypeId);

      //NOTE - params based on class or batch type
      const idParams = batchIds.every((id) => id === null)
        ? { classId: { [Sequelize.Op.in]: classesIds } }
        : { batchTypeId: { [Sequelize.Op.in]: batchIds } };

      //NOTE - get all student details
      const tests = await TestSubjectMap.findAll({
        where: idParams,
        attributes: ["testId"]
      });
      //NOTE - Get test unique
      const testkey = "testId";
      const uniqueTest = [
        ...new Map(tests.map((item) => [item[testkey], item])).values(),
      ].sort();
      const testIds = uniqueTest.map((item) => item.dataValues.testId);
      testParams = { id: { [Sequelize.Op.in]: testIds } };
    }

    ///NOTE - get all own test data
    const { count, rows } = await Test.findAndCountAll({
      ...query,
      where: {
        category: "Own Tests",
        ...testParams,               //NOTE - get only test of teacher class and batch base
      },
      order: [["createdAt", "DESC"]],
      include: {
        model: User,
        attributes: ["id", "name"],
        include: {
          model: StudentDetails,
          include: [
            {
              model: Class,
              attributes: ["name"],
            },
            {
              model: BatchTypes,
              attributes: ["name"],
            },
          ],
        },
      },
    });

    //NOTE - check if test attempted or not
    const attemptedTests = await StudentTestMap.findAll({
      where: {
        studentId: rows.map((data) => data.createdId),
        testId: rows.map((data) => data.id),
      },
      attributes: ["studentId", "testId"],
    });

    const attemptedMap = new Map();
    attemptedTests.forEach((attemptedTest) => {
      const key = `${attemptedTest.studentId}-${attemptedTest.testId}`;
      attemptedMap.set(key, true);
    });

    //NOTE - push final result
    const response = rows.map((data) => ({
      id: data.id,
      student: data.user?.name,
      studentId: data.createdId,
      className: data.user?.student?.class?.name,
      batchType: data.user?.student?.batchType?.name,
      title: data.title,
      numberOfQuestions: data.numberOfQuestions,
      time: data.testTime,
      difficultyLevels:
        data.difficultyLevels === "" ? null : JSON.parse(data.difficultyLevels),
      attempted: attemptedMap.has(`${data.createdId}-${data.id}`),
    }));

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: response,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR : get test by subject and chapter Id
const getOwnTestByUserId = async (req, res) => {
  try {
    const { subjectId, chapterId, topicId } = req.body;
    //NOTE - user id from token
    const userId = req.user.id;
    const result = [];

    let parms;
    if (subjectId && chapterId && topicId) {
      parms = {
        subjectId: subjectId,
        chapterId: chapterId,
        topicId: topicId,
        scholarshipId: null,
      };
    } else if (subjectId && chapterId) {
      parms = {
        subjectId: subjectId,
        chapterId: chapterId,
        scholarshipId: null,
      };
    } else {
      parms = {
        subjectId: subjectId,
        scholarshipId: null,
      };
    }

    //NOTE - Find user Details
    const user = await UserDetails.findOne({
      where: { id: userId },
    });

    if (!user)
      return res.status(400).send({
        status: 400,
        message: msg.USER_NOT_FOUND,
      });

    //NOTE - if user id is comimg but subject and chapter is not there
    if (user && !subjectId && !chapterId && !topicId) {
      let testIds = [];

      //NOTE Get tests created by the student
      const testDetails = await Test.findAll({
        where: { createdId: userId, category: "Own Tests" },
        order: [["createdAt", "DESC"]],
        limit: 20,
      });

      if (!testDetails || testDetails.length === 0) {
        //NOTE No own tests found for this user
        return res.status(200).send({
          status: 200,
          message: msg.OWN_TEST_NOT_AVAILABLE,
          data: [],
        });
      }

      //NOTE :  Get all attempted tests for the current user
      const attemptedTests = await StudentTestMap.findAll({
        where: { studentId: userId },
        order: [["testId"], ["attemptCount", "DESC"]],
      });

      //NOTE : Organize the attempted tests into a dictionary
      const latestAttemptByTestId = {};
      attemptedTests.forEach((attemptedTest) => {
        if (!(attemptedTest.testId in latestAttemptByTestId)) {
          latestAttemptByTestId[attemptedTest.testId] = attemptedTest;
        }
      });

      const result = await Promise.all(
        testDetails.map(async (data) => {
          testIds.push(data.id);
          const attemptedTest = latestAttemptByTestId[data.id];
          let correct = 0;
          if (attemptedTest) {
            const aa = await StudentTestMap.findAll({
              where: {
                testId: attemptedTest.testId,
                studentId: userId,
                attemptCount: attemptedTest.attemptCount,
                status: "Answered",
              },
              attributes: ["answer"],
              include: [
                {
                  model: AllQuestions,
                  attributes: ["answer"],
                },
              ],
            });

            correct = aa.filter(
              (attemptedQuestion) =>
                attemptedQuestion.answer ===
                attemptedQuestion.questionBank.answer
            ).length;
          }

          return {
            id: data.id,
            category: data.category,
            title: data.title,
            testTime: data.testTime,
            questionCount: data.numberOfQuestions,
            marks: data.numberOfQuestions,
            score: correct,
            attempt: attemptedTest !== undefined,
          };
        })
      );

      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: result,
      });
    } else if (
      (user && subjectId && chapterId) ||
      (user && subjectId && chapterId && !topicId) ||
      (user && subjectId && !chapterId && !topicId)
    ) {
      //NOTE :  Get mapping subject details from mapping table
      const testSubjectDetails = await TestSubjectMap.findAll({
        where: {
          createdId: userId,
          ...parms,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: {
          model: Test,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        group: ["test_subject_map.id", "test.id"],
        tableName: "test_subject_map",
      });

      //NOTE Query for all the attempted tests for the current user
      const attemptedTests = await StudentTestMap.findAll({
        where: { studentId: userId },
        order: [["testId"], ["attemptCount", "DESC"]],
      });

      //NOTE Organize the attempted tests into a dictionary
      const latestAttemptByTestId = {};
      attemptedTests.forEach((attemptedTest) => {
        if (!(attemptedTest.testId in latestAttemptByTestId)) {
          latestAttemptByTestId[attemptedTest.testId] = attemptedTest;
        }
      });

      //NOTE Loop through the test details and push the final data
      for (const data of testSubjectDetails) {
        const attemptedTest = latestAttemptByTestId[data.testId];
        let correct = 0;

        if (attemptedTest) {
          const aa = await StudentTestMap.findAll({
            where: {
              testId: attemptedTest.testId,
              studentId: userId,
              attemptCount: attemptedTest.attemptCount,
              status: "Answered",
            },
            attributes: ["answer"],
            include: [
              {
                model: AllQuestions,
                attributes: ["answer"],
              },
            ],
          });

          for (const data of aa) {
            if (data.answer === data.questionBank.answer) {
              correct++;
            }
          }
        }

        result.push({
          id: data.testId,
          category: data.test?.category,
          title: data.test?.title,
          testTime: data.test?.testTime,
          questionCount: data.test?.numberOfQuestions,
          marks: data.test?.numberOfQuestions,
          score: correct,
          attempt: attemptedTest !== undefined,
        });
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createTest,
  getTestById,
  getAllTest,
  updateTestById,
  deleteTestById,
  createTestByStudent, //TODO - Create test by student
  getTestByUserId, //TODO - Use on web and mobile
  getTestQuestions, //TODO - Use on web and mobile
  getOwnTest, //TODO - Use on ADMIN
  getOwnTestByUserId, //TODO - Use on web and mobile
};
