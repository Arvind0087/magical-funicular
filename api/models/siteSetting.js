const { STRING, INTEGER, TEXT } = require("sequelize");

module.exports = (Sequelize) => {
  const siteSetting = Sequelize.define("siteSetting", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    favicon: {
      type: STRING,
    },
    siteLogo: {
      type: STRING,
    },
    siteMiniLogo: {
      type: STRING,
    },
    sitePreloader: {
      type: STRING,
    },
    loginImage: {
      type: STRING,
    },
    siteTitle: {
      type: STRING,
    },
    siteAuthorName: {
      type: STRING,
    },
    siteDescription: {
      type: TEXT,
    },
    enrollmentWord: {
      type: STRING,
    },
    copyrightText: {
      type: TEXT,
    },
    type: {
      type: STRING,
    },
    socialContent: {
      type: STRING,
    },
     
  });

  return siteSetting;
};
