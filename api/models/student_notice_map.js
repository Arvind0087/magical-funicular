const { INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const student_notice_map = Sequelize.define("student_notice_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    noticeId: {
      type: INTEGER,
    },
    studentId: {
      type: INTEGER,
    },
    
  });

  return student_notice_map;
};
