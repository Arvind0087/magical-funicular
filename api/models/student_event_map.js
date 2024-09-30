const { INTEGER, TINYINT,DATE } = require("sequelize");

module.exports = (Sequelize) => {
  const student_event_map = Sequelize.define("student_event_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    eventId: {
      type: INTEGER,
      allowNull: false,
    },
    studentId: {
      type: INTEGER,
      allowNull: false,
    },
    attempt: {
      type: TINYINT,
      defaultValue: 1,
    },
    joinStatus: {
      type: TINYINT,
      defaultValue: 0,
    },
  });

  return student_event_map;
};
