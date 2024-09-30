const { INTEGER, DATE, STRING, TIME } = require("sequelize");

module.exports = (Sequelize) => {
  const schedule_time_map = Sequelize.define("schedule_time_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    scheduleId: {
      type: INTEGER,
    },
    fromTime: {
      type: TIME,
    },
    toTime: {
      type: TIME,
    },
  });

  return schedule_time_map;
};
