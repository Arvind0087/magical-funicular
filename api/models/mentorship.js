const { STRING, INTEGER, DATE, TEXT } = require("sequelize");

module.exports = (Sequelize) => {
  const mentorship = Sequelize.define("mentorship", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    teacherId: {
      type: INTEGER,
      allowNull: false,
    },
    studentId: {
      type: INTEGER,
      allowNull: false,
    },
    title: {
      type: STRING,
      allowNull: false,
    },
    type: {
      type: STRING,
    },
    description: {
      type: TEXT,
      allowNull: false,
    },
    startDate: {
      type: DATE,
      allowNull: false,
    },
    endDate: {
      type: DATE,
      allowNull: false,
    },
  });

  return mentorship;
};
