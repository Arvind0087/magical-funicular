const { INTEGER, DATE } = require("sequelize");

module.exports = (Sequelize) => {
  const teacher = Sequelize.define("teacher", {
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
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return teacher;
};
