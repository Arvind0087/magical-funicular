const { STRING, INTEGER, BOOLEAN } = require("sequelize");

module.exports = (Sequelize) => {
  const shorts_course_map = Sequelize.define("shorts_course_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    shortsId: {
      type: INTEGER,
      allowNull: false,
    },
    courseId: {
      type: INTEGER,
      allowNull: false,
    },
    boardId: {
      type: INTEGER,
      allowNull: false,
    },
    classId: {
      type: INTEGER,
      allowNull: false,
    },
    batchTypeId: {
      type: INTEGER,
      allowNull: false,
    },
    subjectId: {
      type: INTEGER,
      allowNull: false,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return shorts_course_map;
};
