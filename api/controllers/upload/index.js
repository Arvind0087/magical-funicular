const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { getSignedUrlCloudFront } = require("../../helpers/cloudFront");
const upload = db.upload;
const AdminUser = db.admin;
const RolePermission = db.permissionRole;
const { Op } = require("sequelize");

//NOTE: upload urls
const uploadUrl = async (req, res) => {
  try {
    const { title, multiple, source } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    //NOTE -  upload multiple url
    for (let data of multiple) {
      await upload.create({
        title: data.label,
        url: data.value,
        createdById: token,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.URL_UPLOAD,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE : get all upload file
const getUrlById = async (req, res) => {
  try {
    const getUpload = await upload.findOne({
      where: { id: req.params.id },
    });
    if (!getUpload) {
      return res.status(400).send({ status: 400, message: msg.URL_NOT_FOUND });
    }

    let url;
    if (["https://youtu.be/"].includes(getUpload?.url)) {
      url = getUpload?.url;
    } else {
      url = await getSignedUrlCloudFront(getUpload?.url);
    }

    let final = {
      title: getUpload?.title,
      //source: getUpload.source,
      url: url,
      location: getUpload.url,
      date: getUpload.createdAt,
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

//NOTE: get all url
const getAllUrl = async (req, res) => {
  try {
    let getAllUrl = [];
    const { page, limit, title } = req.query;

    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE - filter title
    let val = {};
    if (title) {
      val = {
        title: { [Op.like]: "%" + title + "%" },
      };
    }

    const getUrl = await upload.findAndCountAll({
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

      order: [["createdAt", "DESC"]],
    });

    if (!getUrl) {
      return res.status(400).send({ status: 400, message: msg.URL_NOT_FOUND });
    }

    for (const allUrl of getUrl.rows) {
      let url;
      if (["https://youtu.be/"].includes(allUrl?.url)) {
        url = allUrl?.url;
      } else {
        url = await getSignedUrlCloudFront(allUrl?.url);
      }

      getAllUrl.push({
        id: allUrl.id,
        title: allUrl?.title,
        //source: allUrl?.source,
        url: url,
        location: allUrl.url,
        date: allUrl.createdAt,
        createdByName: allUrl.creator ? allUrl.creator?.name : null,
        createdByRole: allUrl.creator
          ? allUrl.creator?.permission_role?.role
          : null,
        updateByName: allUrl.updater ? allUrl.updater?.name : null,
        updateByRole: allUrl.updater
          ? allUrl.updater?.permission_role.role
          : null,
      });
    }
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getUrl.count,
      data: getAllUrl,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE - update url
const updateUrlById = async (req, res) => {
  try {
    const { title, multiple, source, id } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    const getUrl = await upload.findOne({
      where: { id: id },
    });
    if (!getUrl) {
      return res.status(400).send({ status: 400, message: msg.URL_NOT_FOUND });
    }

    for (let data of multiple) {
      await upload.create({
        title: data.label,
        url: data.value,
        updatedById: token,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.URL_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE : delete url
const deleteUrlById = async (req, res) => {
  try {
    const getUrl = await upload.findOne({
      where: { id: req.params.id },
    });
    if (!getUrl) {
      return res.status(400).send({ status: 400, message: msg.URL_NOT_FOUND });
    }
    await upload.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({ status: 200, message: msg.URL_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  uploadUrl,
  getAllUrl,
  getUrlById,
  updateUrlById,
  deleteUrlById,
};
