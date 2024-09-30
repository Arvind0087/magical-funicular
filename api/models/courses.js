const { STRING, INTEGER, DATE, TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
  const courses = Sequelize.define("courses", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    image: {
      type: STRING,
      allowNull: false,
    },
    shortDescription: {
      type: STRING,
      allowNull: false,
    },
    list: {
      type: STRING,
      allowNull: false,
    },
    status: {
      type: TINYINT,
      defaultValue: 1,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return courses;
};
