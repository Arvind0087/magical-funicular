const { STRING, INTEGER, BOOLEAN } = require("sequelize");

module.exports = (Sequelize) => {
  const bookmark = Sequelize.define("bookmark", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    subjectId: {
      type: INTEGER,
    },
    chapterId: {
      type: INTEGER,
    },
    topic: {
      type: STRING,
    },
    typeId: {
      type: INTEGER,
    },
    userId: {
      type: INTEGER,
      allowNull: false,
    },
    revisionId: {
      type: INTEGER,
    },
    bookmarkType: {
      type: STRING,
      validate: {
        isIn: [["video", "question", "Summary", "Questions", "Quick Bites"]], // Allowed values
      },
    },
    bookmark: {
      type: BOOLEAN,
    },
  });
  return bookmark;
};
