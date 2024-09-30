const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const user_device_token = Sequelize.define("user_device_token", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    userId: {
      type: INTEGER,
    },
    deviceType:{
      type: STRING,
      validate: {
        isIn: [["Web", "Android", "Ios"]], // Allowed values
      },
    },
    andriodDeviceToken: {
      type: STRING,
    },
    iosDeviceToken: {
      type: STRING,
    },
    webToken: {
      type: STRING,
    },
  });

  return user_device_token;
};
