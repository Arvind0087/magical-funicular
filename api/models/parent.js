const { STRING, INTEGER, DATE } = require("sequelize");

module.exports = (Sequelize) => {
  const parent = Sequelize.define("parent", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    dob: {
      type: DATE,
    },
    gender: {
      type: STRING,
    },
    occupation: {
      type: STRING,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return parent;
};
