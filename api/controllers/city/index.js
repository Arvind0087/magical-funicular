const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize, Op } = require("sequelize");
const State = db.state;
const City = db.city;
const AdminUser = db.admin;
const RolePermission = db.permissionRole;

//ANCHOR : add City
const addCity = async (req, res) => {
  try {
    const { stateId, name } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    const getCity = await City.findOne({
      where: { stateId: stateId, name: name },
    });
    if (getCity)
      return res.status(400).send({ status: 400, message: msg.CITY_EXIST });

    await City.create({
      stateId: stateId,
      name: name.replace(/\s+/g, " ").trim(),
      createdById: id,
    });

    return res.status(200).send({
      status: 200,
      message: msg.CITY_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all City
const getAllCity = async (req, res) => {
  try {
    const { page, limit, state, city } = req.query;

    //NOTE - add pagination
    const query =
      page && limit
        ? {
            offset: Number(page - 1) * limit,
            limit: Number(limit),
          }
        : {};

    //NOTE - filter based on state
    const states = state ? { name: state } : {};

    //NOTE - filter based on city
    const params = city ? { name: { [Op.like]: `%${city}%` } } : undefined;

    const { count, rows } = await City.findAndCountAll({
      ...query,
      where: params,
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        { model: State, attributes: ["id", "name"], where: states },
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
        .send({ status: 200, message: msg.CITY_NOT_FOUND, data: [] });

    //NOTE - push final data
    const result = rows.map((data) => ({
      id: data.id,
      name: data.name,
      stateId: data.stateId,
      state: data.state?.name,
      createdByName: data.creator ? data.creator?.name : null,
      createdByRole: data.creator ? data.creator?.permission_role?.role : null,
      updateByName: data.updater ? data.updater?.name : null,
      updateByRole: data.updater ? data.updater?.permission_role.role : null,
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

//ANCHOR: get city by id
const getCityById = async (req, res) => {
  try {
    //NOTE - get city by id
    const getCity = await City.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: { id: req.params.id },
      include: { model: State, attributes: ["id", "name"] },
    });

    if (!getCity)
      return res.status(400).send({ status: 400, message: msg.CITY_NOT_FOUND });

    //NOTE - push final result
    const result = {
      id: getCity.id,
      name: getCity.name,
      stateId: getCity.stateId,
      state: getCity.state?.name,
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

//ANCHOR : get city by state id
const getAllCityByStateId = async (req, res) => {
  try {
    //NOTE - get all city city details
    const getCity = await City.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: { stateId: req.params.id },
      include: { model: State, attributes: ["id", "name"] },
    });

    if (!getCity)
      return res.status(400).send({ status: 400, message: msg.CITY_NOT_FOUND });

    //NOTE - push final data
    const result = getCity.map((data) => ({
      id: data.id,
      name: data.name,
      stateId: data.stateId,
      state: data.state?.name,
    }));

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : update City
const updateCityById = async (req, res) => {
  try {
    const { cityId, stateId, name } = req.body;

    //NOTE - id from token
    const userId = req.user.id;

    const getCity = await City.findOne({
      where: { id: cityId, stateId: stateId },
    });
    if (!getCity)
      return res.status(400).send({ status: 400, message: msg.CITY_NOT_FOUND });

    await City.update(
      {
        stateId: stateId,
        name: name.replace(/\s+/g, " ").trim(),
        updatedById: userId,
      },
      { where: { id: cityId, stateId: stateId } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.CITY_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete City
const deleteCityById = async (req, res) => {
  try {
    const getCity = await City.findOne({
      where: { id: req.params.id },
    });

    if (!getCity)
      return res.status(400).send({ status: 400, message: msg.CITY_NOT_FOUND });

    await City.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).send({ status: 200, message: msg.CITY_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get city by multiple state id
const getCityByMultipleStateId = async (req, res) => {
  try {
    const { stateIds } = req.body;

    //NOTE - get all city  details
    const cityData = await City.findAll({
      attributes: ["id", "name", "stateId"],
      where: { stateId: { [Sequelize.Op.in]: stateIds } },
      include: { model: State, attributes: ["name"] },
    });

    if (!cityData)
      return res
        .status(200)
        .send({ status: 200, message: msg.CITY_NOT_FOUND, data: [] });

    //NOTE - push final data
    const result = cityData.map((data) => ({
      id: data.id,
      name: data.name,
      stateId: data.stateId,
      state: data.state?.name,
    }));

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
  addCity,
  getAllCity,
  getCityById,
  updateCityById,
  deleteCityById,
  getAllCityByStateId,
  getCityByMultipleStateId,
};
