const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const shorts = Sequelize.define("shorts", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    title: {
      type: STRING,
    },
    video: {
      type: STRING,
    },
    thumbnail: {
      type: STRING,
    },
    view: {
      type: INTEGER,
    },
    share: {
      type: STRING,
    },
    source: {
      type: STRING,
      validate: {
        isIn: [["youtube", "upload"]], // Allowed values
      },
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return shorts;
};
