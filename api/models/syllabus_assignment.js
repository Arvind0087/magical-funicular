const { STRING, INTEGER, DATE, TIME } = require("sequelize");

module.exports = (Sequelize) => {
  const syllabus_assignment_map = Sequelize.define("syllabus_assignment_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    syllabusId: {
      type: INTEGER,
    },
    assignmentId: {
      type: INTEGER,
    },
  });

  return syllabus_assignment_map;
};
