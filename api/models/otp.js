const { STRING, INTEGER, DATE, TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
  const otp = Sequelize.define("otp", {
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
    phone: {
      type: STRING,
    },
    email:{
      type: STRING,
    },
    type:{
      type: STRING,
    },
    otp: {
      type: STRING,
    },
    expiryTime: {
      type: DATE,
    },
    status: {
      type: TINYINT,
    },
    verified: {
      type: TINYINT,
    },
  });

  return otp;
};
