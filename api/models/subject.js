const { STRING, INTEGER, TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
  const subject = Sequelize.define("subject", {
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
    name: {
      type: STRING,
      allowNull: false,
    },
    image: {
      type: STRING,
    },
    isAllSubject: {
      type: TINYINT,
      defaultValue: 0,
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

  return subject;
};
