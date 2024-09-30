const { INTEGER, STRING, DATE, TIME } = require("sequelize");

module.exports = (Sequelize) => {
  const event_student_attendance = Sequelize.define(
    "event_student_attendance",
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false, //required:true
        unique: true,
      },
      studentId: {
        type: INTEGER,
      },
      eventId: {
        type: INTEGER,
      },
      status: {
        type: STRING,
        validate: {
          isIn: [["Manual", "Automatic"]], // Allowed values
        },
      },
      createdById: {
        type: INTEGER,
      },
      updatedById: {
        type: INTEGER,
      },
    }
  );

  return event_student_attendance;
};
