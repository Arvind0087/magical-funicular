const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Op } = require("sequelize");
const Enquiry = db.enquiry;

//ANCHOR :create Enquiry
const createEnquiry = async (req, res) => {
  try {
    const { name, email, mobile, subject, message } = req.body;

    //NOTE - create enquiry
    await Enquiry.create({
      name: name,
      email: email,
      phone: mobile,
      subject: subject,
      message: message,
    });

    return res.status(200).send({
      status: 200,
      message: msg.ENQUIRY_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR get all Enquiry
const getAllEnquiry = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    let val;
    if (search) {
      val = {
        [Op.or]: [
          { name: { [Op.like]: "%" + search + "%" } },
          { phone: { [Op.like]: "%" + search + "%" } },
          { email: { [Op.like]: "%" + search + "%" } },
        ],
      };
    }
    // //NOTE - If login by a teacher or mentor
    // let userParams = null;
    // if (
    //   req.user?.role &&
    //   ["teacher", "mentor"].includes(req.user.role.toLowerCase())
    // ) {
    //   //NOTE - get staff details
    //   const getAdmin = await AdminUser.findOne({ where: { id: req.user.id } });
    //   //NOTE - get staff class and batch details
    //   const teachersSubject = await TeacherSubjectMap.findAll({
    //     where: { teacherId: getAdmin.id },
    //     attributes: { exclude: ["createdAt", "updatedAt"] },
    //   });

    //   //NOTE - get all class details
    //   const classesIds = teachersSubject.map((item) => item.dataValues.classId);
    //   //NOTE - get all batch details
    //   const batchIds = teachersSubject.map(
    //     (item) => item.dataValues.batchTypeId
    //   );

    //   //NOTE - params based on class or batch type
    //   const idParams = batchIds.every((id) => id === null)
    //     ? { classId: { [Sequelize.Op.in]: classesIds } }
    //     : { batchTypeId: { [Sequelize.Op.in]: batchIds } };

    //   //NOTE - get all student details
    //   const students = await StudentDetails.findAll({ where: idParams });
    //   //NOTE - get all students type ids
    //   const typeIds = students.map((item) => item.dataValues.id);

    //   userParams = { userId: { [Sequelize.Op.in]: typeIds } };
    // }

    //NOTE - get all enquiry
    const { count, rows } = await Enquiry.findAndCountAll({
      ...query,
      where: { ...val },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["createdAt", "DESC"]],
    });

    if (!rows)
      return res
        .status(400)
        .send({ status: 400, message: msg.ENQUIRY_NOT_FOUND });

    //NOTE - push final data
    const result = rows.map((data) => ({
      id: data?.id,
      name: data?.name,
      phone: data?.phone,
      email: data?.email,
      subject: data?.subject,
      message: data?.message,
    }));

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

//ANCHOR : get enquiry by id
const getEnquiryById = async (req, res) => {
  try {
    const getEnquiry = await Enquiry.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ["updatedAt"],
      },
    });

    if (!getEnquiry)
      return res
        .status(400)
        .send({ status: 400, message: msg.ENQUIRY_NOT_FOUND });

    //NOTE - push final data
    const result = {
      id: getEnquiry.id,
      name: getEnquiry.name,
      phone: getEnquiry.phone,
      email: getEnquiry.email,
      subject: getEnquiry.subject,
      message: getEnquiry.message,
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
  createEnquiry,
  getAllEnquiry,
  getEnquiryById,
};
