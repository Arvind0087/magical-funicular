const { Sequelize } = require("sequelize");
const db = require("../../models/index");
const msg = require("../../constants/Messages");
const batchType = db.batchTypes;
const questionBank = db.questionBank;
const Doubt = db.doubt;
const UserDetails = db.users;
const StudentDetails = db.student;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const ShortsCourseMap = db.shorts_course_map;

//ANCHOR - get dashboard details
const dashboard = async (req, res) => {
  try {
    let studentCount;
    let staffCount;

    //NOTE - If login by a teacher or mentor
    let params;
    let studentIds;
    if (req.user) {
      if (["teacher", "mentor"].includes(req.user.role.toLowerCase())) {
        const staffDetails = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: ["classId", "batchTypeId"],
        });

        const classesIds = staffDetails.map((item) => item.classId);

        params = { classId: { [Sequelize.Op.in]: classesIds } };

        //NOTE - get all student details
        const student = await StudentDetails.findAll({
          where: params,
          attributes: ["id"],
        });

        //NOTE - get all student ids details
        const typeIds = student.map((item) => item.id);

        //NOTE - get all users details
        const { count, rows } = await UserDetails.findAndCountAll({
          where: {
            typeId: {
              [Sequelize.Op.in]: typeIds,
            },
            type: "Student",
          },
          attributes: ["id"],
        });

        //NOTE - get student ids for get doubt count
        studentIds = {
          studentId: {
            [Sequelize.Op.in]: rows.map((item) => item.id),
          },
        };

        //NOTE - push student count if teacher or mentor
        studentCount = count;

        //NOTE - get teacher or mentor count
        staffCount = await TeacherSubjectMap.count({
          distinct: true,
          col: "teacherId",
          where: params ? { ...params } : {},
        });
      } else {
        //NOTE - push student count if not teacher or mentor
        studentCount = await UserDetails.count({
          where: { type: "Student" },
        });

        //NOTE - get staff count
        staffCount = await AdminUser.count();
      }
    }

    const getBatchType = await batchType.count({
      where: params ? { ...params } : {},
    });

    //NOTE - get shorts count
    const getShorts = await ShortsCourseMap.count({
      distinct: true,
      col: "shortsId",
      where: params ? { ...params } : {},
    });

    //NOTE - get questions count
    const getQuestion = await questionBank.count({
      where: params ? { ...params } : {},
    });

    //NOTE - get doubts count
    const getDoubt = await Doubt.count({ where: { ...studentIds } });

    //NOTE - push all counts
    const result = {
      userCount: studentCount,
      staffCount: staffCount,
      batchTypeCount: getBatchType,
      shortsCount: getShorts,
      questionCount: getQuestion,
      doubtCount: getDoubt,
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

module.exports = {
  dashboard,
};
