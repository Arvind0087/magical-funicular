const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const all = Sequelize.define("", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    title: {
      type: STRING,
      allowNull: false,
    },
    key: {
      type: INTEGER,
      allowNull: false,
    },
  });

  return chapter;
};
