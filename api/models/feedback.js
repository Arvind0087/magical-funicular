const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const feedback = Sequelize.define("feedback", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    studentId: {
      type: INTEGER,
      allowNull: false, 
    },
    feedback: {
      type: STRING,
    },
  });

  return feedback;
};
