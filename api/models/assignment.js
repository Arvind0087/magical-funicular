const { STRING, INTEGER, DATE, TIME } = require("sequelize");

module.exports = (Sequelize) => {
  const assignment = Sequelize.define("assignment", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    testMethod: {
      type: STRING,
      allowNull: false,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    time: {
      type: TIME,
      allowNull: false,
    },
    questionCount: {
      type: INTEGER,
    },
    markPerQuestion: {
      type: INTEGER,
      defaultValue: 1,
    },
    type: {
      type: STRING,
      allowNull: false,
    },
    selectionProcess: {
      type: STRING,
    },
    validity: {
      type: DATE,
      allowNull: false,
    },
    questionFile: {
      type: STRING,
    },
    answerFile: {
      type: STRING,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
    createdByType: {
      type: STRING,
    },
  });

  return assignment;
};
