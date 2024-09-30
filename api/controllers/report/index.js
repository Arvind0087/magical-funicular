const { Sequelize, Op } = require("sequelize");
const db = require("../../models/index");
const msg = require("../../constants/Messages");
const UserDetails = db.users;
const StudentDetails = db.student;
const Class = db.class;
const BatchType = db.batchTypes;
const StudentTestAttemptMap = db.test_student_attempt_map;
const TestDetails = db.test;
const StudentTestMap = db.student_test_map;
const QuestionBank = db.questionBank;
const studentAttendance = db.event_student_attendance;
const TeacherSubjectMap = db.teacher_subject_map;
const State = db.state;
const City = db.city;
const Test = db.test;
const TestSubjectMap = db.test_subject_map;
const RecentActivities = db.recentActivity;
const liveclassReport = db.liveclass_report;
const batchType = db.batchTypes;
const Boards = db.boards;
const Course = db.courses;

//NOTE - student gender data
const getUserGenderData = async (req, res) => {
  try {
    let params;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const staffDetails = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: ["classId", "batchTypeId"],
        });

        //NOTE - push all user class Ids for
        const classIds = staffDetails.map((item) => item.classId);

        params = { classId: { [Sequelize.Op.in]: classIds } };
      }
    const student_counts = await StudentDetails.findAll({
      attributes: [
        [Sequelize.literal(`COALESCE(NULLIF(gender, ''), 'Other')`), "gender"],
        [Sequelize.literal(`COUNT(*)`), "count"],
        [
          Sequelize.literal(`ROUND(100 * COUNT(*) / SUM(COUNT(*)) OVER (), 1)`),
          "percentage",
        ],
      ],
      where: {
        ...params,
        [Sequelize.Op.or]: [
          { gender: { [Sequelize.Op.in]: ["Male", "Female", "Other"] } },
          { gender: null },
        ],
      },
      group: [[Sequelize.literal(`COALESCE(NULLIF(gender, ''), 'Other')`)]],
    });

    // Check if student_counts is empty
    if (!student_counts || student_counts.length === 0) {
      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        title: "By Gender",
        data: [],
      });
    }
    //NOTE - tofixed percent value
    const formatted_counts = student_counts.map((count) => {
      return {
        label: count.gender,
        value: Number(count.dataValues.count),
      };
    });
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      title: "By Gender",
      data: formatted_counts,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : batchType basese data
const studentDataByBatchTypeReport = async (req, res) => {
  try {
    const { courseId, boardId } = req.query;

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const staffDetails = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: ["classId", "batchTypeId"],
        });

        //NOTE - push all user class Ids for
        const classesIds = staffDetails.map((item) => item.classId);

        // //NOTE - push all batch ids
        // const batchIds = staffDetails.map((item) => item.batchTypeId);

        //NOTE - params based on class or batch type
        // params = batchIds.every((id) => id === null)
        //   ? { classId: { [Sequelize.Op.in]: classesIds } }
        //   : { id: { [Sequelize.Op.in]: batchIds } };

        params = { classId: { [Sequelize.Op.in]: classesIds } };
      }

    //NOTE - get all batch details
    const classDetails = await BatchType.findAll({
      where: params,
      attributes: {
        exclude: ["createdById", "updatedById", "createdAt", "updatedAt"],
      },
      include: {
        model: Class,
        attributes: ["id", "name", "courseId", "boardId"],
        where: { courseId: courseId, boardId: boardId },
      },
    });

    //NOTE - push final data
    const response = await Promise.all(
      classDetails.map(async (data) => {
        //NOTE - count of users
        const studentsCount = await StudentDetails.count({
          where: {
            courseId: data.courseId,
            boardId: data.boardId,
            classId: data.class.id,
            batchTypeId: data.id,
          },
        });

        return {
          courseId: data.courseId,
          boardId: data.boardId,
          batchName: data.name,
          className: data.class.name,
          studentsCount: studentsCount,
        };
      })
    );

    //NOTE - final return
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: response,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

