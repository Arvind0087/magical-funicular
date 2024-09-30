const { STRING, INTEGER, TEXT, TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
  const questionBank = Sequelize.define("questionBank", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //TODO: required:true
      unique: true,
    },
    courseId: {
      type: INTEGER,
      allowNull: false,
    },
    boardId: {
      type: INTEGER,
      allowNull: false,
    },
    classId: {
      type: INTEGER,
      allowNull: false,
    },
    batchTypeId: {
      type: INTEGER,
      allowNull: false,
    },
    subjectId: {
      type: INTEGER,
      allowNull: false,
    },
    chapterId: {
      type: INTEGER,
      allowNull: false,
    },
    topicId: {
      type: INTEGER,
    },
    question: {
      type: TEXT('long'),
    },
    A: {
      type: TEXT('long'),
    },
    B: {
      type: TEXT('long'),
    },
    C: {
      type: TEXT('long'),
    },
    D: {
      type: TEXT('long'),
    },
    answer: {
      type: STRING,
      validate: {
        isIn: [["A", "B", "C", "D"]], //TODO: Allowed values
      },
    },
    explanation: {
      type: TEXT('long'),
    },
    difficultyLevel: {
      type: STRING,
      validate: {
        isIn: [["Easy", "Medium", "Hard"]], //TODO: Allowed values
      },
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
    status: {
      type: TINYINT,
      defaultValue: 1,
    },
  });

  return questionBank;
};
