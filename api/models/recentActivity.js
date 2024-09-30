const { INTEGER, DATE, TIME, STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const recentActivity = Sequelize.define("recentActivity", {
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
    videoId: {
      type: INTEGER,
      allowNull: false,
    },
    subjectId: {
      type: INTEGER,
    },
    videoStart: {
      type: INTEGER,
    },
    videoEnd: {
      type: INTEGER,
    },
    status: {
      type: STRING,
    },
  });

  return recentActivity;
};
