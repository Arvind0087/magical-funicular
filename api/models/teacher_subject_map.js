const { INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const teacher_subject_map = Sequelize.define("teacher_subject_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    teacherId: {
      type: INTEGER,
    },
    courseId: {
      type: INTEGER,
    },
    boardId: {
      type: INTEGER,
    },
    classId: {
      type: INTEGER,
    },
    batchTypeId: {
      type: INTEGER,
    },
    batchStartDateId: {
      type: INTEGER,
    },
    subjectId: {
      type: INTEGER,
    },
  });

  return teacher_subject_map;
};
