const db = require("../../models/index");
const msg = require("../../constants/Messages");
const internalSetting = db.internalSetting;
const Admin = db.admin;

//ANCHOR: create internalSetting
const createInternalSetting = async (req, res) => {
  try {
    const {
      userId,
      themeColorPresents,
      themeContrast,
      themeDirection,
      themeLayout,
      themeMode,
      themeStretch,
      dense,
    } = req.body;

    const getInternalSettings = await internalSetting.findOne({
      where: { userId: userId },
    });

    if (getInternalSettings) {
      await internalSetting.update(
        {
          themeColorPresents: themeColorPresents,
          themeContrast: themeContrast,
          themeDirection: themeDirection,
          themeLayout: themeLayout,
          themeMode: themeMode,
          themeStretch: themeStretch,
          dense: dense,
        },
        {
          where: {
            userId: userId,
            id: getInternalSettings.id,
          },
        }
      );
    } else {
      await internalSetting.create({
        userId: userId,
        themeColorPresents: themeColorPresents,
        themeContrast: themeContrast,
        themeDirection: themeDirection,
        themeLayout: themeLayout,
        themeMode: themeMode,
        themeStretch: themeStretch,
        dense: dense,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.INTERNAL_SETTING_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get internalSetting by userId
const getInternalSettingByUserId = async (req, res) => {
  try {
    const { userId } = req.query;
    const getInternalSetting = await internalSetting.findOne({
      where: { userId: userId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: Admin,
        attributes: ["id", "name"],
      },
    });
    if (!getInternalSetting)
      return res
        .status(200)
        .send({ status: 200, message: msg.INTERNAL_SETTING_NOT_FOUND });

    let result = {
      id: getInternalSetting.id,
      userId: getInternalSetting.userId,
      user: getInternalSetting.adminUser?.name,
      themeColorPresents: getInternalSetting.themeColorPresents,
      themeContrast: getInternalSetting.themeContrast,
      themeDirection: getInternalSetting.themeDirection,
      themeLayout: getInternalSetting.themeLayout,
      themeMode: getInternalSetting.themeMode,
      themeMode: getInternalSetting.themeMode,
      themeStretch: getInternalSetting.themeStretch,
      dense: getInternalSetting.dense,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//ANCHOR : update internalSetting
const updateInternalSettingByUserId = async (req, res) => {
  try {
    const {
      userId,
      themeColorPresents,
      themeContrast,
      themeDirection,
      themeLayout,
      themeMode,
      themeStretch,
      dense,
    } = req.body;
    const getInternalSetting = await internalSetting.findOne({
      where: { userId: userId },
    });
    if (!getInternalSetting)
      return res
        .status(400)
        .send({ status: 400, message: msg.INTERNAL_SETTING_NOT_FOUND });

    await internalSetting.update(
      {
        themeColorPresents: themeColorPresents,
        themeContrast: themeContrast,
        themeDirection: themeDirection,
        themeLayout: themeLayout,
        themeMode: themeMode,
        themeStretch: themeStretch,
        dense: dense,
      },
      { where: { userId: userId } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.INTERNAL_SETTING_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createInternalSetting,
  getInternalSettingByUserId,
  updateInternalSettingByUserId,
};
