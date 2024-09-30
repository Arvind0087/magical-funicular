const { STRING, INTEGER, TINYINT, DATE } = require("sequelize");

module.exports = (Sequelize) => {
  const time_cron_map = Sequelize.define("time_cron_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    reason: {
      type: STRING,
    },
  });

  return time_cron_map;
};
