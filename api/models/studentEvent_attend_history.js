const { INTEGER, STRING, DATE, TIME } = require("sequelize");

module.exports = (Sequelize) => {
  const studentEvent_attend_history = Sequelize.define(
    "studentEvent_attend_history",
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false, //required:true
        unique: true,
      },
      eventId: {
        type: INTEGER,
      },
      studentId: {
        type: INTEGER,
      },
    }
  );

  return studentEvent_attend_history;
};
