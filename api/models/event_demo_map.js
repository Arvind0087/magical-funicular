const { INTEGER, STRING, DATE, TIME } = require("sequelize");

module.exports = (Sequelize) => {
  const event_demo_map = Sequelize.define("event_demo_map", {
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
    studentId: {
      type: INTEGER,
    },
    subjectId: {
      type: INTEGER,
    },
    type: {
      type: STRING,
      validate: {
        isIn: [
          ["homeWork", "Live Class", "Doubt Class", "Demo Class", "Mentorship"],
        ], // Allowed values
      },
    },
    date: {
      type: DATE,
    },
    status: {
      type: STRING,
      defaultValue: "Pending",
      validate: {
        isIn: [["Pending", "Rejected", "Accepted"]], // Allowed values
      },
    },
    fromTime: {
      type: STRING,
    },
    toTime: {
      type: STRING,
    },
    reminderMe: {
      type: TIME,
    },
  });

  return event_demo_map;
};
