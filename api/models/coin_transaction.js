const { INTEGER, STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const coin_transaction = Sequelize.define("coin_transaction", {
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
    referedToStudentId: {
      type: INTEGER,
    },
    referedFromStudentId: {
        type: INTEGER,
      },
    coins: {
      type: INTEGER,
      allowNull: false,
    },
    games: {
      type: INTEGER,
    },
    reason: {
      type: STRING,
      allowNull: false,
    },
    status: {
      type: STRING,
      allowNull: false,
    },
  });

  return coin_transaction;
};
