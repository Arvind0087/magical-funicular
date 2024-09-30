const { INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const scholarship_student_map = Sequelize.define("scholarship_student_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    scholarshipId: {
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
      allowNull: false,
    },
    batchTypeId: {
      type: INTEGER,
      allowNull: false,
    },
    userId: {
      type: INTEGER,
      allowNull: false,
    },
    stateId: {
      type: INTEGER,
    },
    cityId: {
      type: INTEGER,
    },
  });

  return scholarship_student_map;
};
