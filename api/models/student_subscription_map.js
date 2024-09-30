const { INTEGER, STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const student_subscription_map = Sequelize.define(
    "student_subscription_map",
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
        allowNull: false,
      },
      sessionAllocated: {
        type: INTEGER,
        allowNull: false,
      },
      sessionUsed: {
        type: INTEGER,
        defaultValue: 0,
      },
      sessionAvailable: {
        type: INTEGER,
      },
    }
  );

  return student_subscription_map;
};
