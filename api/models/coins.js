const {  INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const coins = Sequelize.define("coins", {
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
    coins: {
      type: INTEGER,
    },
    games: {
      type: INTEGER,
    },
  });

  return coins;
};