const getStudentTestReport = async (req, res) => {
  try {
    //NOTE - get student details
    const userDetails = await UserDetails.findOne({
      where: { id: req.params.id }, //TODO: get user id from params
    });

    if (!userDetails)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    //NOTE - get all test , which attempted by student
    const attemptedTest = await StudentTestAttemptMap.findAll({
      where: {
        studentId: userDetails.id,
        status: "Completed",
        testId: {
          [Op.not]: null,
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },

      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    //NOTE - get all test details , which attempted by student
    const testDetails = await StudentTestMap.findAll({
      where: {
        startId: attemptedTest.map((ele) => ele.id),
      },
      attributes: ["id", "startId", "testId", "answer", "attemptCount"],
      include: [
        {
          model: TestDetails,
          attributes: ["title"],
        },
        {
          model: QuestionBank,
          attributes: ["id", "answer"],
        },
      ],
    });
    const uniqueData = [];
    const attemptedQuestions = new Set();

    for (const data of testDetails) {
      if (!attemptedQuestions.has(data.startId)) {
        attemptedQuestions.add(data.startId);
        //NOTE: Create an object to store the calculations
        const result = {
          id: data.startId,
          testId: data.testId,
          title: data.test?.title,
          correct: 0,
          wrongAnswer: 0,
          unAttemptedAnswer: 0,
        };

        uniqueData.push(result);
      }

      const result = uniqueData.find((item) => item.id === data.startId);

      //NOTE: Perform the calculations based on the conditions
      if (result)
        if (data.answer === data.questionBank.answer) {
          result.correct += 1; //TODO - if correct answer
        } else if (["A", "B", "C", "D"].includes(data.answer)) {
          result.wrongAnswer += 1; //TODO - if wrong answer
        } else if ([""].includes(data.answer)) {
          result.unAttemptedAnswer += 1; //TODO - if question not attempted
        }
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: uniqueData,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : student Attandence Report
const studentAttandenceReport = async (req, res) => {
  try {
    const { courseId, boardId, classId, year, month } = req.query;

    const final = {};

    //NOTE - course filter
    if (courseId) {
      final.courseId = courseId;
    }

    //NOTE - board filter
    if (boardId) {
      final.boardId = boardId;
    }

    //NOTE - class filter
    if (classId) {
      final.classId = classId;
    }

    let params;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const staffDetails = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: ["classId", "batchTypeId"],
        });

        //NOTE - push all user class Ids for
        const classesIds = staffDetails.map((item) => item.classId);

        //NOTE - push all batch ids
        // const batchIds = staffDetails.map((item) => item.batchTypeId);

        //NOTE - params based on class or batch type
        // const idParams = batchIds.every((id) => id === null)
        //   ? { classId: { [Sequelize.Op.in]: classesIds } }
        //   : { batchTypeId: { [Sequelize.Op.in]: batchIds } };

        const idParams = { classId: { [Sequelize.Op.in]: classesIds } };

        //NOTE - find student data based on the batchType
        const students = await StudentDetails.findAll({
          where: {
            ...idParams,
          },
        });

        //NOTE - push all user type ids for student ids
        const type_id = students.map((item) => item.dataValues.id);

        //NOTE - send typeIds based on the batch type id
        params = {
          id: {
            [Sequelize.Op.in]: type_id,
          },
        };
      }

    //NOTE - get all student based on filter
    const userDetails = await UserDetails.findAll({
      attributes: ["id", "name"],
      include: {
        model: StudentDetails,
        attributes: ["id", "courseId", "boardId", "classId", "batchTypeId"],
        where: { ...final, ...params },
      },
    });
    let attandence = [];
    for (let data of userDetails) {
      //NOTE - count user all attandence
      const studentAttendancDetails = await studentAttendance.count({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        where: {
          studentId: data.id,
          ...(year && month
            ? {
                [Op.and]: [
                  Sequelize.where(
                    Sequelize.fn("YEAR", Sequelize.col("createdAt")),
                    year
                  ),
                  Sequelize.where(
                    Sequelize.fn("MONTH", Sequelize.col("createdAt")),
                    month
                  ),
                ],
              }
            : year
            ? {
                [Op.and]: [
                  Sequelize.where(
                    Sequelize.fn("YEAR", Sequelize.col("createdAt")),
                    year
                  ),
                ],
              }
            : {}),
        },
      });

      //NOTE - final push
      attandence.push({
        studentName: data.name,
        attandenceCount:
          studentAttendancDetails === null ? 0 : studentAttendancDetails,
      });
    }

    //NOTE - final return
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: attandence,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE - student Subscription data
const getUserSubscriptionDetails = async (req, res) => {
  try {
    let params;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const staffDetails = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: ["classId", "batchTypeId"],
        });

        //NOTE - push all user class Ids for
        const classIds = staffDetails.map((item) => item.classId);

        params = { classId: { [Sequelize.Op.in]: classIds } };
      }

    //NOTE - get all subscriptionType of the user
    const student_counts = await UserDetails.findAll({
      attributes: [
        [
          Sequelize.literal(`COALESCE(NULLIF(subscriptionType, ''))`),
          "subscriptionType",
        ],
        [Sequelize.literal(`COUNT(*)`), "count"],
        [
          Sequelize.literal(`ROUND(100 * COUNT(*) / SUM(COUNT(*)) OVER (), 1)`),
          "percentage",
        ],
      ],
      where: {
        ...params,
        type: "Student",
        subscriptionType: {
          [Sequelize.Op.in]: ["Free", "Premium"],
        },
      },
      group: [[Sequelize.literal(`COALESCE(NULLIF(subscriptionType, ''))`)]],
    });

    //NOTE : Check if student_counts is empty
    if (!student_counts || student_counts.length === 0) {
      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: [],
      });
    }
    //NOTE - tofixed percent value
    const formatted_counts = student_counts.map((count) => {
      return {
        label: count.subscriptionType,
        value: Number(count.dataValues.count),
      };
    });
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: formatted_counts,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE - student registered data
const userRegistered = async (req, res) => {
  try {
    const { stateId, cityId } = req.body;

    //NOTE - First scenario: stateId and cityId are not provided
    if (
      stateId.length === 0 &&
      ((cityId && cityId.length === 0) || cityId === undefined)
    ) {
      const student_counts = await StudentDetails.findAll({
        attributes: [
          [Sequelize.fn("COUNT", Sequelize.col("stateId")), "count"],
          [Sequelize.literal("COUNT(*)"), "count"],
        ],
        include: [{ model: State, attributes: ["name"] }],
        group: ["stateId"],
        raw: true,
      });
      //NOTE - formate all data
      const formatted_counts = student_counts.map((record) => ({
        label: record["state.name"] === null ? "Other" : record["state.name"],
        value: record.count,
      }));

      //NOTE - final response
      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: formatted_counts,
      });
    }

    //NOTE - Second scenario: only stateId is provided
    if (stateId.length > 0 && cityId.length < 1) {
      const student_counts = await StudentDetails.findAll({
        attributes: [
          "stateId",
          "cityId",
          [Sequelize.fn("IFNULL", Sequelize.col("cityId"), "null"), "cityId"],
          [Sequelize.fn("COUNT", Sequelize.col("cityId")), "count"],
        ],
        where: {
          [Sequelize.Op.or]: [
            {
              stateId: {
                [Sequelize.Op.in]: stateId,
              },
              cityId: {
                [Sequelize.Op.not]: null,
              },
            },
          ],
        },
        include: [{ model: City, attributes: ["name"] }],
        group: ["stateId", "cityId"],
        raw: true,
      });

      //NOTE : Find the count of records with null cityId
      const nullCityCount = await StudentDetails.count({
        where: {
          stateId: {
            [Sequelize.Op.in]: stateId,
          },
          cityId: null,
        },
      });

      student_counts.push({
        cityId: null,
        count: nullCityCount,
      });

      //NOTE - formate all data
      const formatted_counts = student_counts.map((record) => ({
        label: record["cityId"] === null ? "Other" : record["city.name"],
        value: record.count,
      }));

      //NOTE: Final response
      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: formatted_counts,
      });
    }

    //NOTE - Third scenario: both stateId and cityId are provided
    if (stateId.length > 0 && cityId.length > 0) {
      let state = [];
      let formatted_counts = [];

      //NOTE - state based on city
      for (let city of cityId) {
        const citys = await City.findOne({
          attributes: ["stateId"],
          where: { id: city },
        });

        //NOTE - find those state and city is given
        const student = await StudentDetails.findAll({
          attributes: [
            "stateId",
            "cityId",
            [Sequelize.fn("COUNT", Sequelize.col("cityId")), "count"],
          ],
          where: { stateId: citys.stateId, cityId: city },
          include: [{ model: City, attributes: ["name"] }],
          group: ["stateId", "cityId"],
          raw: true,
        });

        for (let data of student) {
          //NOTE -final push
          formatted_counts.push({
            label: data["city.name"],
            value: data["count"],
          });
        }
      }
      //NOTE - final response return
      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: formatted_counts,
      });
    }
    //NOTE - if no case matches
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: [],
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE - live class report
const liveClassReport = async (req, res) => {
  try {
    const { course, board, batch, fromDate, toDate } = req.body;

    //NOTE - when fromDate or toDate not come into filter
    if (!fromDate || !toDate) {
      return res.status(400).send({
        status: 400,
        message: msg.DATE_RANGE_REQUIRED,
      });
    }

    //NOTE - course,board,batch filter
    let params;
    if (course && !board) {
      params = {
        courseId: course,
      };
    } else if (course && board && !batch) {
      params = {
        courseId: course,
        boardId: board,
      };
    } else if (course && board && batch) {
      const getBatch = await batchType.findOne({
        where: { id: batch },
      });
      params = {
        courseId: course,
        boardId: board,
        classId: getBatch.classId,
        batchTypeId: batch,
      };
    } else {
      params = undefined;
    }

    //NOTE - date range filter
    let dates;
    if (fromDate && toDate) {
      dates = {
        date: {
          [Sequelize.Op.gte]: new Date(fromDate).setHours(0, 0, 0, 0),
          [Sequelize.Op.lte]: new Date(toDate).setHours(23, 59, 59, 999),
        },
      };
    }

    // Count the number of reports based on classId
    const reportCount = await liveclassReport.findAll({
      attributes: [
        "classId",
        "batchTypeId",
        [Sequelize.fn("COUNT", Sequelize.col("classId")), "count"],
      ],
      where: {
        ...params,
        ...dates,
      },
      include: { model: Class, attributes: ["name"] },
      group: ["classId", "batchTypeId"],
      raw: true,
    });

    //NOTE - formated all data
    let final = [];
    for (let data of reportCount) {
      const batchs = await batchType.findOne({
        where: { id: data.batchTypeId },
        include: [
          { model: Course, attributes: ["name"] },
          { model: Boards, attributes: ["name"] },
          { model: Class, attributes: ["name"] },
        ],
      });
      //NOTE - final push
      final.push({
        label: `${batchs?.course?.name} ${batchs?.board?.name} ${batchs?.class?.name} ${batchs?.name}`,
        value: data.count,
      });
    }
    //NOTE - return response
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: final,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - test And Learning Content Report
const testAndLearningContentReport = async (req, res) => {
  try {
    const {
      type,
      category,
      stateId,
      cityId,
      courseId,
      boardId,
      batchTypeId,
      subjectId,
    } = req.body;

    //NOTE - if type as learning Content
    if (type === "learningContent" || type === "test") {
      if (!["gender", "state", "city"].includes(category)) {
        //NOTE - if no case matches
        return res.status(400).send({
          status: 400,
          message: msg.REPORT_CATEGORY_NOT_VALID,
        });
      }

      let student_data;
      let formattedData;
      let counts;

      if (category === "gender") {
        //NOTE : Get student details by gender
        student_data = await UserDetails.findAll({
          attributes: ["id"],
          include: {
            model: StudentDetails,
            attributes: ["gender"],
            where: {
              courseId,
              ...(boardId && { boardId }),
              ...(batchTypeId && { batchTypeId }),
              [Sequelize.Op.or]: [
                { gender: { [Sequelize.Op.in]: ["Male", "Female", "Other"] } },
                { gender: null },
              ],
            },
          },
          raw: true,
        });

        //NOTE : Format the ids based on the gender
        formattedData = student_data.reduce(
          (result, { id, "student.gender": gender }) => {
            const existingItem = result.find(
              (item) => item.gender === (gender || "Other")
            );
            if (existingItem) {
              existingItem.ids.push(id);
            } else {
              result.push({ gender: gender || "Other", ids: [id] });
            }
            return result;
          },
          []
        );
      } else if (category === "state" || category === "city") {
        //NOTE - if category is coming as city but city ids ar not come
        if (category === "city" && (cityId === undefined || cityId.length < 1))
          //NOTE: Final response
          return res.status(400).send({
            status: 400,
            message: msg.REPORT_CATEGORY_CITY_NOT_VALID,
          });

        //NOTE - Get student details by state and city
        student_data = await UserDetails.findAll({
          attributes: ["id"],
          include: {
            model: StudentDetails,
            attributes: ["stateId", "cityId"],
            where: {
              courseId,
              ...(boardId && { boardId }),
              ...(batchTypeId && { batchTypeId }),
              ...(stateId && { stateId: { [Sequelize.Op.in]: stateId } }),
              ...(cityId && { cityId: { [Sequelize.Op.in]: cityId } }),
            },
            include: [
              {
                model: City,
                attributes: ["name"],
                include: {
                  model: State,
                  attributes: ["name"],
                },
              },
            ],
          },
          raw: true,
        });

        //NOTE - createing label based on the condition
        const stateField = stateId
          ? "student.city.name"
          : "student.city.state.name";

        //NOTE - Format the ids based on the state and city
        formattedData = student_data.reduce(
          (result, { id, [stateField]: state }) => {
            const existingItem = result.find(
              (item) => item.state === (state || "Other")
            );
            if (existingItem) {
              existingItem.ids.push(id);
            } else {
              result.push({ state: state || "Other", ids: [id] });
            }
            return result;
          },
          []
        );
      }
      //NOTE - Get the videos count from RecentActivities table
      if (type === "learningContent") {
        counts = await Promise.all(
          formattedData.map(async ({ gender, state, ids }) => {
            const count = await RecentActivities.count({
              where: {
                userId: { [Sequelize.Op.in]: ids },
                ...(subjectId && { subjectId }),
              },
            });
            return {
              label: category === "gender" ? gender : state,
              value: count,
            };
          })
        );
      } else {
        if (subjectId) {
          //NOTE: get mapping subject details from mapping table
          const testDetails = await TestSubjectMap.findAll({
            where: { subjectId },
            attributes: ["testId"],
            include: {
              model: Test,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            group: ["test_subject_map.id", "test.id"],
            tableName: "test_subject_map",
          });

          const testIds = testDetails.map((item) => item.testId);

          //NOTE - Get the test count from Student Test Attempt table
          counts = await Promise.all(
            formattedData.map(async ({ gender, state, ids }) => {
              const count = await StudentTestAttemptMap.findAll({
                attributes: [
                  [Sequelize.fn("SUM", Sequelize.col("attemptCount")), "count"],
                ],
                where: {
                  testId: { [Sequelize.Op.in]: testIds },
                  studentId: { [Sequelize.Op.in]: ids },
                },
                include: {
                  model: Test,
                  where: {
                    category: { [Op.notIn]: ["Own Tests", "Scholarship Test"] },
                  },
                  attributes: [],
                },
                raw: true,
                group: ["studentId"],
              });

              const totalCount = count.reduce(
                (sum, { count }) => sum + parseInt(count || 0, 10),
                0
              );

              return {
                label: category === "gender" ? gender : state,
                value: totalCount,
              };
            })
          );
        } else {
          //NOTE - Get the test count from Student Test Attempt table
          counts = await Promise.all(
            formattedData.map(async ({ gender, state, ids }) => {
              const count = await StudentTestAttemptMap.findAll({
                attributes: [
                  [Sequelize.fn("SUM", Sequelize.col("attemptCount")), "count"],
                ],
                where: {
                  testId: { [Op.not]: null },
                  studentId: { [Sequelize.Op.in]: ids },
                },
                include: {
                  model: Test,
                  where: {
                    category: { [Op.notIn]: ["Own Tests", "Scholarship Test"] },
                  },
                  attributes: [],
                },
                raw: true,
                group: ["studentId"],
              });

              const totalCount = count.reduce(
                (sum, { count }) => sum + parseInt(count || 0, 10),
                0
              );

              return {
                label: category === "gender" ? gender : state,
                value: totalCount,
              };
            })
          );
        }
      }

      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: counts,
      });
    } else {
      //NOTE - if type not matches
      return res.status(400).send({
        status: 400,
        message: msg.REPORT_TYPE_NOT_VALID,
      });
    }
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  getUserGenderData,
  studentDataByBatchTypeReport,
  getStudentTestReport,
  studentAttandenceReport,
  getUserSubscriptionDetails,
  userRegistered,
  liveClassReport,
  testAndLearningContentReport,
};
