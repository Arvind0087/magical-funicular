const { INTEGER, STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const test_student_attempt_map = Sequelize.define(
    "test_student_attempt_map",
    {
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
      category: {
        type: STRING,
        validate: {
          isIn: [
            [
              "Trending Tests",
              "Test Series",
              "Mock Tests",
              "Own Tests",
              "Scholarship Test",
            ],
          ], // TODO: Allowed values
        },
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
      attemptCount: {
        type: INTEGER,
      },
      status: {
        type: STRING,
        validate: {
          isIn: [["On going", "Completed"]], //TODO: Allowed values
        },
      },
    }
  );

  return test_student_attempt_map;
};
