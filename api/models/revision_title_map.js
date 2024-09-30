const { INTEGER, STRING, TEXT, TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
  const revision_title_map = Sequelize.define("revision_title_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    revisionId: {
      type: INTEGER,
      allowNull: false,
    },
    title: {
      type: TEXT,
    },
    description: {
      type: TEXT,
    },
    image: {
      type: STRING,
    },
  });

  return revision_title_map;
};
