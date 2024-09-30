const { INTEGER, TIME, STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const zoom_teacher_map = Sequelize.define("zoom_teacher_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    teacherId: {
      type: INTEGER,
      allowNull: false,
    },
    zoom_api_key: {
      type: STRING,
    },
    zoom_api_secret: {
      type: STRING,
    },
    auth_api_key: {
      type: STRING,
    },
    auth_api_secret: {
      type: STRING,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return zoom_teacher_map;
};
