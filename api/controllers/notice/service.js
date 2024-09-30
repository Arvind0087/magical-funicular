const db = require("../../models/index");
const DeviceToken = db.user_device_token;

const getFcmToken = async (id, deviceType) => {
  const checkDeviceToken = await DeviceToken.findOne({
    where: { userId: id },
  });
  if (["Web"].includes(deviceType)) {
    return checkDeviceToken.webToken;
  } else if (["Android"].includes(deviceType)) {
    return checkDeviceToken.andriodDeviceToken;
  } else if (["Ios"].includes(deviceType)) {
    return checkDeviceToken.iosDeviceToken;
  }
};

function removeHtmlTags(str) {
  if (!str || typeof str !== "string") {
    return "";
  }
  return str.replace(/<\/?[^>]+(>|$)/g, "");
}


module.exports = {
  getFcmToken,
  removeHtmlTags
};
