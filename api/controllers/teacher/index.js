const db = require("../../models/index");
const msg = require("../../constants/Messages");
const getSignedUrl = require("../../helpers/getSignedUrl");
const AdminUser = db.admin;
const TeacherAdmin = db.teachers;
const TeacherSchedule = db.teacher_schedule;
const RolePermission = db.permissionRole;
const TeacherSubjectMap = db.teacher_subject_map;
const Subject = db.subject;
const { Op } = require("sequelize");
const { getSignedUrlCloudFront, getYouTubeVideoId } = require("../../helpers/cloudFront");
const { loginAdmin } = require("../admin");

//ANCHOR - Get all Teacher Details
const getAllTeacherDetails = async (req, res) => {
  try {
    const allTeacherUser = [];
    const { page, limit } = req.query;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE - Get details from Admin table
    const adminUserDetails = await AdminUser.findAndCountAll({
      ...query,
      where: { department: "Teacher" },
      exclude: ["createdAt", "updatedAt"],
      include: {
        model: TeacherAdmin,
        attributes: ["dob"],
      },
      order: [["createdAt", "DESC"]],
    });

    for (const adminUsers of adminUserDetails.rows) {
      //NOTE - Final data push
      allTeacherUser.push({
        id: adminUsers.id,
        name: adminUsers.name,
        email: adminUsers.email,
        phone: adminUsers.phone,
        dob: adminUsers.teacher.dob,
        department: adminUsers.department,
        gender: adminUsers?.gender,
        intro_video: adminUsers?.intro_video
      });
    }

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      count: adminUserDetails.count,
      data: allTeacherUser,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get Teacher by Id
const getTeacherByID = async (req, res) => {
  try {
    let data = {};
    const { id } = req.params;

    //NOTE - Get adminuser details from admin table
    const admin_details = await AdminUser.findOne({
      where: { id: id, department: "teacher" },
    });

    if (!admin_details) {
      return res.status(409).send({ status: 409, message: msg.INVALID_USER });
    }

    //NOTE - Get Teacher Details ferom teacher table
    const teacher_details = await TeacherAdmin.findOne({
      where: { id: admin_details.typeId },
    });

    //NOTE: Finalizing the response
    data = {
      id: admin_details.id,
      name: admin_details.name,
      email: admin_details.email,
      phone: admin_details.phone,
      department: admin_details.department,
      dob: teacher_details.dob,
      gender: teacher_details.gender,
      intro_video: teacher_details?.intro_video
    };
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Update Teacher By Id
const updateTeacherById = async (req, res) => {
  try {
    const { name, email, phone, dob, gender, boardId, classId, subjectId, intro_video, id } =
      req.body;

    //NOTE - Get details from Admin table
    const adminUsers = await AdminUser.findOne({
      where: { id: id },
    });

    //NOTE - Get details from Teacher table
    const teacher = await TeacherAdmin.findOne({
      where: { id: adminUsers.typeId },
    });

    await AdminUser.update(
      { name: name, email: email, phone: phone, intro_video: intro_video || null },
      { where: { id: adminUsers.id } }
    );

    await TeacherAdmin.update(
      {
        dob: dob,
        gender: gender,
        boardId: boardId,
        classId: classId,
        subjectId: subjectId,
      },
      { where: { id: adminUsers.typeId } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.TEACHER_UPDATED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - delete Staff
const deleteTeacherById = async (req, res) => {
  try {
    const ID = req.params.id;
    const users = await AdminUser.findOne({
      where: { id: ID, department: "teacher" },
    });

    if (!users)
      return res.status(400).send({ status: 400, message: msg.INVALID_USER });

    const teachers = await TeacherAdmin.findOne({
      where: { id: users.typeId },
    });

    if (!teachers)
      return res.status(400).send({ status: 400, message: msg.INVALID_USER });
    await users.destroy();

    await teachers.destroy();

    return res
      .status(200)
      .send({ status: 200, id: users.id, message: msg.TEACHER_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Create Schedule
const teachCreateSchedule = async (req, res) => {
  try {
    const {
      teacherId,
      fromDate,
      toDate,
      leaveDate,
      availability,
      availabilityTimeFrom,
      availabilityTimeTo,
      breakTimeFrom,
      breakTimeTo,
    } = req.body;

    const schedule = new TeacherSchedule({
      teacherId: teacherId,
      fromDate: fromDate,
      toDate: toDate,
      leaveDate: leaveDate,
      availability: availability,
      availabilityTimeFrom: availabilityTimeFrom,
      availabilityTimeTo: availabilityTimeTo,
      breakTimeFrom: breakTimeFrom,
      breakTimeTo: breakTimeTo,
    });

    const getSchedule = await schedule.save();

    if (getSchedule) {
      return res.status(200).send({
        status: 200,
        message: msg.TEACHER_SCHEDULE_CREATED,
      });
    } else {
      return res.status(409).send({
        status: 409,
        message: msg.NOT_FOUND,
      });
    }
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get batchType by all ids
const getAllMentor = async (req, res) => {
  try {
    let result = [];

    //NOTE - search all role how have word like mentor
    const searchTerm = "mentor";
    const roles = await RolePermission.findAll({
      where: {
        role: {
          [Op.like]: "%" + searchTerm + "%",
        },
      },
    });

    for (const data of roles) {
      //NOTE - find all users
      const getAdminUser = await AdminUser.findAll({
        where: {
          department: data.id,
        },
      });

      //NOTE - if users push all data
      if (getAdminUser)
        for (const user of getAdminUser) {
          result.push({
            id: user.id,
            name: user?.name,
            gender: user?.gender,
            avatar: user?.avatar ? await getSignedUrl(user?.avatar) : null,
            email: user?.email,
            department: user?.department,
          });
        }
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get all Teacher Details
const getEducators = async (req, res) => {
  try {
    const educators = [];

    //NOTE - find educators or teacher Id
    const roles = await RolePermission.findOne({
      where: {
        role: {
          [Op.or]: ["teacher", "Teacher"]
        }
      },
      attributes: ["id"]
    });


    //NOTE - Get details from Admin table
    const educator = await AdminUser.findAll({
      where: { department: roles.id },
      exclude: ["createdAt", "updatedAt"],
      include: {
        model: TeacherAdmin,
        attributes: ["dob"],
      },
      order: [["createdAt", "DESC"]],
    });

    let subject = [];
    for (const adminUsers of educator) {
      //NOTE - teacher assign subject data
      const getEducator = await TeacherSubjectMap.findAll({
        where: { teacherId: adminUsers.id },
        include: [
          {
            model: Subject,
            attributes: ["id", "name"],
          },
        ],
      });
      const uniqueSubject = new Set();
      getEducator.forEach((item) => {
        const subjectId = item.subject && item.subject.id;
        const subjectName = item.subject && item.subject.name;
        if (subjectId && subjectName) {
          uniqueSubject.add(subjectId);
        }
      });

      //NOTE - educators all subjects
      const subjects = Array.from(uniqueSubject).map((subjectId) => ({
        id: subjectId,
        name: getEducator.find((item) => item.subject.id === subjectId)?.subject
          .name,
      }));

      //NOTE - educator data push
      educators.push({
        id: adminUsers.id,
        name: adminUsers.name,
        avatar: adminUsers.avatar ? await getSignedUrlCloudFront(adminUsers.avatar) : null,
        teacherInfo: adminUsers?.teacherInfo,
        original_intro_video: adminUsers?.intro_video,
        converted_intro_video: adminUsers?.intro_video ? await getYouTubeVideoId(adminUsers?.intro_video) : null,
        gender: adminUsers?.gender,
        subject: subjects
      });
    }

    //NOTE - final response
    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: educators,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

module.exports = {
  getAllTeacherDetails,
  getTeacherByID,
  updateTeacherById,
  deleteTeacherById,
  teachCreateSchedule,
  getAllMentor,
  getEducators
};
