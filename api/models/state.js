const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const state = Sequelize.define("state", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return state;
};
