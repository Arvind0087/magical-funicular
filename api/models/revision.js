const { INTEGER, STRING, TEXT, TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
  const revision = Sequelize.define("revision", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
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
    chapaterId: {
      type: INTEGER,
      allowNull: false,
    },
    category: {
      type: STRING,
      validate: {
        isIn: [["Summary", "Questions", "Quick Bites"]], // TODO: Allowed values
      },
    },
    topic: {
      type: STRING,
      validate: {
        isIn: [["Definition", "Diagram", "Application"]], // TODO: Allowed values
      },
    },
    status: {
      type: TINYINT,
      defaultValue: 1,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return revision;
};
