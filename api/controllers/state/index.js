const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Op } = require("sequelize");
const State = db.state;
const City = db.city;

const AdminUser = db.admin;
const RolePermission = db.permissionRole;

//ANCHOR : add State
const createState = async (req, res) => {
  try {
    const { name } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    const getState = await State.findOne({
      where: { name: name },
    });
    if (getState)
      return res.status(400).send({ status: 400, message: msg.STATE_EXIST });

    await State.create({
      name: name.replace(/\s+/g, " ").trim(),
      createdById: token,
    });

    return res.status(200).send({
      status: 200,
      message: msg.STATE_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all State
const getAllState = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    let response = [];
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
        name: { [Op.like]: "%" + search + "%" },
      };
    }
    //NOTE - Find all state data
    const getState = await State.findAndCountAll({
      ...query,
      where: val,
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
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["createdAt", "DESC"]],
    });
    if (!getState)
      return res
        .status(400)
        .send({ status: 400, message: msg.STATE_NOT_FOUND });
    for (const data of getState.rows) {
      //NOTE - push final data
      response.push({
        id: data.id,
        name: data.name,
        createdByName: data.creator ? data.creator?.name : null,
        createdByRole: data.creator
          ? data.creator?.permission_role?.role
          : null,
        updateByName: data.updater ? data.updater?.name : null,
        updateByRole: data.updater ? data.updater?.permission_role.role : null,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getState.count,
      data: response,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get state by id
const getStateById = async (req, res) => {
  try {
    const getState = await State.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: { id: req.params.id },
    });
    if (!getState)
      return res
        .status(400)
        .send({ status: 400, message: msg.STATE_NOT_FOUND });

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getState,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : update State
const updateStateById = async (req, res) => {
  try {
    const { Id, name } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    const getState = await State.findOne({
      where: { id: Id },
    });
    if (!getState)
      return res
        .status(400)
        .send({ status: 400, message: msg.STATE_NOT_FOUND });

    const updatedState = await State.update(
      { name: name.replace(/\s+/g, " ").trim(), updatedById: token },
      { where: { id: Id } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.STATE_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete State
const deleteStateById = async (req, res) => {
  try {
    const getState = await State.findOne({
      where: { id: req.params.id },
    });
    if (!getState)
      return res
        .status(400)
        .send({ status: 400, message: msg.STATE_NOT_FOUND });

    //NOTE - find all city details
    const getCity = await City.findAll({
      where: { stateId: getState.id },
    });

    //NOTE - if city is there for that state delete it
    if (getCity)
      await City.destroy({
        where: {
          stateId: getState.id,
        },
      });

    //NOTE: if state delete it
    await State.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({ status: 200, message: msg.STATE_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createState,
  getAllState,
  getStateById,
  updateStateById,
  deleteStateById,
};
