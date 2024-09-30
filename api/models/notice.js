const { STRING, INTEGER, TINYINT, DATE } = require("sequelize");

module.exports = (Sequelize) => {
  const notice = Sequelize.define("notice", {
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
    image: {
      type: STRING,
    },
    title: {
      type: STRING,
    },
    description: {
      type: STRING,
    },
    backLinkId: {
      type: INTEGER,
    },
    otherLink: { type: STRING },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return notice;
};
