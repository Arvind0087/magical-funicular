const { STRING, INTEGER, TIME } = require("sequelize");

module.exports = (Sequelize) => {
  const test = Sequelize.define("test", {
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
    type: {
      type: STRING,
    },
    selectionProcess: {
      type: STRING,
      validate: {
        isIn: [["Manual", "Automated"]], // TODO: Allowed values
      },
    },
    title: {
      type: STRING,
    },
    numberOfQuestions: {
      type: INTEGER,
    },
    testTime: {
      type: TIME,
    },
    difficultyLevels: {
      type: STRING,
    },
    createdBy: {
      type: STRING,
    },
    createdId: {
      type: INTEGER,
    },
  });

  return test;
};
