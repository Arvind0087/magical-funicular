const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize, Op } = require("sequelize");
const { getSignedUrlCloudFront } = require("../../helpers/cloudFront");
const moment = require("moment");
const { graphCount, spentTimeCalculation, topicData } = require("./service");
const { createActivity } = require("./service");
const { retriveLeads } = require("../../helpers/leadsquard");
const { config } = require("../../config/db.config");
const { captureLead } = require("../users/service");
const { userDetails } = require("../../helpers/userdetails");
const recentActivityDetails = db.recentActivity;
const UserDetails = db.users;
const StudentDetails = db.student;
const Content = db.content;
const Chapter = db.chapter;
const Subject = db.subject;
const Topic = db.topic;
const StudentTestMap = db.student_test_map;
const test_student_attempt_map = db.test_student_attempt_map;
const studentSpendTimeMap = db.student_spend_time_map;
const AllQuestions = db.questionBank;
const Test = db.test;
const Bookmark = db.bookmark;
const NewContent = db.new_content;
const contentCourseMap = db.content_course_map;
const create_error = db.error;
const _ = require("lodash");

//NOTE - add user recent activity
const addRecentActivity = async (req, res) => {
  try {
    const { videoId, subjectId, time, status, topicId } = req.body;

    //NOTE - getting id from token
    const userId = req.user.id;

    //NOTE - find previous ongoing video
    const findPreviousVideo = await recentActivityDetails.findOne({
      where: {
        userId: userId,
        videoId: videoId,
        subjectId: subjectId,
        status: "ongoing",
      },
      order: [["createdAt", "DESC"]],
    });

    //NOTE - update previous video
    if (findPreviousVideo) {
      await recentActivityDetails.update(
        { videoEnd: time },
        { where: { id: findPreviousVideo.id } }
      );
    }

    //NOTE - IF STATUS COMPLETED THEN ALL VIDEO STATUS IS UPDATED
    if (status === "completed") {
      await recentActivityDetails.update(
        { status: "completed" },
        {
          where: {
            userId: userId,
            videoId: videoId,
            subjectId: subjectId,
            status: "ongoing",
          },
        }
      );
    }

    //NOTE - when status is ongoing

    //NOTE - save into database
    await recentActivityDetails.create({
      userId: userId,
      videoId: videoId,
      subjectId: subjectId,
      videoStart: time,
      videoEnd: time,
      status: status,
    });

    //---------------------  POST ACTIVITY  -------------------------- //
    //NOTE - get user details and post activity
    const userDetail = await userDetails(userId);
    const topic = await topicData(topicId);

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
    await createActivity(
      config.LEADSQUARD_API_KEY,
      config.LEADSQUARD_CLIENT_SECRET,
      config.LEADSQUARD_HOST,
      retriveData[0].ProspectID,
      userDetail.name,
      videoId,
      userDetail.student.course.name,
      userDetail.student.board.name,
      userDetail.student.class.name,
      topic.subject.name,
      topic.chapter.name,
      topic.name
    );

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.RECENT_ACTIVITY_ADDED,
    });
  } catch (err) {
    // const statusCode = err.statusCode || 500;
    // await create_error.create({
    //   status: statusCode,
    //   message: err.message,
    //   route: req.url,
    //   userId: req.user.id,
    //   stack: JSON.stringify(err.stack),
    // });
    // return res
    //   .status(200)
    //   .send({ status: 200, message: "Something Went Wrong!" });
    console.log("");
    //return res.status(500).send({ status: 500, message: err.message });
  }
};


