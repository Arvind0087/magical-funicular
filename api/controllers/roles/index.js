const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Op } = require("sequelize");
const _ = require("lodash");
const AdminUser = db.admin;
const RoleDetails = db.permissionRole;

//ANCHOR - Create new packages
const createRoles = async (req, res) => {
  try {
    const { role } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    const getRoleDetails = await RoleDetails.findOne({
      where: { role: role },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (getRoleDetails) {
      return res
        .status(400)
        .send({ status: 400, message: msg.ROLE_ALREADY_EXIST });
    }
    const roles = new RoleDetails({
      role: role,
      createdById: token,
    });

    const getRoles = await roles.save();

    if (getRoles) {
      return res.status(200).send({
        status: 200,
        message: msg.ROLES_CREATED,
      });
    } else {
      return res.status(409).send({
        status: 409,
        message: msg.NOT_FOUND,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get all Roles for permission
const getAllPermissionRoles = async (req, res) => {
  try {
    const { page, limit, search, role } = req.query;

    //NOTE - add pagination
    const query =
      page && limit
        ? {
            offset: Number(page - 1) * limit,
            limit: Number(limit),
          }
        : {};

    //NOTE - filter based on role
    const params = search
      ? {
          [Op.or]: [{ role: { [Op.like]: "%" + search + "%" } }],
        }
      : {};

    //NOTE - Get details from Admin table
    const { count, rows } = await RoleDetails.findAndCountAll({
      ...query,
      where: { ...params },
      include: [
        {
          model: AdminUser,
          as: "creator",
          attributes: ["id", "name"],
          include: {
            model: RoleDetails,
            attributes: ["role"],
          },
        },
        {
          model: AdminUser,
          as: "updater",
          attributes: ["id", "name"],
          include: {
            model: RoleDetails,
            attributes: ["role"],
          },
        },
      ],
      exclude: ["createdAt", "updatedAt"],
      order: [["createdAt", "DESC"]],
    });

    //NOTE - Final data push
    const response = rows.map((data) => ({
      id: data.id,
      role: data.role,
      createdByName: data.creator ? data.creator?.name : null,
      createdByRole: data.creator ? data.creator?.permission_role?.role : null,
      updateByName: data.updater ? data.updater?.name : null,
      updateByRole: data.updater ? data.updater?.permission_role?.role : null,
    }));

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: response,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get Roles by id
const getRolesById = async (req, res) => {
  try {
    const { id } = req.params;

    //NOTE - Get adminuser details from admin table
    const roles_details = await RoleDetails.findOne({
      where: { id: id },
    });

    //NOTE: Finalizing the response
    const result = {
      id: roles_details.id,
      role: roles_details.role,
    };
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Update Roles by id
const updateRolesById = async (req, res) => {
  try {
    const ID = req.params.id;

    const { role } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    //NOTE - Get details from Permision Role table
    const role_details = await RoleDetails.findOne({
      where: { id: ID },
    });

    if (!role_details) {
      return res.status(200).send({ status: 200, message: msg.ID_NOT_FOUND });
    }

    let obj1 = {
      id: role_details.id,
      role: role_details.role,
    };

    let obj2 = {
      id: ID,
      role: role,
    };

    if (!_.isEqual(obj1, obj2)) {
      const getRoleDetails = await RoleDetails.findOne({
        where: {
          role: role,
        },
      });

      if (getRoleDetails) {
        return res.status(400).send({
          status: 400,
          message: msg.ROLE_ALREADY_EXIST,
        });
      }
    }

    //NOTE -  update Role in Permision Table
    await RoleDetails.update(
      { role: role, updatedById: token },
      { where: { id: role_details.id } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.ROLES_UPDATED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - delete Role
const deleteRoleById = async (req, res) => {
  try {
    const ID = req.params.id;
    const role_details = await RoleDetails.findOne({
      where: { id: ID },
    });

    if (!role_details) {
      return res.status(400).send({ status: 400, message: msg.INVALID_ROLE });
    }

    //NOTE - Destory data in Role table
    await role_details.destroy();

    return res
      .status(200)
      .send({ status: 200, id: role_details.id, message: msg.ROLES_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Get all Roles without super admin
const getPermissionRoles = async (req, res) => {
  try {
    //NOTE - Get details from Admin table
    const { count, rows } = await RoleDetails.findAndCountAll({
      where: {
        role: {
          [Op.ne]: "superAdmin", //NOTE: ne stands for "not equal"
        },
      },
      attributes: ["id", "role"],
      order: [["createdAt", "DESC"]],
    });

    //NOTE - Final data push
    const result = rows.map((data) => ({
      id: data.id,
      role: data.role,
    }));

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

module.exports = {
  createRoles,
  getAllPermissionRoles,
  getRolesById,
  updateRolesById,
  deleteRoleById,
  getPermissionRoles, //TODO - Will get data without superadmin
};
