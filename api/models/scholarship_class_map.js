const { INTEGER, TIME, DATE, DATEONLY,STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const scholarship_class_map = Sequelize.define("scholarship_class_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    scholarshipId: {
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
      type: STRING,
      allowNull: false,
    },
    batchTypeId: {
      type: STRING,
      allowNull: false,
    },

    subjectId: {
      type: STRING,
      allowNull: false,
    },
    date: {
      type: DATEONLY,
    },
    startTime: {
      type: TIME,
      defaultValue: null,
    },
    endTime: {
      type: TIME,
      defaultValue: null,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return scholarship_class_map;
};
