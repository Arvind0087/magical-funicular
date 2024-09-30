const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const doubtReply = Sequelize.define("doubtReply", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    doubtId: {
      type: INTEGER,
      allowNull: false,
    },
    replyId: {
      type: INTEGER,
      allowNull: false,
    },
    sender: {
      type: STRING,
    },
    type: {
      type: STRING,
    },
    answer: {
      type: STRING,
    },
    image: {
      type: STRING,
    },
  });

  return doubtReply;
};
