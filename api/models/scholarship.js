const { INTEGER, STRING, TIME ,DATE} = require("sequelize");

module.exports = (Sequelize) => {
  const scholarship = Sequelize.define("scholarship", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    title: {
      type: STRING,
      allowNull: false,
    },
    lastDateOfRegistration: {
      type: DATE,
      allowNull: false,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return scholarship;
};
