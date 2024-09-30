var CryptoJS = require("crypto-js");
const { config } = require("../config/db.config");

exports.encrypt = (data) => {
  const encrypt = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    config.CRYPTO_SECRET_KEY
  ).toString();
  return encrypt;
};

exports.decrypt = (data) => {
  const decrypt = CryptoJS.AES.decrypt(data, config.CRYPTO_SECRET_KEY).toString(
    CryptoJS.enc.Utf8
  );
  return decrypt;
};
