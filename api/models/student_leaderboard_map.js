const { INTEGER, STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const student_leaderboard_map = Sequelize.define("student_leaderboard_map", {
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
    marks: {
      type: INTEGER,
    },
    country: {
      type: INTEGER,
    },
    state: {
      type: INTEGER,
    },
    city: {
      type: INTEGER,
    },
    school: {
      type: INTEGER,
    },
  });

  return student_leaderboard_map;
};
