const db = require("../../models/index");
const msg = require("../../constants/Messages");
const Activity = db.activity;
const UserDetails = db.users;

//ANCHOR : create Activity
const createActivity = async (req, res) => {
  try {
    const { userId, module, activityName } = req.body;

    await Activity.create({
      userId: userId,
      module: module,
      activityName: activityName,
    });

    return res.status(200).send({
      status: 200,
      message: msg.ACTIVITY_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all Activity
const getAllActivity = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    //NOTE -if pagination
    const query = {
      offset: Number((page || 1) - 1) * Number(limit || 20),
      limit: Number(limit || 20),
    };

    //NOTE - filter based on id
    const val = search ? { id: search } : {};

    //NOTE - get all Activity
    const { count, rows } = await Activity.findAndCountAll({
      ...query,
      include: [{ model: UserDetails, attributes: ["id", "name"], where: val }],
      order: [["createdAt", "DESC"]],
    });

    if (!rows)
      return res
        .status(400)
        .send({ status: 400, message: msg.ACTIVITY_NOT_FOUND });

    //NOTE - push final result
    const response = rows.map((data) => ({
      id: data.id,
      userId: data?.userId,
      user: data.user?.name,
      module: data.module,
      activityName: data?.activityName,
    }));
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: response,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get Activity  by id
const getActivityById = async (req, res) => {
  try {
    const getActivity = await Activity.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ["updatedAt"],
      },
      include: {
        model: UserDetails,
        attributes: ["name"],
      },
    });

    if (!getActivity)
      return res
        .status(400)
        .send({ status: 400, message: msg.ACTIVITY_NOT_FOUND });

    //NOTE - push final data
    const activity = {
      id: getActivity.id,
      userId: getActivity.userId,
      user: getActivity.user?.name,
      module: getActivity.module,
      activityName: getActivity.activityName,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: activity,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get Activity  by student id
const getActivityByStudentId = async (req, res) => {
  try {
    const getActivity = await Activity.findAll({
      where: { userId: req.params.id },
      attributes: {
        exclude: ["updatedAt"],
      },
      include: {
        model: UserDetails,
        attributes: ["name"],
      },
    });

    if (!getActivity)
      return res
        .status(400)
        .send({ status: 400, message: msg.ACTIVITY_NOT_FOUND });

    let activity = [];
    for (let data of getActivity) {
      activity.push({
        id: data.id,
        userId: data.userId,
        user: data.user?.name,
        module: data.feedback,
        activityName: data.activityName,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: activity,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : update Activity
const updateActivityById = async (req, res) => {
  try {
    const { module, activityName, activityId } = req.body;

    const getActivity = await Activity.findOne({
      where: { id: activityId },
    });

    if (!getActivity) {
      return res
        .status(400)
        .send({ status: 400, message: msg.ACTIVITY_NOT_FOUND });
    }

    await Activity.update(
      { module: module, activityName: activityName },
      { where: { id: activityId } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.ACTIVITY_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete Activity
const deleteActivityById = async (req, res) => {
  try {
    const getActivity = await Activity.findOne({
      where: { id: req.params.id },
    });
    if (!getActivity) {
      return res
        .status(400)
        .send({ status: 400, message: msg.ACTIVITY_NOT_FOUND, data: [] });
    }
    await Activity.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).send({ status: 200, message: msg.ACTIVITY_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createActivity,
  getAllActivity,
  getActivityById,
  updateActivityById,
  deleteActivityById,
  getActivityByStudentId,
};
