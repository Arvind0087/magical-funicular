const db = require("../../models/index");
const msg = require("../../constants/Messages");
const {
  addTestAttemptTimes,
  createActivity,
  createActivityTest,
  createActivityForQuiz,
  createActivityQuizCompleted,
} = require("./service");
const { retriveLeads } = require("../../helpers/leadsquard");
const { config } = require("../../config/db.config");
const { bathDetails } = require("../../helpers/batchValidator");
const { captureLead } = require("../users/service");
const { userDetails } = require("../../helpers/userdetails");
const QuizDetails = db.quiz;
const QuestionBank = db.questionBank;
const Coins = db.coins;
const AssignmentStartTime = db.assignment_startTime_map;
const studentLeaderBoardMap = db.student_leaderboard_map;
const StudentTestAttemptMap = db.test_student_attempt_map;
const StudentTestMap = db.student_test_map;

//ANCHOR : Student Attempt Test
const testAttempted = async (req, res) => {
  try {
    const { id, answer, time, type } = req.body;

    //NOTE - studentId from token
    const studentId = req.user.id;
    let correctAnswer = 0;

    //TODO - if attempt Test
    const id_value = id ?? null;
    const answer_value = answer ?? null;

    if (typeof id_value === "undefined" || id_value === null) {
      return res.status(400).send({
        status: 400,
        message: msg.QUESTION_CANT_BLANK,
      });
    } else {
      //NOTE - Find question details
      const questionDetails = await StudentTestMap.findOne({
        where: {
          id: id,
        },
      });

      //NOTE - If answer key is not coming then its a skipped question
      if (
        typeof answer_value === "undefined" ||
        answer_value === null ||
        answer_value === ""
      ) {
        //NOTE - push the result
        await StudentTestMap.update(
          {
            studentId: studentId,
            answer: answer,
            time: await addTestAttemptTimes(questionDetails.time, time),
            startDate: new Date(),
            scholarshipId: null,
            status: "Skipped", //TODO - status will be skipped
          },
          {
            where: {
              id: id,
            },
          }
        );
      } else {
        //NOTE - push the result
        await StudentTestMap.update(
          {
            studentId: studentId,
            answer: answer,
            time: await addTestAttemptTimes(questionDetails.time, time),
            startDate: new Date(),
            scholarshipId: null,
            status: "Answered", //TODO - status will be Answered
          },
          {
            where: {
              id: id,
            },
          }
        );

        if (type === "quizId" || type === "quiz") {
          //TODO - change in next build
          const getQuestion = await StudentTestMap.findOne({
            where: {
              id: id,
              studentId: studentId,
            },
            include: {
              model: QuestionBank,
              attributes: ["id", "question", "answer"],
            },
          });

          //NOTE - update quiz table as student attempt the question
          await QuizDetails.update(
            {
              attempt: 1,
            },
            {
              where: { id: getQuestion.quizId },
            }
          );

          //NOTE: Attempted with correct answer
          if (answer === getQuestion.questionBank.answer) {
            correctAnswer = correctAnswer + 1;
          }

          //NOTE - Check coin details
          const coinDetails = await Coins.findOne({
            where: { studentId: studentId },
          });

          //NOTE - if coin details already there
          if (coinDetails) {
            //NOTE - Update coin table
            await Coins.update(
              {
                games: coinDetails.games,
                coins: coinDetails.coins + correctAnswer,
              },
              {
                where: { studentId: studentId },
              }
            );
          } else if (!coinDetails) {
            //NOTE - if coin details not there
            const coinDetails = new Coins({
              studentId: studentId,
              coins: correctAnswer,
              games: 0,
            });

            await coinDetails.save();
          }

          //NOTE - Check student leader board details
          const studentLeader = await studentLeaderBoardMap.findOne({
            where: { studentId: studentId },
          });

          //NOTE - if student leader details already there
          if (studentLeader) {
            //NOTE - Update student leader table
            await studentLeaderBoardMap.update(
              {
                marks: studentLeader.marks + correctAnswer,
              },
              {
                where: { studentId: studentId },
              }
            );
          } else if (!studentLeader) {
            //NOTE - if student leader details not there create new entry
            const leaderDetails = new studentLeaderBoardMap({
              studentId: studentId,
              marks: correctAnswer,
              country: 0,
              state: 0,
              city: 0,
              school: 0,
            });

            await leaderDetails.save();
          }
        }
      }
    }

    // //NOTE - Find question details
    const questionDetail = await StudentTestMap.findOne({
      where: {
        id: id,
      },
    });

    if (type !== "quizId") {
      //NOTE - get user details
      const userDetail = await userDetails(studentId);

      //NOTE - retrive Lead
      let retriveData;
      retriveData = await retriveLeads(
        config.LEADSQUARD_API_KEY,
        config.LEADSQUARD_CLIENT_SECRET,
        config.LEADSQUARD_HOST,
        userDetail.phone
      );

      if (retriveData.length < 1) {
        //NOTE - lead capture
        await captureLead(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          userDetail.name,
          userDetail.student.course.name,
          userDetail.student.board.name,
          userDetail.student.class.name,
          userDetail.phone
        );
      }

      // //NOTE - if lead capture for user
      if (retriveData.length < 1) {
        retriveData = await retriveLeads(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          userDetail.phone
        );
      }

      //NOTE - create activity for user
      if (retriveData[0]?.ProspectID) {
        await createActivity(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          retriveData[0].ProspectID,
          studentId,
          questionDetail.testId,
          questionDetail.scholarshipId,
          questionDetail.quizId,
          questionDetail.questionId,
          answer_value,
          questionDetail.attemptCount,
          questionDetail.startDate,
          questionDetail.status,
          questionDetail.startId,
          userDetail.student.course.name,
          userDetail.student.board.name,
          userDetail.student.class.name
        );
      }

    }

    if (type === "quizId") {
      //NOTE - get user details
      const userDetail = await userDetails(studentId);

      //NOTE - retrive Lead
      let retriveData;
      retriveData = await retriveLeads(
        config.LEADSQUARD_API_KEY,
        config.LEADSQUARD_CLIENT_SECRET,
        config.LEADSQUARD_HOST,
        userDetail.phone
      );

      if (retriveData.length < 1) {
        //NOTE - lead capture
        await captureLead(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          userDetail.name,
          userDetail.student.course.name,
          userDetail.student.board.name,
          userDetail.student.class.name,
          userDetail.phone
        );
      }

      // //NOTE - if lead capture for user
      if (retriveData.length < 1) {
        retriveData = await retriveLeads(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          userDetail.phone
        );
      }
      //NOTE - create activity for user
      if (retriveData[0]?.ProspectID) {
        await createActivityForQuiz(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          retriveData[0].ProspectID,
          questionDetail.quizId,
          userDetail.name,
          questionDetail.questionId,
          answer_value,
          time,
          questionDetail.status,
          userDetail.student.course.name,
          userDetail.student.board.name,
          userDetail.student.class.name
        );
      }
    }

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.TEST_ATTEMPTED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get how many time a student attempt a test
const getTestAttemptedCount = async (req, res) => {
  try {
    const { testId, quizId } = req.query;
    const userId = req.user.id;
    let allAttemptCount = [];

    //NOTE - params based on test id or quiz id
    let params;
    if (testId) {
      params = {
        testId: testId,
        studentId: userId,
      };
    } else if (quizId) {
      params = {
        quizId: quizId,
        studentId: userId,
      };
    }

    //NOTE - check all mapping test
    const testMapping = await StudentTestAttemptMap.findAll({
      where: {
        ...params,
      },
    });

    //NOTE - Push all count
    for (const mapping of testMapping) {
      allAttemptCount.push(mapping.attemptCount);
    }

    //NOTE - get the number, of test attempted by the student
    const count = Math.max(...allAttemptCount);

    //NOTE - create attempt array dynamically
    const result = testMapping.map((item) => ({
      id: item.id,
      value: item.attemptCount,
      name: `Attempt ${item.attemptCount}`,
    }));

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - On final submit of test and assignment
const submitTest = async (req, res) => {
  try {
    const { testStartId } = req.body;
    const studentId = req.user.id;
    let checkTime;

    const checkMapping = await StudentTestAttemptMap.findOne({
      where: { id: testStartId },
    });

    if (!checkMapping) {
      checkTime = await AssignmentStartTime.findOne({
        where: {
          id: testStartId,
          studentId: studentId,
        },
      });
    }

    if (!checkMapping && !checkTime) {
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });
    }

    if (checkMapping && !checkTime) {
      //NOTE - update the status
      await StudentTestAttemptMap.update(
        {
          status: "Completed",
        },
        { where: { id: checkMapping.id } }
      );

      if (checkMapping && checkMapping.quizId !== null) {
        //NOTE - Check coin details
        const coinDetails = await Coins.findOne({
          where: { studentId: studentId },
        });

        //NOTE - Update coin table
        await Coins.update(
          {
            games: coinDetails.games + 1,
          },
          {
            where: { studentId: studentId },
          }
        );
      }
    } else if (!checkMapping && checkTime) {
      //NOTE - update the status
      await AssignmentStartTime.update(
        {
          status: "Completed",
        },
        { where: { id: checkTime.id } }
      );
    }

    if (checkMapping.testId !== null && checkMapping.testId) {
      console.log("test submit");
      //NOTE - get user details
      const userDetail = await userDetails(studentId);

      //NOTE - retrive Lead
      let retriveData;
      retriveData = await retriveLeads(
        config.LEADSQUARD_API_KEY,
        config.LEADSQUARD_CLIENT_SECRET,
        config.LEADSQUARD_HOST,
        userDetail.phone
      );

      if (retriveData.length < 1) {
        //NOTE - lead capture
        await captureLead(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          userDetail.name,
          userDetail.student.course.name,
          userDetail.student.board.name,
          userDetail.student.class.name,
          userDetail.phone
        );
      }

      // //NOTE - if lead capture for user
      if (retriveData.length < 1) {
        retriveData = await retriveLeads(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          userDetail.phone
        );
      }

      //NOTE - create activity for user Test submit
      if (retriveData[0]?.ProspectID) {
        await createActivityTest(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          retriveData[0].ProspectID,
          studentId,
          checkMapping.scholarshipId,
          checkMapping.quizId,
          checkMapping.testId,
          checkMapping.assignmentId,
          checkMapping.attemptCount,
          userDetail.student.course.name,
          userDetail.student.board.name,
          userDetail.student.class.name
        );
      }
    }

    if (checkMapping.quizId !== null && checkMapping.quizId) {
      //NOTE - get user details
      const userDetail = await userDetails(studentId);

      //NOTE - retrive Lead
      let retriveData;
      retriveData = await retriveLeads(
        config.LEADSQUARD_API_KEY,
        config.LEADSQUARD_CLIENT_SECRET,
        config.LEADSQUARD_HOST,
        userDetail.phone
      );

      if (retriveData.length < 1) {
        //NOTE - lead capture
        await captureLead(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          userDetail.name,
          userDetail.student.course.name,
          userDetail.student.board.name,
          userDetail.student.class.name,
          userDetail.phone
        );
      }

      // //NOTE - if lead capture for user
      if (retriveData.length < 1) {
        retriveData = await retriveLeads(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          userDetail.phone
        );
      }

      //NOTE - create activity for user Test submit
      if (retriveData[0]?.ProspectID) {
        await createActivityQuizCompleted(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          retriveData[0].ProspectID,
          userDetail.name,
          checkMapping.quizId,
          userDetail.student.course.name,
          userDetail.student.board.name,
          userDetail.student.class.name
        );
      }
    }

    //NOTE - final return response
    return res.status(200).send({
      status: 200,
      message: msg.ANSWER_SUBMITTED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR: get how many time a student attempt a test(use in admin panel own test report section)
const getAttemptCount = async (req, res) => {
  try {
    const { testId, userId } = req.query;
    let allAttemptCount = [];

    //NOTE - check all mapping test
    const testMapping = await StudentTestAttemptMap.findAll({
      where: {
        testId: testId,
        studentId: userId,
      },
    });

    //NOTE - Push all count
    for (const mapping of testMapping) {
      allAttemptCount.push(mapping.attemptCount);
    }

    //NOTE - get the number, of test attempted by the student
    const count = Math.max(...allAttemptCount);

    //NOTE - create attempt array dynamically
    const result = testMapping.map((item) => ({
      id: item.id,
      value: item.attemptCount,
      name: `Attempt ${item.attemptCount}`,
    }));

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

module.exports = {
  testAttempted,
  getTestAttemptedCount,
  submitTest,
  getAttemptCount, //TODO - use in admin panel own test report section
};
