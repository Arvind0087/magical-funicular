const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const wantToBe = Sequelize.define("wantToBe", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    name: {
      type: STRING,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return wantToBe;
};
