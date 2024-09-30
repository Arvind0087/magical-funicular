const db = require("../../models/index");
const msg = require("../../constants/Messages");
const {
  getKeyFromObject,
  formatDuration,
  convertTime,
  calculateAverageTimePerQuestion,
  evaluateTest,
  getTimeStatus,
} = require("./service");
const { Sequelize, Op } = require("sequelize");
const Test = db.test;
const QuizDetails = db.quiz;
const QuestionBank = db.questionBank;
const StudentTestMap = db.student_test_map;
const Users = db.users;
const SubjectDetails = db.subject;
const TestQuestionMap = db.test_question_map;
const AssignmentData = db.assignment;
const AssignmentQuestion = db.assignment_question_map;
const StudentTestAttemptMap = db.test_student_attempt_map;
const AssignmentStartTime = db.assignment_startTime_map;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const StudentDetails = db.student;

//ANCHOR : get all test
const getAllTestReports = async (req, res) => {
  try {
    const { page, limit, studentId, type } = req.query;

    let result = [];
    //NOTE - add pagination
    const query =
      page && limit
        ? {
            offset: Number(page - 1) * limit,
            limit: Number(limit),
          }
        : {};

    //NOTE - filter based on studentId
    const final = studentId ? { id: studentId } : undefined;

    let params;
    if (["quiz"].includes(type)) {
      params = {
        quizId: { [Op.not]: null },
      };
    } else {
      params = {
        testId: { [Op.not]: null },
        category: {
          [Op.notIn]: ["Own Tests", "Scholarship Test"],
        },
      };
    }

    let userParams = null;
    if (
      req.user?.role &&
      ["teacher", "mentor"].includes(req.user.role.toLowerCase())
    ) {
      //NOTE - get staff details
      const getAdmin = await AdminUser.findOne({ where: { id: req.user.id } });
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
      const students = await StudentDetails.findAll({ where: idParams });
      //NOTE - get all students type ids
      const typeIds = students.map((item) => item.dataValues.id);

      userParams = { studentId: { [Sequelize.Op.in]: typeIds } };
    }

    //NOTE - get all attempted test details
    const { count, rows } = await StudentTestAttemptMap.findAndCountAll({
      ...query,
      where: { ...params, ...userParams },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Test,
          attributes: [
            "id",
            "category",
            "type",
            "title",
            "numberOfQuestions",
            "testTime",
          ],
        },
        {
          model: QuizDetails,
          attributes: ["id", "time", "numberOfQuestions", "attempt"],
          include: { model: SubjectDetails, attributes: ["id", "name"] },
        },
        { model: Users, attributes: ["id", "name"], where: final },
      ],
    });

    //NOTE - final data push
    for (const reports of rows) {
      if (["quiz"].includes(type)) {
        //NOTE - get all attempted test details
        const testDetails = await StudentTestMap.findAll({
          where: {
            quizId: reports.quiz?.id,
            studentId: reports.user?.id,
            status: "Answered",
          },
          attributes: ["id", "studentId", "testId", "questionId", "answer"],
          include: {
            model: QuestionBank,
            attributes: [
              "id",
              "question",
              "A",
              "B",
              "C",
              "D",
              "answer",
              "explanation",
              "difficultyLevel",
            ],
          },
        });

        let correct = 0;
        if (testDetails)
          for (const data of testDetails) {
            //NOTE: Atttempted with correct answer
            if (data.answer === data.questionBank.answer) {
              correct = correct + 1;
            }
          }

        //NOTE - Push final result for quiz
        result.push({
          id: reports.id,
          quizId: reports.quiz?.id,
          studentId: reports.user?.id,
          studentName: reports.user?.name,
          questionCount: reports.quiz?.numberOfQuestions,
          time: reports.quiz?.time,
          subjectId: reports.quiz?.subject?.id,
          subjectName: reports.quiz?.subject?.name,
          coins: correct ? correct : 0,
        });
      } else {
        //NOTE - Push final result for test
        result.push({
          id: reports.id,
          testId: reports.testId,
          studentId: reports.studentId,
          studentName: reports.user?.name,
          category: reports.test?.category,
          title: reports.test?.title,
          numberOfQuestions: reports.test?.numberOfQuestions,
          testTime: reports.test?.testTime,
        });
      }
    }

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

