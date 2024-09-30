const db = require("../../models/index");
const msg = require("../../constants/Messages");
const zoomTeacherMap = db.zoom_teacher_map;
const Admin = db.admin;
const RolePermission = db.permissionRole;

//NOTE - Add and Update zoom key and secret
const addZoomCredential = async (req, res) => {
  try {
    const {
      teacherId,
      zoom_api_key,
      zoom_api_secret,
      auth_api_key,
      auth_api_secret,
    } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    const getCredential = await zoomTeacherMap.findOne({
      where: { teacherId: teacherId },
    });
    if (getCredential) {
      return res.status(400).send({
        status: 400,
        message: msg.ZOOM_CREDENTIAL_ALREADY_EXIST,
      });
    }

    await zoomTeacherMap.create({
      teacherId: teacherId,
      zoom_api_key: zoom_api_key,
      zoom_api_secret: zoom_api_secret,
      auth_api_key: auth_api_key,
      auth_api_secret: auth_api_secret,
      createdById: token,
    });

    return res.status(200).send({
      status: 200,
      message: msg.ZOOM_CREDENTIAL_ADDED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE- get zoom credential by user id
const getZoomCredentialByTeacherId = async (req, res) => {
  try {
    const { teacherId } = req.query;
    const getData = await zoomTeacherMap.findOne({
      where: { teacherId: teacherId },
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
    });
    if (!getData) {
      return res
        .status(400)
        .send({ status: 400, message: msg.ZOOM_CREDENTIAL_NOT_FOUND });
    }

    //NOTE - find admin teacher
    const getAdmin = await Admin.findOne({
      where: { id: getData.teacherId },
    });

    let final = {
      id: getData.id,
      teacherId: getData.teacherId,
      name: getAdmin.name,
      zoom_api_key: getData.zoom_api_key,
      zoom_api_secret: getData.zoom_api_secret,
      auth_api_key: getData.auth_api_key,
      auth_api_secret: getData.auth_api_secret,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: final,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE - get all credential
const getAllCredential = async (req, res) => {
  try {
    let getAllCredential = [];
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

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (!["admin", "superAdmin"].includes(req.user?.role)) {
        //NOTE - Get  User details from token
        const getAdmin = await Admin.findOne({
          where: { id: req.user.id },
        });
        params = {
          teacherId: req.user.id,
        };
      }

    //NOTE - get all zoom credential
    const getCredential = await zoomTeacherMap.findAndCountAll({
      ...query,
      where: params, //NOTE - teacher filter
      include: [
        {
          model: Admin,
          as: "creator",
          attributes: ["id", "name"],
          include: {
            model: RolePermission,
            attributes: ["role"],
          },
        },
        {
          model: Admin,
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
    if (!getCredential) {
      return res
        .status(400)
        .send({ status: 400, message: msg.ZOOM_CREDENTIAL_NOT_FOUND });
    }

    for (const Credential of getCredential.rows) {
      //NOTE - find admin teacher
      const getAdmin = await Admin.findOne({
        where: { id: Credential.teacherId },
      });

      getAllCredential.push({
        id: Credential.id,
        teacherId: Credential.teacherId,
        name: getAdmin.name,
        zoom_api_key: Credential.zoom_api_key,
        zoom_api_secret: Credential.zoom_api_secret,
        auth_api_key: Credential.auth_api_key,
        auth_api_secret: Credential.auth_api_secret,
        createdByName: Credential.creator ? Credential.creator?.name : null,
        createdByRole: Credential.creator
          ? Credential.creator?.permission_role?.role
          : null,
        updateByName: Credential.updater ? Credential.updater?.name : null,
        updateByRole: Credential.updater
          ? Credential.updater?.permission_role.role
          : null,
      });
    }
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getAllCredential.count,
      data: getAllCredential,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - update credential
const updateCredentialById = async (req, res) => {
  try {
    const {
      id,
      teacherId,
      zoom_api_key,
      zoom_api_secret,
      auth_api_key,
      auth_api_secret,
    } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    const getCredential = await zoomTeacherMap.findOne({
      where: { id: id, teacherId: teacherId },
    });

    if (!getCredential)
      return res
        .status(400)
        .send({ status: 400, message: msg.ZOOM_CREDENTIAL_NOT_FOUND });

    await zoomTeacherMap.update(
      {
        teacherId: teacherId,
        zoom_api_key: zoom_api_key,
        zoom_api_secret: zoom_api_secret,
        auth_api_key: auth_api_key,
        auth_api_secret: auth_api_secret,
        updatedById: token,
      },
      { where: { id: id, teacherId: teacherId } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.ZOOM_CREDENTIAL_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE- delete credential
const deleteCredentialByTeacherId = async (req, res) => {
  try {
    const getCredential = await zoomTeacherMap.findOne({
      where: { id: req.params.id },
    });
    if (!getCredential) {
      return res
        .status(400)
        .send({ status: 400, message: msg.ZOOM_CREDENTIAL_NOT_FOUND });
    }

    await zoomTeacherMap.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({ status: 200, message: msg.ZOOM_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  addZoomCredential,
  getZoomCredentialByTeacherId,
  getAllCredential,
  deleteCredentialByTeacherId,
  updateCredentialById,
};
