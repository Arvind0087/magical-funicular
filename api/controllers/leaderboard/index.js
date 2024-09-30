const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { generateAttemptArray } = require("../../helpers/service");
const { addTime, dividTime } = require("../assignments/service");
const { rankingOfUser } = require("./service");
const { Sequelize, Op } = require("sequelize");
const StudentTestMap = db.student_test_map;
const QuizAnswerMap = db.quiz_test_answer_map;
const QuestionBank = db.questionBank;
const Coins = db.coins;
const AssignmentData = db.assignment;
const AssignmentStartTime = db.assignment_startTime_map;
const AssignmentAnswer = db.assignment_answer_map;
const AssignmentStudent = db.assignment_student_map;
const studentLeaderBoardMap = db.student_leaderboard_map;
const UserDetails = db.users;
const StudentDetails = db.student;
const AllCourses = db.courses;
const Boards = db.boards;
const Class = db.class;
const batchType = db.batchTypes;
const BatchStartDate = db.batchDate;
const StateDetails = db.state;
const CityDetails = db.city;
const timeCronMap = db.time_cron_map;
const cron = require("node-cron");

//ANCHOR : user leader board
const getUserLeaderBoard = async (req, res) => {
  try {
    //NOTE - id from token
    const token = req.user.id;

    //NOTE - Check student leader board details
    const studentLeader = await studentLeaderBoardMap.findOne({
      where: { studentId: token },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    //NOTE - FINAL OBJECT CREATE
    let final = {
      country: studentLeader ? studentLeader.country : 0,
      state: studentLeader ? studentLeader.state : 0,
      city: studentLeader ? studentLeader.city : 0,
      school: studentLeader ? studentLeader.school : 0,
    };

    //NOTE - FINAL RETURN
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: final,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - DEMO UPDATE LEADER Board
const DemoLeaderboard = async (req, res) => {
  try {
    let studentList = [];
    //NOTE - leader board
    const studentLeader = await studentLeaderBoardMap.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    //NOTE - student leader board all data
    for (let data of studentLeader) {
      const user_details = await UserDetails.findOne({
        where: {
          id: data.studentId,
          type: "Student",
        },
        attributes: ["typeId", "id"],

        include: [
          {
            model: StudentDetails,
            attributes: ["countryId", "stateId", "cityId", "schoolName", "id"],
          },
        ],
      });

      if (user_details !== null && user_details !== undefined) {
        studentList.push({
          id: user_details?.id,
          school: user_details?.student?.schoolName,
          city: user_details?.student?.cityId,
          state: user_details?.student?.stateId,
          country: user_details?.student?.countryId,
          marks: data.marks,
        });
      }
    }

    //NOTE - Group students by school name
    const groupedStudents = studentList.reduce((acc, student) => {
      const { school, marks, ...rest } = student;
      if (school) {
        acc[school] = acc[school] || { school, students: [] };
        acc[school].students.push({ marks, ...rest });
      }
      return acc;
    }, {});

    //NOTE - Generate desired output
    const schoolFinal = Object.keys(groupedStudents).reduce(
      (acc, schoolName) => {
        const students = groupedStudents[schoolName].students
          .sort((a, b) => b.marks - a.marks)
          .map((student, index) => ({
            ...student,
            schoolRank: student.marks !== 0 ? index + 1 : "N/A",
          }));
        acc.push(
          ...students.map((student) => ({ school: schoolName, ...student }))
        );
        return acc;
      },
      []
    );

    for (let schoolUpdate of schoolFinal) {
      //NOTE - Check student leader board details AND UPDATE LEADER BOARD DATA
      await studentLeaderBoardMap.update(
        { school: schoolUpdate.schoolRank },
        { where: { studentId: schoolUpdate.id } }
      );
    }

    //NOTE - Group students by city name
    const groupedStudentsCity = studentList.reduce((acc, student) => {
      const { city, marks, ...rest } = student;
      if (city) {
        acc[city] = acc[city] || { city, students: [] };
        acc[city].students.push({ marks, ...rest });
      }
      return acc;
    }, {});

    //NOTE - Generate desired output
    const cityFinal = Object.keys(groupedStudentsCity).reduce((acc, city) => {
      const students = groupedStudentsCity[city].students
        .sort((a, b) => b.marks - a.marks)
        .map((student, index) => ({
          ...student,
          cityRank: student.marks !== 0 ? index + 1 : "N/A",
        }));
      acc.push(...students.map((student) => ({ city: city, ...student })));
      return acc;
    }, []);

    //NOTE - update city rank
    for (let cityUpdate of cityFinal) {
      //NOTE - Check student leader board details AND UPDATE LEADER BOARD DATA city
      await studentLeaderBoardMap.update(
        { city: cityUpdate.cityRank },
        { where: { studentId: cityUpdate.id } }
      );
    }

    //NOTE - Group students by state name
    const groupedStudentsStateWise = studentList.reduce((acc, student) => {
      const { state, marks, ...rest } = student;
      if (state) {
        acc[state] = acc[state] || { state, students: [] };
        acc[state].students.push({ marks, ...rest });
      }
      return acc;
    }, {});

    //NOTE - Generate desired output
    const stateFinal = Object.keys(groupedStudentsStateWise).reduce(
      (acc, state) => {
        const students = groupedStudentsStateWise[state].students
          .sort((a, b) => b.marks - a.marks)
          .map((student, index) => ({
            ...student,
            stateRank: student.marks !== 0 ? index + 1 : "N/A",
          }));
        acc.push(...students.map((student) => ({ state: state, ...student })));
        return acc;
      },
      []
    );

    //NOTE - update state rank
    for (let stateUpdate of stateFinal) {
      //NOTE - Check student leader board details AND UPDATE LEADER BOARD DATA city
      await studentLeaderBoardMap.update(
        { state: stateUpdate.stateRank },
        { where: { studentId: stateUpdate.id } }
      );
    }

    //NOTE - Group students by country name
    const groupedStudentsCountryWise = studentList.reduce((acc, student) => {
      const { country, marks, ...rest } = student;
      if (country) {
        acc[country] = acc[country] || { country, students: [] };
        acc[country].students.push({ marks, ...rest });
      }
      return acc;
    }, {});

    //NOTE - Generate desired output
    const countryFinal = Object.keys(groupedStudentsCountryWise).reduce(
      (acc, country) => {
        const students = groupedStudentsCountryWise[country].students
          .sort((a, b) => b.marks - a.marks)
          .map((student, index) => ({
            ...student,
            countryRank: student.marks !== 0 ? index + 1 : "N/A",
          }));
        acc.push(
          ...students.map((student) => ({ country: country, ...student }))
        );
        return acc;
      },
      []
    );

    //NOTE - update state rank
    for (let countryUpdate of countryFinal) {
      //NOTE - Check student leader board details AND UPDATE LEADER BOARD DATA city
      await studentLeaderBoardMap.update(
        { country: countryUpdate.countryRank },
        { where: { studentId: countryUpdate.id } }
      );
    }

    return res.status(200).send({
      status: 200,
      data: studentList,
      school: schoolFinal,
      city: cityFinal,
      state: stateFinal,
      country: countryFinal,
    });
  } catch (error) {
    console.log(error);
  }
};

//ANCHOR - CRON FOR UPDATE SCHOOL LEADER BOARD RANK
cron.schedule("0 23 * * *", async (req, res) => {
  try {
    let studentList = [];
    //NOTE - leader board
    const studentLeader = await studentLeaderBoardMap.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    //NOTE - student leader board all data
    for (let data of studentLeader) {
      const user_details = await UserDetails.findOne({
        where: {
          id: data.studentId,
          type: "Student",
        },
        attributes: ["typeId", "id"],

        include: [
          {
            model: StudentDetails,
            attributes: ["countryId", "stateId", "cityId", "schoolName", "id"],
          },
        ],
      });

      if (user_details !== null && user_details !== undefined) {
        studentList.push({
          id: user_details?.id,
          school: user_details?.student?.schoolName,
          city: user_details?.student?.cityId,
          state: user_details?.student?.stateId,
          country: user_details?.student?.countryId,
          marks: data.marks,
        });
      }
    }

    //NOTE - Group students by school name
    const groupedStudents = studentList.reduce((acc, student) => {
      const { school, marks, ...rest } = student;
      if (school) {
        acc[school] = acc[school] || { school, students: [] };
        acc[school].students.push({ marks, ...rest });
      }
      return acc;
    }, {});

    //NOTE - Generate desired output
    const schoolFinal = Object.keys(groupedStudents).reduce(
      (acc, schoolName) => {
        let rank = 1;
        let previousRank = 1;
        let previousMarks = Infinity;
        const students = groupedStudents[schoolName].students
          .sort((a, b) => b.marks - a.marks)
          .map((student) => {
            if (student.marks < previousMarks) {
              previousMarks = student.marks;
              previousRank = rank;
              if (student.marks !== 0) {
                student.schoolRank = rank++;
              } else {
                student.schoolRank = "N/A";
              }
            } else {
              if (student.marks !== 0) {
                student.schoolRank = previousRank;
              } else {
                student.schoolRank = "N/A";
              }
            }
            return student;
          });
        acc.push(
          ...students.map((student) => ({ school: schoolName, ...student }))
        );
        return acc;
      },
      []
    );

    for (let schoolUpdate of schoolFinal) {
      //NOTE - Check student leader board details AND UPDATE LEADER BOARD DATA
      await studentLeaderBoardMap.update(
        { school: schoolUpdate.schoolRank },
        { where: { studentId: schoolUpdate.id } }
      );
    }

    const finalCron = await timeCronMap.create({
      reason: msg.SCHOOL_LEADER_BOARD,
    });
  } catch (error) {
    console.log(error);
  }
});

//ANCHOR - CRON FOR UPDATE CITY LEADER BOARD RANK
cron.schedule("15 23 * * *", async () => {
  try {
    let studentList = [];
    //NOTE - leader board
    const studentLeader = await studentLeaderBoardMap.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    //NOTE - student leader board all data
    for (let data of studentLeader) {
      const user_details = await UserDetails.findOne({
        where: {
          id: data.studentId,
          type: "Student",
        },
        attributes: ["typeId", "id"],

        include: [
          {
            model: StudentDetails,
            attributes: ["countryId", "stateId", "cityId", "schoolName", "id"],
          },
        ],
      });

      if (user_details !== null && user_details !== undefined) {
        studentList.push({
          id: user_details?.id,
          school: user_details?.student?.schoolName,
          city: user_details?.student?.cityId,
          state: user_details?.student?.stateId,
          country: user_details?.student?.countryId,
          marks: data.marks,
        });
      }
    }

    //NOTE - Group students by city
    const groupedStudentsCity = studentList.reduce((acc, student) => {
      const { city, marks, ...rest } = student;
      if (city) {
        acc[city] = acc[city] || { city, students: [] };
        acc[city].students.push({ marks, ...rest });
      }
      return acc;
    }, {});

    //NOTE - Generate desired output
    const cityFinal = Object.keys(groupedStudentsCity).reduce((acc, city) => {
      let rank = 1;
      let previousRank = 1;
      let previousMarks = Infinity;
      const students = groupedStudentsCity[city].students
        .sort((a, b) => b.marks - a.marks)
        .map((student) => {
          if (student.marks < previousMarks) {
            previousMarks = student.marks;
            previousRank = rank;
            if (student.marks !== 0) {
              student.cityRank = rank++;
            } else {
              student.cityRank = "N/A";
            }
          } else {
            if (student.marks !== 0) {
              student.cityRank = previousRank;
            } else {
              student.cityRank = "N/A";
            }
          }
          return student;
        });
      acc.push(...students.map((student) => ({ city: city, ...student })));
      return acc;
    }, []);

    //NOTE - update city rank
    for (let cityUpdate of cityFinal) {
      //NOTE - Check student leader board details AND UPDATE LEADER BOARD DATA city
      await studentLeaderBoardMap.update(
        { city: cityUpdate.cityRank },
        { where: { studentId: cityUpdate.id } }
      );
    }

    //NOTE - CREATE STATUS FOR CORN
    await timeCronMap.create({
      reason: msg.CITY_LEADER_BOARD,
    });
  } catch (error) {
    console.log(error);
  }
});


//ANCHOR - CRON FOR UPDATE STATE LEADER BOARD RANK
cron.schedule("30 23 * * *", async (req, res) => {
  try {
    let studentList = [];
    //NOTE - leader board
    const studentLeader = await studentLeaderBoardMap.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    //NOTE - student leader board all data
    for (let data of studentLeader) {
      const user_details = await UserDetails.findOne({
        where: {
          id: data.studentId,
          type: "Student",
        },
        attributes: ["typeId", "id"],

        include: [
          {
            model: StudentDetails,
            attributes: ["countryId", "stateId", "cityId", "schoolName", "id"],
          },
        ],
      });

      if (user_details !== null && user_details !== undefined) {
        studentList.push({
          id: user_details?.id,
          school: user_details?.student?.schoolName,
          city: user_details?.student?.cityId,
          state: user_details?.student?.stateId,
          country: user_details?.student?.countryId,
          marks: data.marks,
        });
      }
    }

    //NOTE - Group students by state
    const groupedStudentsStateWise = studentList.reduce((acc, student) => {
      const { state, marks, ...rest } = student;
      if (state) {
        acc[state] = acc[state] || { state, students: [] };
        acc[state].students.push({ marks, ...rest });
      }
      return acc;
    }, {});

    //NOTE - Generate desired output
    const stateFinal = Object.keys(groupedStudentsStateWise).reduce(
      (acc, state) => {
        let rank = 1;
        let previousRank = 1;
        let previousMarks = Infinity;
        const students = groupedStudentsStateWise[state].students
          .sort((a, b) => b.marks - a.marks)
          .map((student) => {
            if (student.marks < previousMarks) {
              previousMarks = student.marks;
              previousRank = rank;
              if (student.marks !== 0) {
                student.stateRank = rank++;
              } else {
                student.stateRank = "N/A";
              }
            } else {
              if (student.marks !== 0) {
                student.stateRank = previousRank;
              } else {
                student.stateRank = "N/A";
              }
            }
            return student;
          });
        acc.push(...students.map((student) => ({ state: state, ...student })));
        return acc;
      },
      []
    );
    //NOTE - update state rank
    for (let stateUpdate of stateFinal) {
      //NOTE - Check student leader board details AND UPDATE LEADER BOARD DATA city
      await studentLeaderBoardMap.update(
        { state: stateUpdate.stateRank },
        { where: { studentId: stateUpdate.id } }
      );
    }

    //NOTE - CREATE STATUS FOR CRON
    await timeCronMap.create({
      reason: msg.STATE_LEADER_BOARD,
    });
  } catch (error) {
    console.log(error);
  }
});

//ANCHOR - CRON FOR UPDATE COUNTRY BASED LEADER BOARD RANK
cron.schedule("45 23 * * *", async (req, res) => {
  try {
    let studentList = [];
    //NOTE - leader board
    const studentLeader = await studentLeaderBoardMap.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    //NOTE - student leader board all data
    for (let data of studentLeader) {
      const user_details = await UserDetails.findOne({
        where: {
          id: data.studentId,
          type: "Student",
        },
        attributes: ["typeId", "id"],

        include: [
          {
            model: StudentDetails,
            attributes: ["countryId", "stateId", "cityId", "schoolName", "id"],
          },
        ],
      });

      if (user_details !== null && user_details !== undefined) {
        studentList.push({
          id: user_details?.id,
          school: user_details?.student?.schoolName,
          city: user_details?.student?.cityId,
          state: user_details?.student?.stateId,
          country: user_details?.student?.countryId,
          marks: data.marks,
        });
      }
    }

    //NOTE - Group students by country
    const groupedStudentsCountryWise = studentList.reduce((acc, student) => {
      const { country, marks, ...rest } = student;
      if (country) {
        acc[country] = acc[country] || { country, students: [] };
        acc[country].students.push({ marks, ...rest });
      }
      return acc;
    }, {});

    //NOTE - Generate desired output
    const countryFinal = Object.keys(groupedStudentsCountryWise).reduce(
      (acc, country) => {
        let rank = 1;
        let previousRank = 1;
        let previousMarks = Infinity;
        const students = groupedStudentsCountryWise[country].students
          .sort((a, b) => b.marks - a.marks)
          .map((student) => {
            if (student.marks < previousMarks) {
              previousMarks = student.marks;
              previousRank = rank;
              if (student.marks !== 0) {
                student.countryRank = rank++;
              } else {
                student.countryRank = "N/A";
              }
            } else {
              if (student.marks !== 0) {
                student.countryRank = previousRank;
              } else {
                student.countryRank = "N/A";
              }
            }
            return student;
          });
        acc.push(
          ...students.map((student) => ({ country: country, ...student }))
        );
        return acc;
      },
      []
    );

    console.log("countryFinal", countryFinal);
    //NOTE - update country rank
    for (let countryUpdate of countryFinal) {
      //NOTE - Check student leader board details AND UPDATE LEADER BOARD DATA COUNTRY
      await studentLeaderBoardMap.update(
        { country: countryUpdate.countryRank },
        { where: { studentId: countryUpdate.id } }
      );
    }

    //NOTE - CREATE STATUS FOR CRON
    await timeCronMap.create({
      reason: msg.COUNTRY_LEADER_BOARD,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  getUserLeaderBoard,
  DemoLeaderboard,
};
