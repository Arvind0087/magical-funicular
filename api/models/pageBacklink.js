const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const pageBackLink = Sequelize.define("pageBackLink", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    page: {
      type: STRING,
    },
    backLink: {
      type: STRING,
    },
    webBackLink: {
      type: STRING,
    },
  });

  return pageBackLink;
};
