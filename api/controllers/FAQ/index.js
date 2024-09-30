const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Op } = require("sequelize");
const faq = db.faq;
const AdminUser = db.admin;
const RolePermission = db.permissionRole;

//ANCHOR : create faq
const createFaq = async (req, res) => {
  try {
    const { question, answer, type } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    const newFaq = new faq({
      question: question,
      answer: answer,
      type: type,
      createdById: id,
    });

    await newFaq.save();
    return res.status(200).send({
      status: 200,
      message: msg.FAQ_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get faq by id
const getFaqById = async (req, res) => {
  try {
    const getFaq = await faq.findOne({
      where: { id: req.params.id },
    });
    if (!getFaq) {
      return res.status(400).send({ status: 400, message: msg.FAQ_NOT_FOUND });
    }
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getFaq,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all faq
const getAllFaq = async (req, res) => {
  try {
    const { page, limit, type, search } = req.query;

    //NOTE - add pagination
    const query =
      page && limit
        ? {
            offset: Number(page - 1) * limit,
            limit: Number(limit),
          }
        : {};

    const final = {};

    if (type) {
      final.type = type;
    }

    if (search) {
      final[Op.or] = [
        { question: { [Op.like]: `%${search}%` } },
        { answer: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await faq.findAndCountAll({
      ...query,
      where: final,
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
    if (!rows)
      return res
        .status(200)
        .send({ status: 200, message: msg.FAQ_NOT_FOUND, data: [] });

    //NOTE - push final data
    const result = rows.map((allFaq) => ({
      id: allFaq.id,
      question: allFaq.question,
      answer: allFaq.answer,
      type: allFaq.type,
      createdByName: allFaq.creator ? allFaq.creator?.name : null,
      createdByRole: allFaq.creator
        ? allFaq.creator?.permission_role?.role
        : null,
      updateByName: allFaq.updater ? allFaq.updater?.name : null,
      updateByRole: allFaq.updater
        ? allFaq.updater?.permission_role.role
        : null,
      createdAt: allFaq.createdAt,
      updatedAt: allFaq.updatedAt,
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

//ANCHOR : update FAQ
const updateFaqById = async (req, res) => {
  try {
    const { question, answer, type } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    const getFaq = await faq.findOne({
      where: { id: req.params.id },
    });
    if (!getFaq)
      return res.status(400).send({ status: 400, message: msg.FAQ_NOT_FOUND });

    await faq.update(
      { question: question, answer: answer, type: type, updatedById: id },
      { where: { id: req.params.id } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.FAQ_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete Faq
const deleteFaqById = async (req, res) => {
  try {
    const getFaq = await faq.findOne({
      where: { id: req.params.id },
    });
    if (!getFaq) {
      return res.status(400).send({ status: 400, message: msg.FAQ_NOT_FOUND });
    }
    await faq.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({ status: 200, message: msg.FAQ_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createFaq,
  getAllFaq,
  getFaqById,
  updateFaqById,
  deleteFaqById,
};
