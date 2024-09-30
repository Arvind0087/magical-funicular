const { STRING, INTEGER, BOOLEAN } = require("sequelize");

module.exports = (Sequelize) => {
  const internalSetting = Sequelize.define("internalSetting", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: INTEGER,
      allowNull: false,
    },
    themeColorPresents: {
      type: STRING,
    },
    themeContrast: {
      type: STRING,
    },
    themeDirection: {
      type: STRING,
    },
    themeLayout: {
      type: STRING,
    },
    themeMode: {
      type: STRING,
    },
    themeStretch: {
      type: BOOLEAN,
    },
    dense: {
      type: STRING,
    },
  });

  return internalSetting;
};
