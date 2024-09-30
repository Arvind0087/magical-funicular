const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Op } = require("sequelize");
const _ = require("lodash");
const WantToBe = db.wantToBe;
const AdminUser = db.admin;
const RolePermission = db.permissionRole;

//ANCHOR : create WantToBe
const createWantToBe = async (req, res) => {
  try {
    const { name } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    const getWantToBe = await WantToBe.findOne({
      where: { name: name },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (getWantToBe)
      return res
        .status(400)
        .send({ status: 400, message: msg.WANT_TO_ALREADY_EXIST });

    await WantToBe.create({
      name: name,
      createdById: token,
    });

    return res.status(200).send({
      status: 200,
      message: msg.WANT_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};



//ANCHOR : get wantToBe by id
const getWantToBeById = async (req, res) => {
  try {
    const getWantToBe = await WantToBe.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!getWantToBe)
      return res.status(400).send({ status: 400, message: msg.WANT_NOT_FOUND });

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getWantToBe,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all WantToBe
const getAllWantToBe = async (req, res) => {
  try {
    let result = [];
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
          { id: search },
          { name: search },
          { name: { [Op.like]: "%" + search + "%" } },
        ],
      };
    }
    const getWantToBe = await WantToBe.findAndCountAll({
      ...query,
      where: {
        ...val,
      },
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
    if (!getWantToBe)
      return res.status(400).send({ status: 400, message: msg.WANT_NOT_FOUND });

    for (const data of getWantToBe.rows) {
      result.push({
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
      count: getWantToBe.count,
      data: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : update WantToBe
const updateWantToBeById = async (req, res) => {
  try {
    const { name, WantToBeId } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    const getWantToBe = await WantToBe.findOne({
      where: { id: WantToBeId },
    });
    if (!getWantToBe) {
      return res.status(400).send({ status: 400, message: msg.WANT_NOT_FOUND });
    }

    let obj1 = {
      id: getWantToBe.id,
      name: getWantToBe.name,
    };

    let obj2 = {
      id: WantToBeId,
      name: name,
    };

    if (!_.isEqual(obj1, obj2)) {
      const getWantToBe = await WantToBe.findOne({
        where: {
          name: name,
        },
      });

      if (getWantToBe)
        return res.status(400).send({
          status: 400,
          message: msg.WANT_TO_ALREADY_EXIST,
        });
    }

    await WantToBe.update(
      { name: name, updatedById: token },
      { where: { id: WantToBeId } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.WANT_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete wantToBe
const deleteWantToBeById = async (req, res) => {
  try {
    const wantToBeId = req.params.id;
    const getWantToBe = await WantToBe.findOne({
      where: { id: wantToBeId },
    });
    if (!getWantToBe)
      return res.status(400).send({ status: 400, message: msg.WANT_NOT_FOUND });

    await WantToBe.destroy({
      where: {
        id: wantToBeId,
      },
    });

    return res.status(200).send({ status: 200, message: msg.WANT_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createWantToBe,
  getWantToBeById,
  getAllWantToBe,
  updateWantToBeById,
  deleteWantToBeById,
};
