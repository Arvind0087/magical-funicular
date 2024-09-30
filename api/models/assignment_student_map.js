const { INTEGER, TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
  const assignment_student_map = Sequelize.define("assignment_student_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    assignmentId: {
      type: INTEGER,
      allowNull: false,
    },
    studentId: {
      type: INTEGER,
      allowNull: false,
    },
    attempted: {
      type: TINYINT,
      defaultValue: 0,
    },
    reviewed: {
      type: TINYINT,
      defaultValue: 0,
    },
  });

  return assignment_student_map;
};
