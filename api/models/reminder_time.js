const { INTEGER, TIME } = require("sequelize");

module.exports = (Sequelize) => {
  const reminder_time = Sequelize.define("reminder_time", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    time: {
      type: TIME,
    },
  });

  return reminder_time;
};
