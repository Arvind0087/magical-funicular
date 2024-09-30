const db = require("../../models/index");
const msg = require("../../constants/Messages");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const getSignedUrl = require("../../helpers/getSignedUrl");
const {
  getSignedUrlCloudFront,
  getYouTubeVideoId,
} = require("../../helpers/cloudFront");
const { Op } = require("sequelize");
const MentorshipHelp = db.mentorshipHelp;
const AdminUser = db.admin;
const RolePermission = db.permissionRole;
const Setting = db.setting;

//ANCHOR : create mentorship
const createMentorshipHelp = async (req, res) => {
  try {
    const { title, image, description, type } = req.body;
    //NOTE - id from token
    const id = req.user.id;

    let payload = {
      title: title,
      description: description,
      type: type,
      createdById: id,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(
        image,
        msg.MENTORSHIP_FOLDER_CREATED,
        type
      );
      payload = { ...payload, image: uploadImage.Key };
    }

    const NewMentorshipHelp = new MentorshipHelp(payload);
    await NewMentorshipHelp.save();
    return res.status(200).send({
      status: 200,
      message: msg.MENTORSHIPHELP_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : create mentorship
const createMentorshipWhyNeed = async (req, res) => {
  try {
    const { title, image, description, type } = req.body;
    //NOTE - id from token
    const id = req.user.id;

    let payload = {
      title: title,
      description: description,
      type: type,
      createdById: id,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(
        image,
        msg.MENTORSHIP_FOLDER_CREATED,
        type
      );
      payload = { ...payload, image: uploadImage.Key };
    }

    const NewMentorshipHelp = new MentorshipHelp(payload);
    await NewMentorshipHelp.save();
    return res.status(200).send({
      status: 200,
      message: msg.MENTORSHIPWHYNEED_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : create mentorship
const createMentorshipFeature = async (req, res) => {
  try {
    const { title, image, description, type } = req.body;
    //NOTE - id from token
    const id = req.user.id;

    let payload = {
      title: title,
      description: description,
      type: type,
      createdById: id,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(
        image,
        msg.MENTORSHIP_FOLDER_CREATED,
        title
      );
      payload = { ...payload, image: uploadImage.Key };
    }

    const NewMentorshipHelp = new MentorshipHelp(payload);
    await NewMentorshipHelp.save();
    return res.status(200).send({
      status: 200,
      message: msg.MENTORSHIPFEATURE_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get MentorshipHelp by id
const getMentorshipHelpById = async (req, res) => {
  try {
    const getMentorshipHelp = await MentorshipHelp.findOne({
      where: { id: req.params.id },
    });
    if (!getMentorshipHelp)
      return res
        .status(400)
        .send({ status: 400, message: msg.MENTORSHIPHELP_NOT_FOUND });

    getMentorshipHelp.image = await getSignedUrlCloudFront(
      getMentorshipHelp.dataValues.image
    );
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getMentorshipHelp,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all MentorshipHelp
const getAllMentorshipHelp = async (req, res) => {
  try {
    let getAllMentorshipHelp = [];
    const { page, limit, type, search } = req.query;

    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    let final = {};
    if (type) {
      final = {
        type: type,
      };
    }

    if (search) {
      final = {
        ...final,
        [Op.or]: [
          { title: search },
          { title: { [Op.like]: "%" + search + "%" } },
        ],
      };
    }

    const getMentorshipHelp = await MentorshipHelp.findAndCountAll({
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
    if (!getMentorshipHelp)
      return res
        .status(400)
        .send({ status: 400, message: msg.MENTORSHIPHELP_NOT_FOUND });

    for (const allMentorshipHelp of getMentorshipHelp.rows) {
      const image = await getSignedUrlCloudFront(
        allMentorshipHelp.dataValues.image
      );
      getAllMentorshipHelp.push({
        id: allMentorshipHelp.id,
        title: allMentorshipHelp.title,
        image: image,
        description: allMentorshipHelp.description,
        type: allMentorshipHelp.type,
        createdByName: allMentorshipHelp.creator
          ? allMentorshipHelp.creator?.name
          : null,
        createdByRole: allMentorshipHelp.creator
          ? allMentorshipHelp.creator?.permission_role?.role
          : null,
        updateByName: allMentorshipHelp.updater
          ? allMentorshipHelp.updater?.name
          : null,
        updateByRole: allMentorshipHelp.updater
          ? allMentorshipHelp.updater?.permission_role.role
          : null,
      });
    }
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getMentorshipHelp.count,
      data: getAllMentorshipHelp,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : update MentorshipHelp
const updateMentorshipHelpById = async (req, res) => {
  try {
    const { title, image, description, mentorshipId, type } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    const getMentorshipHelp = await MentorshipHelp.findOne({
      where: { id: mentorshipId },
    });
    if (!getMentorshipHelp)
      return res
        .status(400)
        .send({ status: 400, message: msg.MENTORSHIPHELP_NOT_FOUND });

    let payload = {
      title: title,
      description: description,
      updatedById: id,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(
        image,
        msg.MENTORSHIP_FOLDER_CREATED,
        title
      );
      payload = { ...payload, image: uploadImage.Key };
    }

    await MentorshipHelp.update(payload, {
      where: { id: mentorshipId, type: type },
    });

    return res.status(200).send({
      status: 200,
      message: msg.MENTORSHIPHELP_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : update MentorshipHelp feature
const updateMentorshipFeatureById = async (req, res) => {
  try {
    const { title, image, description, mentorshipId, type } = req.body;

    //NOTE - id from token
    const id = req.user.id;
    const getMentorshipHelp = await MentorshipHelp.findOne({
      where: { id: mentorshipId },
    });
    if (!getMentorshipHelp)
      return res
        .status(400)
        .send({ status: 400, message: msg.MENTORSHIPHELP_NOT_FOUND });

    let payload = {
      title: title,
      description: description,
      updatedById: id,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(
        image,
        msg.MENTORSHIP_FOLDER_CREATED,
        title
      );
      payload = { ...payload, image: uploadImage.Key };
    }

    await MentorshipHelp.update(payload, {
      where: { id: mentorshipId, type: type },
    });

    return res.status(200).send({
      status: 200,
      message: msg.MENTORSHIPFEATURE_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : update MentorshipHelp WHY you NeeD Mentor
const updateMentorshipWhyYouNeedById = async (req, res) => {
  try {
    const { title, image, description, mentorshipId, type } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    const getMentorshipHelp = await MentorshipHelp.findOne({
      where: { id: mentorshipId },
    });
    if (!getMentorshipHelp)
      return res
        .status(400)
        .send({ status: 400, message: msg.MENTORSHIPHELP_NOT_FOUND });

    let payload = {
      title: title,
      description: description,
      updatedById: id,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(
        image,
        msg.MENTORSHIP_FOLDER_CREATED,
        title
      );
      payload = { ...payload, image: uploadImage.Key };
    }

    await MentorshipHelp.update(payload, {
      where: { id: mentorshipId, type: type },
    });

    return res.status(200).send({
      status: 200,
      message: msg.MENTORSHIPWHYNEED_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete MentorshipHelp
const deleteMentorshipHelpById = async (req, res) => {
  try {
    const getMentorshipHelp = await MentorshipHelp.findOne({
      where: { id: req.params.id },
    });
    if (!getMentorshipHelp)
      return res
        .status(400)
        .send({ status: 400, message: msg.MENTORSHIPHELP_NOT_FOUND });

    await MentorshipHelp.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res
      .status(200)
      .send({ status: 200, message: msg.MENTORSHIPHELP_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete Mentorship feature
const deleteMentorshipFeatureById = async (req, res) => {
  try {
    const getMentorshipHelp = await MentorshipHelp.findOne({
      where: { id: req.params.id },
    });
    if (!getMentorshipHelp) {
      return res
        .status(400)
        .send({ status: 400, message: msg.MENTORSHIPHELP_NOT_FOUND });
    }
    await MentorshipHelp.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res
      .status(200)
      .send({ status: 200, message: msg.MENTORSHIPFEATURE_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete Mentorship why you need mentor
const deleteMentorshipWhyYouNeedById = async (req, res) => {
  try {
    const getMentorshipHelp = await MentorshipHelp.findOne({
      where: { id: req.params.id },
    });
    if (!getMentorshipHelp) {
      return res
        .status(400)
        .send({ status: 400, message: msg.MENTORSHIPHELP_NOT_FOUND });
    }
    await MentorshipHelp.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res
      .status(200)
      .send({ status: 200, message: msg.MENTORSHIPWHYNEED_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};





//ANCHOR : get all MentorshipHelp
const getMentorshipHelpForMobile = async (req, res) => {
  try {
    let getAllMentorshipHelp = [];
    const {  type} = req.query;

    
    let final = {};
    if (type) {
      final = {
        type: type,
      };
    }

    //NOTE - mentor data
    const mentor = await Setting.findOne({
      where: {
        type: "mentor",
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

   

    const getMentorshipHelp = await MentorshipHelp.findAndCountAll({
      where: final,
      order: [["createdAt", "DESC"]],
    });
    if (!getMentorshipHelp)
      return res
        .status(400)
        .send({ status: 400, message: msg.MENTORSHIPHELP_NOT_FOUND });

    for (const allMentorshipHelp of getMentorshipHelp.rows) {
      const image = await getSignedUrlCloudFront(
        allMentorshipHelp.dataValues.image
      );
    
      getAllMentorshipHelp.push({
        id: allMentorshipHelp.id,
        title: allMentorshipHelp.title,
        image: image,
        description: allMentorshipHelp.description,
        type: allMentorshipHelp.type,
      });
    }

    
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getMentorshipHelp.count,
      data: {price: mentor?.amount!==null?mentor?.amount:null,data:getAllMentorshipHelp},
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createMentorshipHelp,
  createMentorshipWhyNeed,
  createMentorshipFeature,
  getMentorshipHelpById,
  getAllMentorshipHelp,
  updateMentorshipHelpById,
  updateMentorshipFeatureById,
  updateMentorshipWhyYouNeedById,
  deleteMentorshipHelpById,
  deleteMentorshipFeatureById,
  deleteMentorshipWhyYouNeedById,
  getMentorshipHelpForMobile
};
