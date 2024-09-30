const db = require("../../models/index");
const msg = require("../../constants/Messages");
const PageBackLink = db.pageBackLink;

const createPageBackLink = async (req, res) => {
  try {
    const { page, backLink ,webBackLink} = req.body;

    await PageBackLink.create({
      page: page,
      backLink: backLink,
      webBackLink:webBackLink
    });

    return res.status(200).send({
      status: 200,
      message: msg.PAGE_BACK_LINK_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get pageBackLink get by id
const getPageBackLinkById = async (req, res) => {
  try {
    const getPageBackLink = await PageBackLink.findOne({
      where: { id: req.params.id },
    });
    if (!getPageBackLink)
      return res
        .status(400)
        .send({ status: 400, message: msg.PAGE_BACK_LINK_NOT_FOUND });

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getPageBackLink,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all PageBackLink
const getAllPageBackLink = async (req, res) => {
  try {
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

    const getPageBackLink = await PageBackLink.findAndCountAll({
      ...query,
      order: [["createdAt", "DESC"]],
    });
    if (!getPageBackLink)
      return res
        .status(400)
        .send({ status: 400, message: msg.PAGE_BACK_LINK_NOT_FOUND });

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getPageBackLink.count,
      data: getPageBackLink.rows,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE - update links
const updateBackLinksById = async (req, res) => {
  try {
    const { page, backLink, webBackLink, id } = req.body;

    //NOTE - id from token
    const token = req.user.id;


    const getPageBackLink = await PageBackLink.findOne({
      where: { id: id },
    });
    if (!getPageBackLink) {
      return res
        .status(400)
        .send({ status: 400, message: msg.PAGE_BACK_LINK_NOT_FOUND });
    }

    await PageBackLink.update(
      {
        page: page,
        backLink: backLink,
        webBackLink: webBackLink,
        updatedById: token,
      },
      { where: { id: id } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.PAGE_BACK_LINK_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};



module.exports = {
  createPageBackLink,
  getPageBackLinkById,
  getAllPageBackLink,
  updateBackLinksById,
};
