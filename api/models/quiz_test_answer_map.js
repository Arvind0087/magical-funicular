const { INTEGER, STRING, TIME } = require("sequelize");

module.exports = (Sequelize) => {
  const quiz_test_answer_map = Sequelize.define("quiz_test_answer_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    assignmentId: {
      type: INTEGER,
    },
    testId: {
      type: INTEGER,
    },
    quizId: {
      type: INTEGER,
    },
    studentId: {
      type: INTEGER,
      allowNull: false,
    },
    reviewedById: {
      type: INTEGER,
    },
    questionId: {
      type: INTEGER,
    },
    answer: {
      type: STRING,
    },
    answerFile: {
      type: STRING,
    },
    time: {
      type: TIME,
    },
    status: {
      type: STRING,
      validate: {
        isIn: [["Answered", "Skipped", "Not Visited"]], // TODO: Allowed values
      },
    },
  });

  return quiz_test_answer_map;
};
