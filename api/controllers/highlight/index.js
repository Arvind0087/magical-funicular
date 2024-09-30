const db = require("../../models/index");
const msg = require("../../constants/Messages");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const getSignedUrl = require("../../helpers/getSignedUrl");
const { Op } = require("sequelize");
const Highlight = db.highlight;
const AdminUser = db.admin;
const RolePermission = db.permissionRole;

//ANCHOR : create Highlight
const createHighlight = async (req, res) => {
  try {
    const { title, image, description } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    let payload = {
      title: title,
      description: description,
      createdById: id,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(
        image,
        msg.HIGHLIGHT_FOLDER_CREATED
      );
      payload = { ...payload, image: uploadImage.Key };
    } else {
      return res
        .status(500)
        .send({ status: 500, message: "Image is required" });
    }

    const Highlights = new Highlight(payload);
    await Highlights.save();

    return res.status(200).send({
      status: 200,
      message: msg.HIGHLIGHT_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get one Highlight
const getHighlightById = async (req, res) => {
  try {
    const highlights = await Highlight.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: { id: req.params.id },
    });
    if (!highlights)
      return res
        .status(400)
        .send({ status: 400, message: msg.HIGHLIGHT_NOT_FOUND });

    highlights.image = await getSignedUrl(highlights.dataValues?.image);

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: highlights,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all Highlight
const getAllHighlight = async (req, res) => {
  try {
    let getAllHighlight = [];
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
          { title: search },
          { title: { [Op.like]: "%" + search + "%" } },
        ],
      };
    }

    const Highlights = await Highlight.findAndCountAll({
      ...query,
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
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
      order: [["createdAt", "DESC"]],
    });

    if (!Highlights)
      return res
        .status(400)
        .send({ status: 400, message: msg.HIGHLIGHT_NOT_FOUND });

    for (const allHighlights of Highlights.rows) {
      const image = await getSignedUrl(allHighlights.dataValues?.image);
      getAllHighlight.push({
        id: allHighlights.id,
        title: allHighlights?.title,
        description: allHighlights?.description,
        image: image,
        createdByName: allHighlights.creator
          ? allHighlights.creator?.name
          : null,
        createdByRole: allHighlights.creator
          ? allHighlights.creator?.permission_role?.role
          : null,
        updateByName: allHighlights.updater
          ? allHighlights.updater?.name
          : null,
        updateByRole: allHighlights.updater
          ? allHighlights.updater?.permission_role.role
          : null,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: Highlights.count,
      data: getAllHighlight,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : update highlight
const updateHighlightById = async (req, res) => {
  try {
    let { title, image, description, highlightId } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    const Highlights = await Highlight.findOne({
      where: { id: highlightId },
    });

    if (!Highlights)
      return res
        .status(400)
        .send({ status: 400, message: msg.HIGHLIGHT_NOT_FOUND });

    let payload = {
      title: title,
      description: description,
      updatedById: id,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(
        image,
        msg.HIGHLIGHT_FOLDER_CREATED
      );
      payload = { ...payload, image: uploadImage.Key };
    }

    await Highlight.update(payload, {
      where: { id: highlightId },
    });

    return res.status(200).send({
      status: 200,
      message: msg.HIGHLIGHT_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete Highlight
const deleteHighlight = async (req, res) => {
  try {
    const Highlights = await Highlight.findOne({
      where: { id: req.params.id },
    });
    if (!Highlights)
      return res
        .status(400)
        .send({ status: 400, message: msg.HIGHLIGHT_NOT_FOUND });

    await Highlight.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res
      .status(200)
      .send({ status: 200, message: msg.HIGHLIGHT_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createHighlight,
  getHighlightById,
  getAllHighlight,
  updateHighlightById,
  deleteHighlight,
};
