const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const highlight = Sequelize.define("highlight", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    title: {
      type: STRING,
      allowNull: false,
    },
    description: {
        type: STRING,
        allowNull: false,
      },
    image: {
      type: STRING,
      allowNull: false,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return highlight;
};
