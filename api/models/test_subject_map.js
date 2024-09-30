const { INTEGER ,STRING} = require("sequelize");

module.exports = (Sequelize) => {
  const test_subject_map = Sequelize.define("test_subject_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    testId: {
      type: INTEGER,
      allowNull: false,
    },
    scholarshipId: {
      type: INTEGER,
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
    },
    chapterId: {
      type: INTEGER,
    },
    topicId: {
      type: INTEGER,
    },
    createdBy: {
      type: STRING,
    },
    createdId: {
      type: INTEGER,
    },
  });

  return test_subject_map;
};
