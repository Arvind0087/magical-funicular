const { INTEGER, DATE, TIME, STRING ,DATEONLY} = require("sequelize");

module.exports = (Sequelize) => {
  const teacher_book_map = Sequelize.define("teacher_book_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    eventId: {
      type: INTEGER,
    },
    studentId: {
      type: INTEGER,
    },
    teacherId: {
      type: INTEGER,
    },
    date: {
      type: DATEONLY,
    },
    bookTimeFrom: {
      type: TIME,
    },
    bookTimeTo: {
      type: TIME,
    },
    type: {
      type: STRING,
      values: ["doubt", "demo"],
    },
  });

  return teacher_book_map;
};
