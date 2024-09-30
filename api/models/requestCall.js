const { STRING, INTEGER, BOOLEAN } = require("sequelize");

module.exports = (Sequelize) => {
  const requestCall = Sequelize.define("requestCall", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: INTEGER,
      allowNull: false,
    },
    message: {
      type: STRING,
    },
  });

  return requestCall;
};