//NOTE - get Activity  by student Id
const getActivityOfUser = async (req, res) => {
  try {
    const { type } = req.query;

    //NOTE - id from auth token
    const userId = req.user.id;

    // Get the date 6 days ago
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 6);
    // Calculate the end date (current date)
    const endDate = new Date();

    if (type === "test") {
      const testData = await test_student_attempt_map.findAll({
        where: {
          studentId: userId,
          testId: { [Sequelize.Op.ne]: null },
          createdAt: {
            [Sequelize.Op.between]: [currentDate, endDate],
          },
        },
        include: [
          {
            model: Test,
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "scholarshipId",
                "selectionProcess",
                "createdBy",
                "updatedById",
                "createdId",
              ],
            },
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      //NOTE - unique test of user
      const key = "testId";
      const uniqueArr = [
        ...new Map(testData.map((item) => [item[key], item])).values(),
      ].sort();

      let testActivity = [];

      for (let data of uniqueArr) {
        //NOTE - Check if the test attempted for not
        const attemptedTest = await StudentTestMap.findAll({
          where: { testId: data.testId },
          include: [
            {
              model: AllQuestions,
              attributes: ["answer"],
            },
          ],
        });
        let correct;
        if (attemptedTest) {
          //NOTE - previous score
          correct = attemptedTest.filter(
            (attemptedQuestion) =>
              attemptedQuestion.answer === attemptedQuestion.questionBank.answer
          ).length;
        }
        //NOTE - final push
        testActivity.push({
          id: data.testId,
          title: data?.test?.title,
          category: data?.test?.category,
          questionCount: data?.test?.numberOfQuestions,
          testTime: data?.test?.testTime,
          attempt: attemptedTest !== null ? true : false,
          score: correct || 0,
        });
      }
      //NOTE - final return response
      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: testActivity,
      });
    } else {
      const sources = {
        youtube: "youtube",
        upload: "video",
        gallerymanager: "video",
      };
      // Find recent activity within the date range
      const getActivity = await recentActivityDetails.findAll({
        where: {
          userId: userId,
          createdAt: {
            [Sequelize.Op.between]: [currentDate, endDate],
          },
        },
      });

      if (!getActivity) {
        return res.status(400).send({ status: 400, message: msg.NO_ACTIVITY });
      }

      //NOTE - unique video of user
      const key = "videoId";
      const uniqueArr = [
        ...new Map(getActivity.map((item) => [item[key], item])).values(),
      ].sort();

      let activity = [];
      for (let data of uniqueArr) {
        const allContents = await Content.findOne({
          where: { id: data.videoId },
          include: [
            {
              model: Subject,
              attributes: ["id", "name"],
            },
            {
              model: Chapter,
              attributes: ["id", "name"],
            },
            {
              model: Topic,
              attributes: ["id", "name"],
            },
          ],
          order: [["createdAt", "DESC"]],
        });
        //NOTE - convert thumbnail into cloud front url
        const thumbnails = await getSignedUrlCloudFront(
          allContents?.thumbnailFile
        );
        //NOTE - get bookmark of video
        const getBookmark = await Bookmark.findOne({
          where: { bookmarkType: "video", typeId: data.videoId },
        });
        activity.push({
          //id: data.id,
          id: allContents?.topic?.id,
          name: allContents?.topic?.name,
          videoId: data?.videoId,
          tag: allContents?.tag,
          thumbnail: thumbnails,
          subjectId: allContents?.subject?.id,
          subject: allContents?.subject?.name,
          chapterId: allContents?.chapter?.id,
          chapterName: allContents?.chapter?.name,
          bookmark: getBookmark?.bookmark === true ? true : false,
          lastActivity: data?.updatedAt,
        });
      }

      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: activity,
      });
    }
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE - all activity of user calculation
const getActivityOfUserCalculation = async (req, res) => {
  try {
    //NOTE _ getting id from user
    const userId = req.user.id;

    //NOTE - CHECKING USER
    const user_details = await UserDetails.findOne({
      where: { id: userId, type: "Student" },
    });
    if (!user_details)
      return res.status(400).send({ status: 200, message: msg.USER_NOT_FOUND });

    //NOTE - Get user Details from student table
    const student_details = await StudentDetails.findOne({
      where: { id: user_details.typeId },
    });

    //NOTE - get all topic count of user subjects
    const TopicCount = await Topic.findAndCountAll({
      where: {
        courseId: student_details.courseId,
        boardId: student_details.boardId,
        classId: student_details.classId,
        batchTypeId: student_details.batchTypeId,
      },
    });
    //NOTE - GRAPH DATA OF USER
    const finalMonth = await graphCount(userId);

    // -------------------------- latest activity of user 7 days -----------------------//
    // Get the date 6 days ago
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 6);
    // Calculate the end date (current date)
    const endDate = new Date();

    // Find recent activity within the date range
    const getActivitys = await recentActivityDetails.findAll({
      where: {
        userId: userId,
        createdAt: {
          [Sequelize.Op.between]: [currentDate, endDate],
        },
      },
      attributes: ["videoEnd", "videoStart", "videoId"],
    });


    let getActivityss = [];
    for (let data of getActivitys) {
      const array = await contentCourseMap.findOne({
        where: {
          contentId: data.videoId,
          courseId: student_details.courseId,
          boardId: student_details.boardId,
          classId: student_details.classId,
          batchTypeId: student_details.batchTypeId,
        },
        include: [
          {
            model: NewContent,
            attributes: ["thumbnailFile"],
          },
          { model: Subject, attributes: ["id", "name"] },
          { model: Chapter, attributes: ["id", "name"] },
          { model: Topic, attributes: ["id", "name"] },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (array?.chapter?.id !== undefined) {
        getActivityss.push(data)
      }
    }

    //NOTE - UNIQUE LEARN COUNT
    const uniqueLearnCount = _.uniqBy(getActivityss, "videoId");


    //NOTE - calculating weekly spent time
    const users = await studentSpendTimeMap.findAll({
      where: {
        studentId: userId,
        createdAt: {
          [Sequelize.Op.between]: [currentDate, endDate],
        },
      },
      attributes: ["status", "createdAt"],
    });

    //NOTE - calculate total spent time
    const WeeklyLearning = await spentTimeCalculation(users);

    //NOTE - total learnig by user and calculation of learning topic
    const getActivitysAll = await recentActivityDetails.findAll({
      where: {
        userId: userId,
      },
      attributes: ["videoId"],
      include: {
        model: contentCourseMap,
        where: {
          courseId: student_details.courseId,
          boardId: student_details.boardId,
          classId: student_details.classId,
          batchTypeId: student_details.batchTypeId,
        },
        attributes: ["contentId", "subjectId", "topicId"],
      },
    });

    //NOTE - unique by topic id
    const uniqueLearnTopic = _.values(
      _.reduce(
        getActivitysAll,
        (accumulator, activity) => {
          const entryKey = `${activity.videoId}_${activity.content_course_map.topicId}`;
          if (!accumulator[entryKey]) {
            accumulator[entryKey] = activity;
          }
          return accumulator;
        },
        {}
      )
    );

    //NOTE - total test count of one week
    const testData = await test_student_attempt_map.findAll({
      where: {
        studentId: userId,
        testId: { [Sequelize.Op.ne]: null },
        createdAt: {
          [Sequelize.Op.between]: [currentDate, endDate],
        },
      },
      order: [["createdAt", "DESC"]],
    });

    //NOTE - unique test of user
    const key = "testId";
    const testCount = [
      ...new Map(testData.map((item) => [item[key], item])).values(),
    ].sort();

    //NOTE - GET ONLY 10 DATA FROM RECENT ACTIVITY
    const limitActivity = await recentActivityDetails.findAll({
      where: {
        userId: userId,
        createdAt: {
          [Sequelize.Op.between]: [currentDate, endDate],
        },
        //...val,
      },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    //NOTE - return final data
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: {
        totalTopic: TopicCount.count,
        learnedTopic: uniqueLearnTopic.length || 0,
        learnActivity: uniqueLearnCount?.length || 0,
        totalTest: testCount.length || 0,
        learningTime: finalMonth?.totalTime || 0,
        weeklyTimeSpent: WeeklyLearning < 0 ? 0 : WeeklyLearning,
        graph: finalMonth?.monthdata,
      },
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE - add user time spent
const addUserSpendTime = async (req, res) => {
  try {
    const { status } = req.body;
    //NOTE - getting id from token
    const studentId = req.user.id;
    //NOTE - save into database
    await studentSpendTimeMap.create({
      studentId: studentId,
      status: status,
    });

    //NOTE - final return
    return res.status(200).send({
      status: 200,
      message: msg.USER_TIME_SPEND_ADDED,
    });
  } catch (err) {
    return res.status(200).send({ status: 200, message: err.message });
  }
};

const getUserSpendTime = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get the date 6 days ago
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 6);
    // Calculate the end date (current date)
    const endDate = new Date();

    const users = await studentSpendTimeMap.findAll({
      where: {
        studentId: studentId,
        createdAt: {
          [Sequelize.Op.between]: [currentDate, endDate],
        },
      },
      attributes: ["createdAt", "status"],
    });

    //NOTE - calculate total spent time
    const spentTime = await spentTimeCalculation(users);

    //NOTE - fianl return
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      spenttime: spentTime,
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    await create_error.create({
      status: statusCode,
      message: err.message,
      route: req.url,
      userId: 1,
      stack: JSON.stringify(err.stack),
    });
    return res
      .status(500)
      .send({ status: 500, message: "Something Went Wrong!" });
    //return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE - get Activity  by student Id
const getActivityOfUserNew = async (req, res) => {
  try {
    const { type } = req.query;

    //NOTE - id from auth token
    const userId = req.user.id;

    // Get the date 6 days ago
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 6);
    // Calculate the end date (current date)
    const endDate = new Date();


    //NOTE - find user details
    const user_details = await UserDetails.findOne({
      where: { id: userId, type: "Student" },
      include: {
        model: StudentDetails,
        attributes: ["courseId", "boardId", "classId", "batchTypeId"],
      },
    });

    if (type === "test") {
      const testData = await test_student_attempt_map.findAll({
        where: {
          studentId: userId,
          testId: { [Sequelize.Op.ne]: null },
          createdAt: {
            [Sequelize.Op.between]: [currentDate, endDate],
          },
        },
        include: [
          {
            model: Test,
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "scholarshipId",
                "selectionProcess",
                "createdBy",
                "updatedById",
                "createdId",
              ],
            },
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      //NOTE - unique test of user
      const key = "testId";
      const uniqueArr = [
        ...new Map(testData.map((item) => [item[key], item])).values(),
      ].sort();

      let testActivity = [];

      for (let data of uniqueArr) {
        //NOTE - Check if the test attempted for not
        const attemptedTest = await StudentTestMap.findAll({
          where: { testId: data.testId },
          include: [
            {
              model: AllQuestions,
              attributes: ["answer"],
            },
          ],
        });
        let correct;
        if (attemptedTest) {
          //NOTE - previous score
          correct = attemptedTest.filter(
            (attemptedQuestion) =>
              attemptedQuestion.answer === attemptedQuestion.questionBank.answer
          ).length;
        }
        //NOTE - final push
        testActivity.push({
          id: data.testId,
          title: data?.test?.title,
          category: data?.test?.category,
          questionCount: data?.test?.numberOfQuestions,
          testTime: data?.test?.testTime,
          attempt: attemptedTest !== null ? true : false,
          score: correct || 0,
        });
      }
      //NOTE - final return response
      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: testActivity,
      });
    } else {
      // Find recent activity within the date range
      const getActivity = await recentActivityDetails.findAll({
        where: {
          userId: userId,
          createdAt: {
            [Sequelize.Op.between]: [currentDate, endDate],
          },
        },
        attributes: [
          "videoId",
          [Sequelize.fn("MAX", Sequelize.col("createdAt")), "createdAt"],
          [Sequelize.fn("MAX", Sequelize.col("id")), "id"],
          [Sequelize.fn("MAX", Sequelize.col("videoStart")), "videoStart"],
          [Sequelize.fn("MAX", Sequelize.col("videoEnd")), "videoEnd"],
          [Sequelize.fn("MAX", Sequelize.col("userId")), "userId"],
          [Sequelize.fn("MAX", Sequelize.col("subjectId")), "subjectId"],
          [Sequelize.fn("MAX", Sequelize.col("videoId")), "videoId"],
          [Sequelize.fn("MAX", Sequelize.col("updatedAt")), "updatedAt"],
        ],
        group: ["videoId", "subjectId"],
      });

      if (!getActivity) {
        return res.status(400).send({ status: 400, message: msg.NO_ACTIVITY });
      }

      let activity = [];
      for (let data of getActivity) {
        //NOTE - get all content
        const allContents = await contentCourseMap.findOne({
          where: {
            contentId: data.videoId, courseId: user_details.student?.courseId,
            boardId: user_details.student?.boardId,
            classId: user_details.student?.classId,
            batchTypeId: user_details.student?.batchTypeId,
          },
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: NewContent,
              attributes: [
                "id",
                "source",
                "sourceFile",
                "thumbnailFile",
                "resourceType",
                "tag",
              ],
            },
            {
              model: Subject,
              attributes: ["id", "name"],
            },
            {
              model: Chapter,
              attributes: ["id", "name"],
            },
            {
              model: Topic,
              attributes: ["id", "name"],
            },
          ],
        });


        if (allContents?.chapter?.id !== undefined) {
          //NOTE - get bookmark of video
          const getBookmark = await Bookmark.findOne({
            where: { bookmarkType: "video", typeId: data.videoId },
          });
          activity.push({
            id: allContents?.topic?.id,
            name: allContents?.topic?.name,
            videoId: data?.videoId,
            tag: allContents?.new_content?.tag,
            thumbnail: allContents?.new_content?.thumbnailFile
              ? await getSignedUrlCloudFront(
                allContents?.new_content?.thumbnailFile
              )
              : null,
            subjectId: allContents?.subject?.id,
            subject: allContents?.subject?.name,
            chapterId: allContents?.chapter?.id,
            chapterName: allContents?.chapter?.name,
            bookmark: getBookmark?.bookmark === true ? true : false,
            lastActivity: data?.updatedAt,
          });
        }

      }

      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: activity,
      });
    }
  } catch (err) {
    const statusCode = err.statusCode || 500;
    await create_error.create({
      status: statusCode,
      message: err.message,
      route: req.url,
      userId: 1,
      stack: JSON.stringify(err.stack),
    });
    return res
      .status(500)
      .send({ status: 500, message: "Something Went Wrong!" });
    //return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  addRecentActivity,
  getActivityOfUser,
  getActivityOfUserCalculation,
  addUserSpendTime,
  getUserSpendTime,
  getActivityOfUserNew,
};
