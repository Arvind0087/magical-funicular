const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const activity = Sequelize.define("activity", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    userId: {
      type: INTEGER,
      allowNull: false,
    },
    module: {
      type: STRING,
    },
    activityName: {
      type: STRING,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return activity;
};
