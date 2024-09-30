const { STRING, INTEGER, TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
  const banner = Sequelize.define("banner", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    image: {
      type: STRING,
      allowNull: false,
    },
    title: {
      type: STRING,
    },
    type: {
      type: STRING,
      validate: {
        isIn: [["Home", "Assessment"]], // TODO: Allowed values
      },
    },
    backLink: {
      type: STRING,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return banner;
};
