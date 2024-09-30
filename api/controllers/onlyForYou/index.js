const db = require("../../models/index");
const msg = require("../../constants/Messages");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const { getSignedUrlCloudFront } = require("../../helpers/cloudFront");
const { Op } = require("sequelize");
const OnlyForYou = db.onlyForYou;
const PageBackLink = db.pageBackLink;
const AdminUser = db.admin;
const RolePermission = db.permissionRole;

//ANCHOR:  create OnlyFor
const createOnlyForYou = async (req, res) => {
  try {
    const { image, title, description, buttonText, buttonLinkId, otherLink } =
      req.body;

    //NOTE - id from token
    const id = req.user.id;

    let payload = {
      title: title,
      description: description,
      buttonText: buttonText,
      buttonLinkId: buttonLinkId,
      otherLink: otherLink,
      createdById: id,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(
        image,
        msg.ONLY_FOR_YOU_FOLDER_CREATED,
        title
      );
      payload = { ...payload, image: uploadImage.Key };
    }

    const newOnlyForYou = new OnlyForYou(payload);
    await newOnlyForYou.save();

    return res.status(200).send({
      status: 200,
      message: msg.ONLY_FOR_YOU_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get Only For you
const getOnlyForYouById = async (req, res) => {
  try {
    const getOnlyForYou = await OnlyForYou.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: PageBackLink,
          attributes: ["backLink", "webBackLink"],
        },
      ],
    });
    if (!getOnlyForYou)
      return res
        .status(400)
        .send({ status: 400, message: msg.ONLY_FOR_YOU_NOT_FOUND });

    let final = {
      id: getOnlyForYou.id,
      image: getOnlyForYou.image
        ? await getSignedUrlCloudFront(getOnlyForYou.image)
        : null,
      title: getOnlyForYou.title,
      description: getOnlyForYou.description,
      buttonText: getOnlyForYou.buttonText,
      buttonLinkId: getOnlyForYou.buttonLinkId,
      buttonLink: getOnlyForYou?.pageBackLink?.backLink,
      webBackLink: getOnlyForYou?.pageBackLink?.webBackLink,
      otherLink: getOnlyForYou.otherLink ? getOnlyForYou.otherLink : null,
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

//ANCHOR : get all only for you
const getAllOnlyForYou = async (req, res) => {
  try {
    let getAllOnlyFor = [];
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
          { title: search },
          { title: { [Op.like]: "%" + search + "%" } },
        ],
      };
    }

    //NOTE - Get only for you
    const getOnlyFor = await OnlyForYou.findAndCountAll({
      ...query,
      where: { ...val },
      include: [
        {
          model: PageBackLink,
          attributes: ["backLink", "webBackLink"],
        },
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
    if (!getOnlyFor)
      return res
        .status(400)
        .send({ status: 400, message: msg.ONLY_FOR_YOU_NOT_FOUND });

    for (const allOnlyFor of getOnlyFor.rows) {
      //NOTE - Push final data
      getAllOnlyFor.push({
        id: allOnlyFor.id,
        image: allOnlyFor.dataValues.image
          ? await getSignedUrlCloudFront(allOnlyFor.dataValues.image)
          : null,
        title: allOnlyFor.title,
        description: allOnlyFor.description,
        buttonText: allOnlyFor.buttonText,
        buttonLink: allOnlyFor.buttonLink,
        buttonLinkId: allOnlyFor.buttonLinkId,
        buttonLink: allOnlyFor.pageBackLink?.backLink,
        webBackLink: allOnlyFor?.pageBackLink?.webBackLink,
        otherLink: allOnlyFor.otherLink ? allOnlyFor.otherLink : null,
        status: allOnlyFor.status === 1 ? "Active" : "InActive",
        createdByName: allOnlyFor.creator ? allOnlyFor.creator?.name : null,
        createdByRole: allOnlyFor.creator
          ? allOnlyFor.creator?.permission_role?.role
          : null,
        updateByName: allOnlyFor.updater ? allOnlyFor.updater?.name : null,
        updateByRole: allOnlyFor.updater
          ? allOnlyFor.updater?.permission_role.role
          : null,
      });
    }
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getOnlyFor.count,
      data: getAllOnlyFor,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : update OnlyFor You
const updateOnlyForYouById = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      buttonText,
      buttonLinkId,
      otherLink,
      Id,
    } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    const getOnlyFor = await OnlyForYou.findOne({
      where: { id: Id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!getOnlyFor)
      return res
        .status(400)
        .send({ status: 400, message: msg.ONLY_FOR_YOU_NOT_FOUND });

    let payload = {
      title: title,
      description: description,
      buttonText: buttonText,
      otherLink: otherLink,
      buttonLinkId: buttonLinkId,
      updatedById: id,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(
        image,
        msg.ONLY_FOR_YOU_FOLDER_CREATED,
        title
      );
      payload = { ...payload, image: uploadImage.Key };
    }

    await OnlyForYou.update(payload, {
      where: { id: Id },
    });

    return res.status(200).send({
      status: 200,
      message: msg.ONLY_FOR_YOU_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - only for you Delete
const deleteOnlyForYou = async (req, res) => {
  try {
    const getOnlyFor = await OnlyForYou.findOne({
      where: { id: req.params.id },
    });
    if (!getOnlyFor)
      return res
        .status(400)
        .send({ status: 400, message: msg.ONLY_FOR_YOU_NOT_FOUND });

    await OnlyForYou.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({
      status: 200,
      message: msg.ONLY_FOR_YOU_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all active only for you (use in mobile and web)
const getActiveOnlyForYou = async (req, res) => {
  try {
    let result = [];

    //NOTE - Get only for you
    const getAllData = await OnlyForYou.findAll({
      where: { status: 1 },
      include: [
        {
          model: PageBackLink,
          attributes: ["backLink", "webBackLink"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!getAllData)
      return res
        .status(400)
        .send({ status: 400, message: msg.ONLY_FOR_YOU_NOT_FOUND });

    for (const allOnlyFor of getAllData) {
      //NOTE - Push final data
      result.push({
        id: allOnlyFor.id,
        image: allOnlyFor.dataValues.image
          ? await getSignedUrlCloudFront(allOnlyFor.dataValues.image)
          : null,
        title: allOnlyFor.title,
        description: allOnlyFor.description,
        buttonText: allOnlyFor.buttonText,
        buttonLink: allOnlyFor.buttonLink,
        buttonLinkId: allOnlyFor.buttonLinkId,
        buttonLink: allOnlyFor.pageBackLink?.backLink,
        webBackLink: allOnlyFor?.pageBackLink?.webBackLink,
        otherLink: allOnlyFor.otherLink ? allOnlyFor.otherLink : null,
      });
    }
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - change the status of only for you
const changeOnlyForYouStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    //NOTE - id from token
    const userId = req.user.id;

    //NOTE - find data from the table
    const getOnlyFor = await OnlyForYou.findOne({
      where: { id: id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!getOnlyFor)
      return res
        .status(400)
        .send({ status: 400, message: msg.ONLY_FOR_YOU_NOT_FOUND });

    //NOTE - update the status
    await OnlyForYou.update(
      {
        status: status,
        updatedById: userId,
      },
      {
        where: { id: getOnlyFor.id },
      }
    );

    return res.status(200).send({
      status: 200,
      message: msg.STATUS_UPDATED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

module.exports = {
  createOnlyForYou,
  getOnlyForYouById,
  getAllOnlyForYou, //TODO - use in admin panel
  updateOnlyForYouById,
  deleteOnlyForYou,
  getActiveOnlyForYou, //TODO - Use in mobile and web screen
  changeOnlyForYouStatus, //TODO - use in admin panel
};
