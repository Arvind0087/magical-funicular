const { INTEGER, DATE, STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const assignment_startTime_map = Sequelize.define(
    "assignment_startTime_map",
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false, //required:true
        unique: true,
      },
      assignmentId: {
        type: INTEGER,
        allowNull: false,
      },
      studentId: {
        type: INTEGER,
        allowNull: false,
      },
      startTime: {
        type: DATE,
      },
      attemptCount: {
        type: INTEGER,
        defaultValue: 1,
      },
      status: {
        type: STRING,
        validate: {
          isIn: [["On going", "Completed"]], //TODO: Allowed values
        },
      },
    }
  );

  return assignment_startTime_map;
};
