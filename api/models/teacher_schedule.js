const { INTEGER, DATE, STRING, TIME, BOOLEAN, DATEONLY } = require("sequelize");

module.exports = (Sequelize) => {
  const teacher_schedule = Sequelize.define("teacher_schedule", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    teacherId: {
      type: INTEGER,
    },
    date: {
      type: DATEONLY,
    },
    availability: {
      type: BOOLEAN,
    },
    duration: {
      type: INTEGER,
    },
    breakTime: {
      type: INTEGER,
    },
  });

  return teacher_schedule;
};
