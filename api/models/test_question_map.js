const { INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const test_question_map = Sequelize.define("test_question_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    testId: {
      type: INTEGER,
    },
    quizId: {
      type: INTEGER,
    },
    scholarshipId: {
      type: INTEGER,
    },
    questionId: {
      type: INTEGER,
    },
  });

  return test_question_map;
};