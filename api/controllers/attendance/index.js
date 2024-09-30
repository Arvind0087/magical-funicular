const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize, Op } = require("sequelize");
const UserDetails = db.users;
const studentAttendance = db.event_student_attendance;
const teacherAttendance = db.event_teacher_attendance;
const AdminUser = db.admin;
const RolePermission = db.permissionRole;

//NOTE - create attandance
const studentMarkAttandence = async (req, res) => {
  try {
    const { studentIds } = req.body;

    //NOTE - id from decode token
    const userId = req.user.id;

    //NOTE - current date
    const newDate = new Date();
    const startOfDay = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
      0,
      0,
      0
    );
    const endOfDay = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
      23,
      59,
      59
    );

    //NOTE - mark attandence
    for (let data of studentIds) {
      const findData = await studentAttendance.findOne({
        where: {
          studentId: data,
          createdAt: {
            [Sequelize.Op.and]: [
              { [Sequelize.Op.between]: [startOfDay, endOfDay] },
            ],
          },
        },
      });

      //NOTE - mark attandance new student
      if (!findData && findData === null) {
        await studentAttendance.create({
          studentId: data,
          status: "Manual",
          createdById: userId,
        });
      }
    }

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.STUDENT_ATTANDENCE_MARKED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE - create attandance of staff
const staffMarkAttandence = async (req, res) => {
  try {
    const { teacherIds } = req.body;

    //NOTE - id from decode token
    const userId = req.user.id;

    //NOTE - current date
    const newDate = new Date();
    const startOfDay = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
      0,
      0,
      0
    );
    const endOfDay = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
      23,
      59,
      59
    );

    //NOTE - mark attandence
    for (let data of teacherIds) {
      const findData = await teacherAttendance.findOne({
        where: {
          teacherId: data,
          createdAt: {
            [Sequelize.Op.and]: [
              { [Sequelize.Op.between]: [startOfDay, endOfDay] },
            ],
          },
        },
      });

      //NOTE - mark attandance new student
      if (!findData && findData === null) {
        await teacherAttendance.create({
          teacherId: data,
          status: "Manual",
          createdById: userId,
        });
      }
    }

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.TEACHER_ATTANDENCE_MARKED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE - get all student attandance
const allUserAttandance = async (req, res) => {
  try {
    let getAllAttand = [];
    const { page, limit, type, search } = req.query;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE - find all student attandance
    const getAttandance = await studentAttendance.findAndCountAll({
      ...query,
      //where: final,
      include: [
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
    if (!getAttandance)
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });

    //NOTE - final push data
    for (const allData of getAttandance.rows) {
      getAllAttand.push({
        id: allData.id,
        teacherId: allData.teacherId,
        status: allData.status,
        createdByName: allData.creator ? allData.creator?.name : null,
        createdByRole: allData.creator
          ? allData.creator?.permission_role?.role
          : null,
        updateByName: allData.updater ? allData.updater?.name : null,
        updateByRole: allData.updater
          ? allData.updater?.permission_role.role
          : null,
        createdAt: allData.createdAt,
        mark: "present",
      });
    }

    //NOTE - final return
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getAttandance.count,
      data: getAllAttand,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE - get all staff attandance
const allStaffAttandance = async (req, res) => {
  try {
    let getAllAttand = [];
    const { page, limit, type, search } = req.query;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE - find all staff attandance
    const getAttandance = await teacherAttendance.findAndCountAll({
      ...query,
      //where: final,
      include: [
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
    if (!getAttandance)
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });

    //NOTE - final push data
    for (const allData of getAttandance.rows) {
      getAllAttand.push({
        id: allData.id,
        teacherId: allData.teacherId,
        status: allData.status,
        createdByName: allData.creator ? allData.creator?.name : null,
        createdByRole: allData.creator
          ? allData.creator?.permission_role?.role
          : null,
        updateByName: allData.updater ? allData.updater?.name : null,
        updateByRole: allData.updater
          ? allData.updater?.permission_role.role
          : null,
        createdAt: allData.createdAt,
        mark: "present",
      });
    }

    //NOTE - final return
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getAttandance.count,
      data: getAllAttand,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - User ATTANDANCE
const usersAttend = async (req, res) => {
  try {
    let getAllAttand = [];
    const { page, limit, month, year, id } = req.query;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE - Calculate the start and end dates based on the provided year and month
    const currentYear = new Date().getFullYear();
    let startDate = null;
    let endDate = null;

    //NOTE - when both coming
    if (year && month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
    } else if (month) {
      startDate = new Date(currentYear, month - 1, 1);
      endDate = new Date(currentYear, month, 0);
    }
    //NOTE - if startDate and endDate is not coming
    const whereCondition = {
      studentId: id,
    };
    //NOTE - if start and end date comes
    if (startDate && endDate) {
      whereCondition.createdAt = {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      };
    }

    //NOTE - find all student attandance
    const getAttandance = await studentAttendance.findAndCountAll({
      ...query,
      where: whereCondition,
      include: [
        {
          model: UserDetails,
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!getAttandance)
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });

    //NOTE - final push data
    for (const allData of getAttandance.rows) {
      getAllAttand.push({
        id: allData.id,
        studentId: allData.studentId,
        student: allData?.user?.name,
        status: allData.status,
        mark: "present",
        createdAt: allData.createdAt,
      });
    }

    //NOTE - final return
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getAttandance.count,
      data: getAllAttand,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - staff ATTANDANCE
const staffAttend = async (req, res) => {
  try {
    let getAllAttand = [];
    const { page, limit, month, year, id } = req.query;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE - Calculate the start and end dates based on the provided year and month
    const currentYear = new Date().getFullYear();
    let startDate = null;
    let endDate = null;
    
    //NOTE - when both coming
    if (year && month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
    } else if (month) {
      startDate = new Date(currentYear, month - 1, 1);
      endDate = new Date(currentYear, month, 0);
    }
    //NOTE - if startDate and endDate is not coming
    const whereCondition = {
      teacherId: id,
    };
    //NOTE - if start and end date comes
    if (startDate && endDate) {
      whereCondition.createdAt = {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      };
    }

    //NOTE - find all student attandance
    const getAttandance = await teacherAttendance.findAndCountAll({
      ...query,
      where: whereCondition,
      include: [
        {
          model: AdminUser,
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!getAttandance)
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });

    //NOTE - final push data
    for (const allData of getAttandance.rows) {
      getAllAttand.push({
        id: allData.id,
        teacherId: allData.teacherId,
        teacher: allData?.adminUser?.name,
        status: allData.status,
        mark: "present",
        createdAt: allData.createdAt,
      });
    }

    //NOTE - final return
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getAttandance.count,
      data: getAllAttand,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  studentMarkAttandence,
  staffMarkAttandence,
  allUserAttandance,
  allStaffAttandance,
  usersAttend,
  staffAttend,
};
