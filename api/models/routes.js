const { INTEGER, STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const route = Sequelize.define("route", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    title: {
      type: STRING,
    },
    path: {
      type: STRING,
    },
    icon: {
      type: STRING,
    },
    parent: {
      type: STRING,
    },
  });

  return route;
};