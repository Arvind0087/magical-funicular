const { INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const assignment_question_map = Sequelize.define("assignment_question_map", {
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
    questionId: {
      type: INTEGER,
      allowNull: false,
    },
    createdById: {
      type: INTEGER,
    },
  });

  return assignment_question_map;
};
