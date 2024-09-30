const { STRING, INTEGER, DATE, TEXT } = require("sequelize");

module.exports = (Sequelize) => {
  const login_user = Sequelize.define("login_user", {
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
  });

  return login_user;
};
