const { STRING, INTEGER, BOOLEAN } = require("sequelize");

module.exports = (Sequelize) => {
  const shorts_like_map = Sequelize.define("shorts_like_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, 
      unique: true,
    },
    studentId: {
        type: INTEGER,
        allowNull: false,
      },
    shortsId: {
      type: INTEGER,
      allowNull: false,
    },
    like:{
      type: BOOLEAN,
      allowNull: false,
    },
  });



  return shorts_like_map;
};
