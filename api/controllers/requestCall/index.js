const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize } = require("sequelize");
const RequestCall = db.requestCall;
const UserDetails = db.users;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const StudentDetails = db.student;

//ANCHOR : request Call
const createRequestCall = async (req, res) => {
  try {
    const { userId, message } = req.body;
    //NOTE - create a request call
    await RequestCall.create({
      userId: userId,
      message: message,
    });

    return res.status(200).send({
      status: 200,
      message: msg.REQUEST_CALL,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get request Call get by id
const getRequestCallById = async (req, res) => {
  try {
    //NOTE - get userId from token
    const userId = req.user.id;

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const RequestCalls = await RequestCall.findOne({
      where: {
        userId: userId,
        createdAt: {
          [Sequelize.Op.between]: [twentyFourHoursAgo, now],
        },
      },
    });
    if (!RequestCalls) {
      return res
        .status(200)
        .send({ status: false, message: msg.ABLE_TO_DO_CALL });
    } else {
      return res.status(200).send({
        status: true,
        message: msg.ALREADY_REQUEST_CALL,
      });
    }
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all request call
const getAllRequestCall = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    //NOTE - add pagination
    const query =
      page && limit
        ? {
            offset: Number(page - 1) * limit,
            limit: Number(limit),
          }
        : {};

    //NOTE - filter based on student
    const studentParams = search ? { userId: search } : undefined;

    let studentIds;
    if (req.user)
      if (["teacher", "mentor", "Teacher", "Mentor"].includes(req.user?.role)) {
        let idParams;
        //NOTE - Get  User details from token
        const getAdmin = await AdminUser.findOne({
          where: { id: req.user.id },
        });

        //NOTE - get Teacher subject details
        const teachersSubject = await TeacherSubjectMap.findAll({
          where: { teacherId: getAdmin.id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });

        //NOTE - push all user class Ids for
        const classesIds = teachersSubject.map(
          (item) => item.dataValues.classId
        );

        //NOTE - push all batch ids
        const batchIds = teachersSubject.map(
          (item) => item.dataValues.batchTypeId
        );

        if (batchIds.every((id) => id === null)) {
          //NOTE - all class are being taught in the same batch, filter based on classId only
          idParams = {
            classId: {
              [Sequelize.Op.in]: classesIds,
            },
          };
        } else {
          //NOTE - filter based on batchTypeId
          idParams = {
            batchTypeId: {
              [Sequelize.Op.in]: batchIds,
            },
          };
        }

        //NOTE - find student data based on the batchType
        const students = await StudentDetails.findAll({
          where: {
            ...idParams,
          },
        });

        //NOTE - push all user type ids for student ids
        const type_id = students.map((item) => item.dataValues.id);

        //NOTE - send typeIds based on the batch type id
        studentIds = {
          id: {
            [Sequelize.Op.in]: type_id,
          },
        };
      }

    //NOTE - get all request call by users
    const { count, rows } = await RequestCall.findAndCountAll({
      ...query,
      where: { ...studentParams, ...studentIds },
      include: [
        {
          model: UserDetails,
          attributes: ["name", "phone"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!rows)
      return res
        .status(400)
        .send({ status: 400, message: msg.REQUEST_NOT_FOUND });

    //NOTE - push final data
    const response = rows.map((data) => ({
      id: data.id,
      userId: data.userId,
      user: data?.user?.name,
      phone: data?.user?.phone,
      reason: data.message,
      date: data.createdAt,
    }));

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: response,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete RequestCall
const deleteRequestCallById = async (req, res) => {
  try {
    const getRequestCall = await RequestCall.findOne({
      where: { id: req.params.id },
    });
    if (!getRequestCall)
      return res
        .status(400)
        .send({ status: 400, message: msg.REQUEST_NOT_FOUND });

    await RequestCall.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res
      .status(200)
      .send({ status: 200, message: msg.REQUEST_CALL_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createRequestCall,
  getRequestCallById,
  getAllRequestCall,
  deleteRequestCallById,
};
