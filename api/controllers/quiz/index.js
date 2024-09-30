const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Op } = require("sequelize");
const { getRandomObjects } = require("../../helpers/service");
const QuizDetails = db.quiz;
const QuestionBank = db.questionBank;
const UserDetails = db.users;
const SubjectDetails = db.subject;
const StudentTestAttemptMap = db.test_student_attempt_map;
const StudentTestMap = db.student_test_map;
const Test_Question_Map = db.test_question_map;

//ANCHOR - Create Quiz
const createQuiz = async (req, res) => {
  try {
    const { subjectId } = req.body;
    let questions = [];
    let finalQuestion = [];
    let results = {};

    //NOTE - id from token
    const studentId = req.user.id;

    //NOTE - Get question based on the  subject id
    const allQuestion = await QuestionBank.findAll({
      where: {
        status:1,
        subjectId: subjectId,
      },
      attributes: ["id", "question", "A", "B", "C", "D"],
    });

    //NOTE - if questions not there for the selected subject
    if (allQuestion.length === 0) {
      return res
        .status(400)
        .send({ status: 400, message: msg.QUESTION_NOT_FOUND });
    } else {
      for (const q of allQuestion) {
        questions.push({
          id: q.id,
          question: q.question,
          A: q.A,
          B: q.B,
          C: q.C,
          D: q.D,
        });
      }

      //NOTE - Get random question
      const randomQuestionsArray = await getRandomObjects(questions, 10);

      //NOTE - Create Quiz
      const newQuiz = new QuizDetails({
        subjectId: subjectId,
        studentId: studentId,
        numberOfQuestions: randomQuestionsArray.length,
        time: "00:15:00",
        createdById: studentId,
      });

      await newQuiz.save();

      //NOTE - create a column as test started
      const teststartBystudent = await StudentTestAttemptMap.create({
        quizId: newQuiz.id,
        studentId: studentId,
        attemptCount: 1,
        status: "On going",
      });

      //NOTE: Push questions for quiz
      for (const data of randomQuestionsArray) {
        const mappingQuestions = new Test_Question_Map({
          quizId: newQuiz.id,
          questionId: data.id,
        });
        await mappingQuestions.save();

        //NOTE : push all question in student test map table
        const pushQuiz = await StudentTestMap.create({
          startId: teststartBystudent.id,
          studentId: studentId,
          quizId: newQuiz.id,
          questionId: data.id,
          answer: "",
          time: "00:00:00",
          startDate: new Date(),
          attemptCount: 1,
          status: "Not Visited", //TODO - status will be skipped
        });

        //NOTE - push final questions
        finalQuestion.push({
          id: pushQuiz.id,
          questionId: data.id,
          question: data.question,
          options: [(A = data.A), (B = data.B), (C = data.C), (D = data.D)],
        });
      }

      //NOTE - push final result
      results = {
        id: newQuiz.id,
        testStartId: teststartBystudent.id,
        numberOfQuestions: newQuiz.numberOfQuestions,
        time: "00:15:00",
        questions: finalQuestion,
      };
    }

    return res.status(200).send({
      status: 200,
      message: msg.QUIZ_CREATED,
      data: results,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - get all Quiz details
const getAllQuiz = async (req, res) => {
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

    const { count, rows } = await QuizDetails.findAndCountAll({
      ...query,
      exclude: ["createdAt", "updatedAt"],
      include: [
        { model: UserDetails, attributes: ["id", "name"] },
        { model: SubjectDetails, attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!rows)
      return res
        .status(200)
        .send({ status: 200, message: msg.NOT_FOUND, data: [] });

    //NOTE - Final data push
    const result = rows.map((quiz) => ({
      id: quiz.id,
      subjectName: quiz.subject.name,
      studentName: quiz.user.name,
      numberOfQuestions: quiz.numberOfQuestions,
      markPerQuestion: quiz.markPerQuestion,
    }));

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Get Quiz By Id
const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    //NOTE: Get question by quize Id
    const quizQuestions = await Test_Question_Map.findAll({
      where: { quizId: id },
      exclude: ["createdAt", "updatedAt"],
      include: [
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
          ],
        },
        {
          model: QuizDetails,
          exclude: ["createdAt", "updatedAt"],
          include: [
            { model: UserDetails, attributes: ["id", "name"] },
            { model: SubjectDetails, attributes: ["id", "name"] },
          ],
        },
      ],
    });

    if (!quizQuestions)
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });

    //NOTE - Push all questions
    const questions = quizQuestions.map((quu) => ({
      id: quu.questionBank.id,
      question: quu.questionBank.question,
      A: quu.questionBank.A,
      B: quu.questionBank.B,
      C: quu.questionBank.C,
      D: quu.questionBank.D,
      answer: quu.questionBank.answer,
      explanation: quu.questionBank.explanation,
    }));

    //NOTE - Push final response
    const result = {
      id: quizQuestions[0].quiz?.id,
      time: quizQuestions[0].quiz?.time,
      subjectId: quizQuestions[0].quiz?.subject.id,
      subjectName: quizQuestions[0].quiz?.subject.name,
      studentId: quizQuestions[0].quiz?.user.id,
      studentName: quizQuestions[0].quiz?.user.name,
      numberOfQuestions: quizQuestions[0].quiz?.numberOfQuestions,
      markPerQuestion: quizQuestions[0].quiz?.markPerQuestion,
      questions: questions,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get quiz report by id (use on admin panel)
const getStudentQuizReport = async (req, res) => {
  try {
    const { studentId, quizId } = req.body;
    let questions = [];
    let correct = 0;
    let wrongAnswer = 0;
    let allQuestionIds = [];
    let allAttemptQuestionIds = [];

    //NOTE - get all attempted quiz details
    const attemptQuiz = await StudentTestMap.findAll({
      where: {
        studentId: studentId,
        quizId: quizId,
      },
      attributes: ["id", "studentId", "quizId", "questionId", "answer"],
      include: [
        {
          model: QuizDetails,
          attributes: ["id", "time", "numberOfQuestions", "markPerQuestion"],
          include: [
            { model: SubjectDetails, attributes: ["id", "name"] },
            { model: UserDetails, attributes: ["name"] },
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

    for (const aa of attemptQuiz) {
      //NOTE - push all attempted quiz question ids
      allAttemptQuestionIds.push(aa.questionId);

      //NOTE - push all quiz question ids
      allQuestionIds.push(aa.questionId);
    }

    //NOTE - Un Attempted question count
    const unAttemptedAnswer = await StudentTestMap.findAll({
      where: {
        studentId: studentId,
        quizId: quizId,
        status: {
          [Op.or]: ["Skipped", "Not Visited"],
        },
      },
    });

    //NOTE - Count for correct answer and wrong answer
    for (const data of attemptQuiz) {
      //NOTE: Atttempted with correct answer
      if (data.answer === data.questionBank.answer) {
        correct = correct + 1;
      }
      //NOTE: Atttempted with wrong answer
      if (["A", "B", "C", "D"].includes(data.answer))
        if (data.answer !== data.questionBank.answer) {
          wrongAnswer = wrongAnswer + 1;
        }
    }

    //NOTE - Push questions
    for (const qu of attemptQuiz) {
      let answerGivenByStudent = null;
      let questionAttempted = true;
      //NOTE - Answer given by the student
      if (["A", "B", "C", "D"].includes(qu.answer)) {
        if (qu.questionId === qu.questionBank.id) {
          answerGivenByStudent = qu.answer;
        }
      }

      //NOTE - Question attempted or not
      for (const a of unAttemptedAnswer) {
        if (qu.questionBank.id === a.questionId) {
          questionAttempted = false;
        }
      }
      //NOTE - push all questions
      questions.push({
        id: qu.questionBank.id,
        question: qu.questionBank.question,
        A: qu.questionBank.A,
        B: qu.questionBank.A,
        C: qu.questionBank.C,
        D: qu.questionBank.D,
        answer: qu.questionBank.answer,
        explanation: qu.questionBank.explanation,
        difficultyLevel: qu.questionBank.difficultyLevel,
        answerGivenByStudent: answerGivenByStudent,
        questionAttempted: questionAttempted,
      });
    }

    const allData = {
      id: attemptQuiz[0].quiz?.id,
      studentId: attemptQuiz[0].quiz?.studentId,
      studentName: attemptQuiz[0].quiz.user?.name,
      testTime: attemptQuiz[0].quiz.time,
      numberOfQuestions: attemptQuiz[0].quiz.numberOfQuestions,
      markPerQuestion: attemptQuiz[0].quiz.markPerQuestion,
      subjectId: attemptQuiz[0].quiz.subject?.id,
      subjectName: attemptQuiz[0].quiz.subject?.name,
      correctAnswer: correct,
      wrongAnswer: wrongAnswer,
      unAttemptedAnswer: unAttemptedAnswer.length,
      questions: questions,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allData,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

module.exports = {
  createQuiz,
  getAllQuiz, //TODO - Only Use for admin panel
  getQuizById, //TODO - Only Use for admin panel
  getStudentQuizReport, //TODO - use admin panel
};
