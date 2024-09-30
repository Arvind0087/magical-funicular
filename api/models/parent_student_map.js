const { STRING, INTEGER, TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
  const parent_student_map = Sequelize.define("parent_student_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    parentId: {
      type: INTEGER,
    },
    studentId: {
      type: INTEGER,
    },
    relationship: {
      type: STRING,
      validate: {
        isIn: [["Father", "Mother"]], // TODO: Allowed values
      },
    },
    status: {
      type: TINYINT,
      defaultValue: 1,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return parent_student_map;
};
