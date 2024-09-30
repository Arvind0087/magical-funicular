const { INTEGER, TIME } = require("sequelize");

module.exports = (Sequelize) => {
  const quiz = Sequelize.define("quiz", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    subjectId: {
      type: INTEGER,
      allowNull: false,
    },
    studentId: {
      type: INTEGER,
      allowNull: false,
    },
    time: {
      type: TIME,
      allowNull: false,
    },
    numberOfQuestions: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    markPerQuestion: {
      type: INTEGER,
      defaultValue: 1,
    },
    attempt:{
      type: INTEGER,
      defaultValue: 0,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return quiz;
};
