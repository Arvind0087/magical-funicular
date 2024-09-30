const { INTEGER, STRING, TIME, DATE } = require("sequelize");

module.exports = (Sequelize) => {
  const student_test_map = Sequelize.define("student_test_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    startId: {
      type: INTEGER,
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
    scholarshipId: {
      type: INTEGER,
    },
    studentId: {
      type: INTEGER,
    },
    reviewedById: {
      type: INTEGER,
    },
    questionId: {
      type: INTEGER,
    },
    answer: {
      type: STRING,
      validate: {
        isIn: [["A", "B", "C", "D",""]], // TODO:Allowed values
      },
    },
    answerFile: {
      type: STRING,
    },
    startDate: {
      type: DATE,
    },
    attemptCount: {
      type: INTEGER,
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

  return student_test_map;
};

