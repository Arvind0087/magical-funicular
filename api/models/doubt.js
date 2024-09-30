const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const doubt = Sequelize.define("doubt", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    studentId: {
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
    question: {
      type: STRING,
    },
    image: {
      type: STRING,
    },
  });

  return doubt;
};
