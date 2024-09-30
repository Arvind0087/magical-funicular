const { INTEGER, TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
  const student_secondary_map = Sequelize.define("student_secondary_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    primaryId: {
      type: INTEGER,
    },
    secondaryId: {
      type: INTEGER,
    },
    status: {
      type: TINYINT,
      defaultValue: 1,
    },
    
  });

  return student_secondary_map;
};