//ANCHOR: get testReport by id
const getTestReportById = async (req, res) => {
  try {
    const { studentId, testId, studentStartId } = req.body;
    let questions = [];
    let correct = 0;
    let wrongAnswer = 0;
    let unAttemptedAnswer = 0;

    //NOTE - get all attempted test details
    const attemptedTest = await StudentTestMap.findAll({
      where: {
        studentId: studentId,
        testId: testId,
        startId: studentStartId,
      },
      attributes: [
        "id",
        "studentId",
        "testId",
        "questionId",
        "answer",
        "status",
      ],
      include: [
        {
          model: Test,
          attributes: [
            "id",
            "category",
            "type",
            "title",
            "numberOfQuestions",
            "testTime",
          ],
        },
        {
          model: QuestionBank,
          attributes: [
            "id",
            "question",
            "A",
            "B",
            "C",
            "D",
            "answer",
            "explanation",
            "difficultyLevel",
          ],
        },
        {
          model: Users,
          attributes: ["name"],
        },
      ],
    });

    if (attemptedTest.length === 0)
      return res
        .status(400)
        .send({ status: 400, message: msg.TEST_NOT_ATTEMPTED });

    //NOTE - Count for correct answer and wrong answer
    for (const data of attemptedTest) {
      //NOTE: Atttempted with correct answer
      if (data.answer === data.questionBank.answer) {
        correct = correct + 1;
      }
      //NOTE: Atttempted with wrong answer
      if (["A", "B", "C", "D"].includes(data.answer)) {
        if (data.answer !== data.questionBank.answer) {
          wrongAnswer = wrongAnswer + 1;
        }
      }

      //NOTE - Un Attempted question count
      if ([""].includes(data.answer)) {
        unAttemptedAnswer = unAttemptedAnswer + 1;
      }
    }

    //NOTE - Push questions
    for (const data of attemptedTest) {
      questions.push({
        id: data.questionBank.id,
        question: data.questionBank.question,
        A: data.questionBank.A,
        B: data.questionBank.A,
        C: data.questionBank.C,
        D: data.questionBank.D,
        answer: data.questionBank.answer,
        explanation: data.questionBank.explanation,
        difficultyLevel: data.questionBank.difficultyLevel,
        answerGivenByStudent: data.answer !== "" ? data.answer : null,
        questionAttempted: data.answer !== "" ? true : false,
      });
    }

    let allData = {
      id: attemptedTest[0]?.id,
      studentId: attemptedTest[0]?.studentId,
      studentName: attemptedTest[0].user?.name,
      testId: attemptedTest[0]?.testId,
      category: attemptedTest[0].test?.category,
      type: attemptedTest[0].test?.type,
      title: attemptedTest[0].test?.title,
      numberOfQuestions: attemptedTest[0].test?.numberOfQuestions,
      testTime: attemptedTest[0].test?.testTime,
      correctAnswer: correct,
      wrongAnswer: wrongAnswer,
      unAttemptedAnswer: unAttemptedAnswer,
      questions: questions,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allData,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Score Summary report
const getScoreSummary = async (req, res) => {
  try {
    const { testId, assignmentId, quizId, attemptCount } = req.body;
    //NOTE - get User id from token
    const userId = req.user.id;

    let finalData = {};
    let correct = 0;
    const totalPercentage = 100;
    let valuePerQuestion;
    let percentage;

    //NOTE - add parameter
    let params;
    const commonParams = {
      studentId: userId,
      status: "Answered",
    };

    if (testId) {
      params = {
        ...commonParams,
        testId: testId,
        attemptCount: attemptCount,
      };
    } else if (quizId) {
      params = {
        ...commonParams,
        quizId: quizId,
      };
    } else if (assignmentId) {
      params = {
        ...commonParams,
        assignmentId: assignmentId,
      };
    }

    //NOTE - get all attempted test details
    const attemptedTest = await StudentTestMap.findAll({
      where: {
        ...params,
      },
      attributes: [
        "id",
        "studentId",
        "testId",
        "questionId",
        "answer",
        "quizId",
        "assignmentId",
      ],
      include: {
        model: QuestionBank,
        attributes: ["id", "question", "answer"],
      },
    });

    let testDetails;
    if (testId) {
      //NOTE - get all questions for a test
      testDetails = await Test.findOne({
        where: {
          id: testId,
        },
      });
    } else if (quizId) {
      //NOTE - get all questions for a test
      testDetails = await QuizDetails.findOne({
        where: {
          id: quizId,
        },
        attributes: ["id", "numberOfQuestions", "markPerQuestion"],
      });
    } else if (assignmentId) {
      //NOTE - get all questions for a test
      testDetails = await AssignmentData.findOne({
        where: {
          id: assignmentId,
        },
        attributes: ["id", "questionCount", "markPerQuestion"],
      });
    }

    //NOTE - Count for correct answer and wrong answer
    for (const data of attemptedTest) {
      //NOTE: Atttempted with correct answer
      if (data.answer === data.questionBank.answer) {
        correct = correct + 1;
      }
    }

    if (testId || quizId) {
      valuePerQuestion = totalPercentage / testDetails.numberOfQuestions;
    } else {
      valuePerQuestion = totalPercentage / testDetails.questionCount;
    }
    //NOTE - Percentage count
    percentage = (valuePerQuestion * correct).toFixed(2);

    //NOTE - Final Data
    finalData = {
      totalQuestion:
        testId || quizId
          ? testDetails.numberOfQuestions
          : testDetails.questionCount,
      totalScore: correct,
      percentage: Number(percentage),
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: finalData,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Know Your Efficiency
const timeSpendForTest = async (req, res) => {
  try {
    const { testId, assignmentId, quizId, attemptCount } = req.body;
    const studentId = req.user.id;
    let testDetails;
    let allSpendtimes = [];
    let finalData = {};

    let params;
    if (testId) {
      params = {
        studentId: studentId,
        testId: testId,
        attemptCount: attemptCount,
        status: "Answered",
      };
    } else if (quizId) {
      params = {
        quizId: quizId,
        studentId: studentId,
        status: "Answered",
      };
    } else if (assignmentId) {
      params = {
        assignmentId: assignmentId,
        studentId: studentId,
        status: "Answered",
      };
    }

    //NOTE - get all attempted test details
    const attemptedTest = await StudentTestMap.findAll({
      where: {
        ...params,
      },
      attributes: [
        "id",
        "studentId",
        "testId",
        "questionId",
        "answer",
        "time",
        "quizId",
        "assignmentId",
      ],
    });

    if (testId) {
      //NOTE - get all questions for a test
      testDetails = await Test.findOne({
        where: {
          id: testId,
        },
        attributes: ["id", "testTime"],
      });
    } else if (quizId) {
      //NOTE - get all questions for a quiz
      testDetails = await QuizDetails.findOne({
        where: {
          id: quizId,
        },
        attributes: ["id", "time"],
      });
    } else if (assignmentId) {
      //NOTE - get all questions for a assignment
      testDetails = await AssignmentData.findOne({
        where: {
          id: assignmentId,
        },
        attributes: ["id", "time"],
      });
    }

    //NOTE - Push all spend times
    for (const a of attemptedTest) {
      allSpendtimes.push(a.time);
    }
    //NOTE - Got all total time spend on test
    const time = await formatDuration(allSpendtimes);

    //NOTE: get total test time
    const totalTime = testId
      ? await convertTime(testDetails.testTime)
      : await convertTime(testDetails.time);

    const averageTimePerQuestion = await calculateAverageTimePerQuestion(
      time,
      attemptedTest.length
    );

    //NOTE - Final Data
    finalData = {
      totalTestTime: totalTime,
      attemptedTestTime: time,
      averageTimePerQuestion: averageTimePerQuestion,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: finalData,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Time Wise Question Analysis
const questionAnalysis = async (req, res) => {
  try {
    const { testId, quizId, assignmentId, attemptCount } = req.body;

    const studentId = req.user.id;
    let finalData = {};
    let correct = 0;
    let wrongAnswer = 0;
    let unAttemptedQuestion = 0;
    let testDetails;

    let params;
    if (testId) {
      params = {
        studentId: studentId,
        testId: testId,
        attemptCount: attemptCount,
        status: "Answered",
      };
    } else if (quizId) {
      params = {
        quizId: quizId,
        studentId: studentId,
        status: "Answered",
      };
    } else if (assignmentId) {
      params = {
        assignmentId: assignmentId,
        studentId: studentId,
        status: "Answered",
      };
    }

    if (testId) {
      //NOTE - get test details
      testDetails = await Test.findOne({
        where: { id: testId },
        attributes: ["id", "numberOfQuestions"],
      });
    } else if (quizId) {
      testDetails = await QuizDetails.findOne({
        where: {
          id: quizId,
        },
        attributes: ["id", "time", "numberOfQuestions", "markPerQuestion"],
      });
    } else if (assignmentId) {
      //NOTE - get all questions for a assignment
      testDetails = await AssignmentData.findOne({
        where: {
          id: assignmentId,
        },
        attributes: ["id", "time", "questionCount", "markPerQuestion"],
      });
    }
    //NOTE - get all attempted test details
    const attemptedTest = await StudentTestMap.findAll({
      where: {
        ...params,
      },
      attributes: ["id", "studentId", "testId", "questionId", "answer"],
      include: {
        model: QuestionBank,
        attributes: [
          "id",
          "question",
          "A",
          "B",
          "C",
          "D",
          "answer",
          "explanation",
          "difficultyLevel",
        ],
      },
    });

    //NOTE - Count for correct answer and wrong answer
    for (const data of attemptedTest) {
      //NOTE: Atttempted with correct answer
      if (data.answer === data.questionBank.answer) {
        correct = correct + 1;
      }
      //NOTE: Atttempted with wrong answer
      if (data.answer !== data.questionBank.answer) {
        wrongAnswer = wrongAnswer + 1;
      }
    }

    if (testId || quizId) {
      //NOTE - Un attempted question count
      unAttemptedQuestion =
        testDetails.numberOfQuestions - (correct + wrongAnswer);
    } else {
      //NOTE - Un attempted question count
      unAttemptedQuestion = testDetails.questionCount - (correct + wrongAnswer);
    }

    //NOTE - Push final data
    finalData = {
      noOfCorrectAnswer: correct,
      noOfIncorrectAnswer: wrongAnswer,
      unAttemptedQuestion: unAttemptedQuestion,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: finalData,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR -  Get testReport with answer key
const getTestReport = async (req, res) => {
  try {
    const { testId, assignmentId, quizId, attemptCount } = req.body;

    const studentId = req.user.id;
    let allData = {};
    let questions = [];
    let allQuestionIds = [];
    let allAttQuestionIds = [];
    let unAttemptedAnswer = [];
    let correct = 0;
    let wrongAnswer = 0;

    if (testId) {
      //NOTE - get all attempted test details
      const attemptedTest = await StudentTestMap.findAll({
        where: {
          studentId: studentId,
          testId: testId,
          attemptCount: attemptCount,
          status: "Answered",
        },
        attributes: [
          "id",
          "studentId",
          "testId",
          "questionId",
          "answer",
          "time",
        ],
        include: [
          {
            model: Test,
            attributes: [
              "id",
              "category",
              "type",
              "title",
              "numberOfQuestions",
              "testTime",
            ],
          },
          {
            model: QuestionBank,
            attributes: [
              "id",
              "question",
              "A",
              "B",
              "C",
              "D",
              "answer",
              "explanation",
              "difficultyLevel",
            ],
          },
        ],
      });

      if (!attemptedTest)
        return res.status(400).send({
          status: 400,
          message: msg.NOT_FOUND,
        });

      //NOTE - get test details
      const testDetails = await Test.findOne({
        where: {
          id: testId,
        },
      });

      //NOTE - get all questions for a test
      const allQuestions = await TestQuestionMap.findAll({
        where: {
          testId: testId,
        },
        include: {
          model: QuestionBank,
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

      for (const qu of allQuestions) {
        allQuestionIds.push(qu.questionId);
      }

      for (const aa of attemptedTest) {
        allAttQuestionIds.push(aa.questionId);
      }

      //NOTE - get all unattempted test quextions
      const unAttemptQuiz = await StudentTestMap.findAll({
        where: {
          studentId: studentId,
          testId: testId,
          attemptCount: attemptCount,
          status: {
            [Op.or]: ["Skipped", "Not Visited"],
          },
        },
      });
      //NOTE - UnAttempted question count
      for (const data of unAttemptQuiz) {
        unAttemptedAnswer.push(data.questionId);
      }

      //NOTE - Count for correct answer and wrong answer
      for (const data of attemptedTest) {
        //NOTE: Atttempted with correct answer
        if (data.answer === data.questionBank.answer) {
          correct = correct + 1;
        }
        //NOTE: Atttempted with wrong answer
        if (data.answer !== data.questionBank.answer) {
          wrongAnswer = wrongAnswer + 1;
        }
      }

      //NOTE - Push questions
      for (const qu of allQuestions) {
        let answerGivenByStudent = null;
        let questionAttempted = true;
        let testTime;

        for (const data of attemptedTest) {
          //NOTE - Answer given by the student
          if (data.questionId === qu.questionBank.id) {
            answerGivenByStudent = data.answer;
          }
        }

        //NOTE - Question attempted or not
        for (const a of unAttemptedAnswer) {
          if (qu.questionBank.id === a) {
            questionAttempted = false;
          }
        }

        //NOTE - time taken by the student to give the answer
        for (const data of attemptedTest) {
          if (data.questionId === qu.questionBank.id) {
            testTime = data.time;
          }
        }

        questions.push({
          id: qu.questionBank.id,
          question: qu.questionBank.question,
          answer: await getKeyFromObject(
            qu.questionBank.answer,
            qu.questionBank
          ),
          difficultyLevel: qu.questionBank.difficultyLevel,
          answerGivenByStudent: answerGivenByStudent
            ? await getKeyFromObject(answerGivenByStudent, qu.questionBank)
            : null,
          questionAttempted: questionAttempted,
          correctAnswer:
            qu.questionBank.answer === answerGivenByStudent ? true : false,
          marks: qu.questionBank.answer === answerGivenByStudent ? 1 : 0,
          time: testTime ? testTime : "00:00:00",
          answeringPace: testTime ? await getTimeStatus(testTime) : null,
        });
      }

      allData = {
        id: testDetails?.id,
        numberOfQuestions: testDetails.numberOfQuestions,
        correctAnswer: correct,
        wrongAnswer: wrongAnswer,
        unAttemptedAnswer: unAttemptedAnswer.length,
        questions: questions,
      };
    } else if (assignmentId) {
      //NOTE - Get all  attempted Assignment details
      const attemptedAssignment = await StudentTestMap.findAll({
        where: {
          studentId: studentId,
          assignmentId: assignmentId,
          status: "Answered",
        },
        attributes: [
          "id",
          "studentId",
          "assignmentId",
          "questionId",
          "answer",
          "time",
        ],
        include: [
          {
            model: AssignmentData,
            attributes: [
              "id",
              "name",
              "questionCount",
              "markPerQuestion",
              "time",
            ],
          },
          {
            model: QuestionBank,
            attributes: [
              "id",
              "question",
              "A",
              "B",
              "C",
              "D",
              "answer",
              "explanation",
              "difficultyLevel",
            ],
          },
        ],
      });

      if (!attemptedAssignment)
        return res.status(400).send({
          status: 400,
          message: msg.NOT_FOUND,
        });

      //NOTE - get assignment details
      const assignmentData = await AssignmentData.findOne({
        where: { id: assignmentId },
      });

      //NOTE - get all questions for a test
      const allQuestions = await AssignmentQuestion.findAll({
        where: {
          assignmentId: assignmentId,
        },
        include: {
          model: QuestionBank,
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

      for (const qu of allQuestions) {
        allQuestionIds.push(qu.questionId);
      }

      for (const aa of attemptedAssignment) {
        allAttQuestionIds.push(aa.questionId);
      }

      //NOTE - UnAttempted question count
      const unAttemptedAnswer = allQuestionIds.filter(
        (element) => !allAttQuestionIds.includes(element)
      );
      //NOTE - Count for correct answer and wrong answer
      for (const data of attemptedAssignment) {
        //NOTE: Atttempted with correct answer
        if (data.answer === data.questionBank.answer) {
          correct = correct + 1;
        }
        //NOTE: Atttempted with wrong answer
        if (data.answer !== data.questionBank.answer) {
          wrongAnswer = wrongAnswer + 1;
        }
      }

      //NOTE - Push questions
      for (const qu of allQuestions) {
        let answerGivenByStudent = null;
        let questionAttempted = true;
        let testTime;
        for (const data of attemptedAssignment) {
          //NOTE - Answer given by the student
          if (data.questionId === qu.questionBank.id) {
            answerGivenByStudent = data.answer;
          }
        }

        //NOTE - Question attempted or not
        for (const a of unAttemptedAnswer) {
          if (qu.questionBank.id === a) {
            questionAttempted = false;
          }
        }

        //NOTE - time taken by the student to give the answer
        for (const data of attemptedTest) {
          if (data.questionId === qu.questionBank.id) {
            testTime = data.time;
          }
        }

        questions.push({
          id: qu.questionBank.id,
          question: qu.questionBank.question,
          answer: await getKeyFromObject(
            qu.questionBank.answer,
            qu.questionBank
          ),
          difficultyLevel: qu.questionBank.difficultyLevel,
          answerGivenByStudent: answerGivenByStudent
            ? await getKeyFromObject(answerGivenByStudent, qu.questionBank)
            : null,
          questionAttempted: questionAttempted,
          correctAnswer:
            qu.questionBank.answer === answerGivenByStudent ? true : false,
          marks: qu.questionBank.answer === answerGivenByStudent ? 1 : 0,
          time: testTime ? testTime : "00:00:00",
          answeringPace: testTime ? await getTimeStatus(testTime) : null,
        });
      }

      //NOTE - Push final result
      allData = {
        id: assignmentData?.id,
        numberOfQuestions: assignmentData?.questionCount,
        correctAnswer: correct,
        wrongAnswer: wrongAnswer,
        unAttemptedAnswer: unAttemptedAnswer.length,
        questions: questions,
      };
    } else if (quizId) {
      //NOTE - get all attempted test details
      const attemptedQuiz = await StudentTestMap.findAll({
        where: {
          studentId: studentId,
          quizId: quizId,
          status: "Answered",
        },
        attributes: [
          "id",
          "studentId",
          "quizId",
          "questionId",
          "answer",
          "time",
        ],
        include: [
          {
            model: QuizDetails,
            attributes: [
              "id",
              "time",
              "numberOfQuestions",
              "markPerQuestion",
              "markPerQuestion",
            ],
          },
          {
            model: QuestionBank,
            attributes: [
              "id",
              "question",
              "A",
              "B",
              "C",
              "D",
              "answer",
              "explanation",
              "difficultyLevel",
            ],
          },
        ],
      });

      if (!attemptedQuiz)
        return res.status(400).send({
          status: 400,
          message: msg.NOT_FOUND,
        });
      //NOTE - get all questions for a test
      const allQuestions = await TestQuestionMap.findAll({
        where: {
          quizId: quizId,
        },
        include: {
          model: QuestionBank,
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

      //NOTE - get quiz details
      const getQuizDetails = await QuizDetails.findOne({
        where: { id: quizId },
      });

      for (const qu of allQuestions) {
        allQuestionIds.push(qu.questionId);
      }

      for (const aa of attemptedQuiz) {
        allAttQuestionIds.push(aa.questionId);
      }

      //NOTE - get all unattempted quiz quextions
      const unAttemptQuiz = await StudentTestMap.findAll({
        where: {
          studentId: studentId,
          quizId: quizId,
          status: {
            [Op.or]: ["Skipped", "Not Visited"],
          },
        },
      });

      //NOTE - UnAttempted question count
      for (const data of unAttemptQuiz) {
        unAttemptedAnswer.push(data.questionId);
      }

      //NOTE - Count for correct answer and wrong answer
      for (const data of attemptedQuiz) {
        //NOTE: Atttempted with correct answer
        if (data.answer === data.questionBank.answer) {
          correct = correct + 1;
        }
        //NOTE: Atttempted with wrong answer
        if (data.answer !== data.questionBank.answer) {
          wrongAnswer = wrongAnswer + 1;
        }
      }

      //NOTE - Push questions
      for (const qu of allQuestions) {
        let answerGivenByStudent = null;
        let questionAttempted = true;
        let testTime;

        for (const data of attemptedQuiz) {
          //NOTE - Answer given by the student
          if (data.questionId === qu.questionBank.id) {
            answerGivenByStudent = data.answer;
          }
        }

        //NOTE - Question attempted or not
        for (const a of unAttemptedAnswer) {
          if (qu.questionBank.id === a) {
            questionAttempted = false;
          }
        }

        //NOTE - time taken by the student to give the answer
        for (const data of attemptedQuiz) {
          if (data.questionId === qu.questionBank.id) {
            testTime = data.time;
          }
        }

        questions.push({
          id: qu.questionBank.id,
          question: qu.questionBank.question,
          answer: getKeyFromObject(qu.questionBank.answer, qu.questionBank),
          difficultyLevel: qu.questionBank.difficultyLevel,
          answerGivenByStudent: answerGivenByStudent
            ? getKeyFromObject(answerGivenByStudent, qu.questionBank)
            : null,
          questionAttempted: questionAttempted,
          correctAnswer:
            qu.questionBank.answer === answerGivenByStudent ? true : false,
          marks: qu.questionBank.answer === answerGivenByStudent ? 1 : 0,
          time: testTime ? testTime : "00:00:00",
          answeringPace: testTime ? await getTimeStatus(testTime) : null,
        });
      }

      allData = {
        id: getQuizDetails.id,
        numberOfQuestions: getQuizDetails.numberOfQuestions,
        correctAnswer: correct,
        wrongAnswer: wrongAnswer,
        unAttemptedAnswer: unAttemptedAnswer.length,
        markPerQuestion: getQuizDetails.markPerQuestion,
        questions: questions,
      };
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allData,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR -  Get testReport (Time Wise Question Analysis)
const questionTimeAnalysis = async (req, res) => {
  try {
    const { testId, assignmentId, quizId, attemptCount } = req.body;
    const studentId = req.user.id;
    let result;

    let params;
    if (testId) {
      params = {
        studentId: studentId,
        testId: testId,
        attemptCount: attemptCount,
        status: "Answered",
      };
    } else if (quizId) {
      params = {
        studentId: studentId,
        quizId: quizId,
        status: "Answered",
      };
    } else if (assignmentId) {
      params = {
        studentId: studentId,
        assignmentId: assignmentId,
        status: "Answered",
      };
    }
    //NOTE - get all attempted test details
    const attemptedTest = await StudentTestMap.findAll({
      where: {
        ...params,
      },
      attributes: [
        "id",
        "studentId",
        "testId",
        "questionId",
        "answer",
        "time",
        "quizId",
        "assignmentId",
      ],
      include: {
        model: QuestionBank,
        attributes: [
          "id",
          "question",
          "A",
          "B",
          "C",
          "D",
          "answer",
          "explanation",
          "difficultyLevel",
        ],
      },
    });

    //NOTE: get result
    result = await evaluateTest(attemptedTest);

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR -  Get exam summary
const getExamSummary = async (req, res) => {
  try {
    const { studentTestId } = req.body;
    const studentId = req.user.id;
    let attempted = 0;
    let skipped = 0;
    let notVisited = 0;
    let checkTime;
    let result;

    //NOTE - check the attempt count of current test
    const checkTest = await StudentTestAttemptMap.findOne({
      where: {
        id: studentTestId,
        studentId: studentId,
      },
    });

    if (!checkTest) {
      checkTime = await AssignmentStartTime.findOne({
        where: {
          id: studentTestId,
          studentId: studentId,
        },
      });
     
    }


    if (!checkTest && !checkTime) {
      return res.status(400).send({ status: 400, message: msg.TEST_NOT_FOUND });
    }

    let params;
    if (checkTest) {
      if (checkTest.testId && !checkTest.quizId) {
        //NOTE - if it's test
        params = {
          startId: checkTest.id,
          studentId: studentId,
          testId: checkTest.testId,
        };
      } else if (!checkTest.testId && checkTest.quizId) {
        //NOTE - if it's quiz
        params = {
          startId: checkTest.id,
          studentId: studentId,
          quizId: checkTest.quizId,
        };
      }
    } else if (!checkTest && checkTime) {
      //NOTE - if it's quiz
      params = {
        startId: checkTime.id,
        studentId: studentId,
        assignmentId: checkTime.assignmentId,
      };
    }

    //NOTE - get all question details
    const questionAttemptList = await StudentTestMap.findAll({
      where: {
        ...params,
      },
      include: [
        {
          model: AssignmentData,
          attributes: ["id", "questionCount", "time"],
        },
        {
          model: Test,
          attributes: ["id", "numberOfQuestions", "testTime"],
        },
        {
          model: QuizDetails,
          attributes: ["id", "numberOfQuestions", "time"],
        },
      ],
    });

    for (const data of questionAttemptList) {
      if (["Answered"].includes(data.status)) {
        attempted = attempted + 1;
      } else if (["Skipped"].includes(data.status)) {
        skipped = skipped + 1;
      } else if (["Not Visited"].includes(data.status)) {
        notVisited = notVisited + 1;
      }
    }

    if (checkTest) {
      result = {
        numberOfQuestions:
          checkTest.testId !== null
            ? questionAttemptList[0]?.test.numberOfQuestions
            : questionAttemptList[0]?.quiz.numberOfQuestions,
        attempted: attempted,
        skipped: skipped,
        notVisited: notVisited,
      };
    } else if (!checkTest && checkTime) {
      result = {
        numberOfQuestions: questionAttemptList[0]?.assignment?.questionCount,
        attempted: attempted,
        skipped: skipped,
        notVisited: notVisited,
      };
    }

    console.log("result",result);

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR: get testReport by id
const getOwnTestReportById = async (req, res) => {
  try {
    const { studentId, testId, attemptCount } = req.body;
    let questions = [];
    let correct = 0;
    let wrongAnswer = 0;
    let unAttemptedAnswer = 0;

    //NOTE - get all attempted test details
    const attemptedTest = await StudentTestMap.findAll({
      where: {
        studentId: studentId,
        testId: testId,
        attemptCount: attemptCount,
      },
      attributes: [
        "id",
        "studentId",
        "testId",
        "questionId",
        "answer",
        "status",
      ],
      include: [
        {
          model: Test,
          attributes: [
            "id",
            "category",
            "type",
            "title",
            "numberOfQuestions",
            "testTime",
          ],
        },
        {
          model: QuestionBank,
          attributes: [
            "id",
            "question",
            "A",
            "B",
            "C",
            "D",
            "answer",
            "explanation",
            "difficultyLevel",
          ],
        },
        {
          model: Users,
          attributes: ["name"],
        },
      ],
    });

    if (attemptedTest.length === 0)
      return res
        .status(400)
        .send({ status: 400, message: msg.TEST_NOT_ATTEMPTED });

    //NOTE - Count for correct answer and wrong answer
    for (const data of attemptedTest) {
      //NOTE: Atttempted with correct answer
      if (data.answer === data.questionBank.answer) {
        correct = correct + 1;
      }
      //NOTE: Atttempted with wrong answer
      if (["A", "B", "C", "D"].includes(data.answer)) {
        if (data.answer !== data.questionBank.answer) {
          wrongAnswer = wrongAnswer + 1;
        }
      }

      //NOTE - Un Attempted question count
      if ([""].includes(data.answer)) {
        unAttemptedAnswer = unAttemptedAnswer + 1;
      }
    }

    //NOTE - Push questions
    for (const data of attemptedTest) {
      questions.push({
        id: data.questionBank.id,
        question: data.questionBank.question,
        A: data.questionBank.A,
        B: data.questionBank.A,
        C: data.questionBank.C,
        D: data.questionBank.D,
        answer: data.questionBank.answer,
        explanation: data.questionBank.explanation,
        difficultyLevel: data.questionBank.difficultyLevel,
        answerGivenByStudent: data.answer !== "" ? data.answer : null,
        questionAttempted: data.answer !== "" ? true : false,
      });
    }

    let allData = {
      id: attemptedTest[0]?.id,
      studentId: attemptedTest[0]?.studentId,
      studentName: attemptedTest[0].user?.name,
      testId: attemptedTest[0]?.testId,
      category: attemptedTest[0].test?.category,
      type: attemptedTest[0].test?.type,
      title: attemptedTest[0].test?.title,
      numberOfQuestions: attemptedTest[0].test?.numberOfQuestions,
      testTime: attemptedTest[0].test?.testTime,
      correctAnswer: correct,
      wrongAnswer: wrongAnswer,
      unAttemptedAnswer: unAttemptedAnswer,
      questions: questions,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allData,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  getAllTestReports,
  getTestReportById,
  getScoreSummary, //TODO - use on Web and Mobile Screen
  timeSpendForTest, //TODO - use on Web and Mobile Screen
  questionAnalysis, //TODO - use on Web and Mobile Screen
  getTestReport, //TODO - use on Web and Mobile Screen
  questionTimeAnalysis, //TODO - use on Web and Mobile Screen
  getExamSummary, //TODO - use on Web and Mobile Screen
  getOwnTestReportById, //TODO -  use for Admin panel
};
