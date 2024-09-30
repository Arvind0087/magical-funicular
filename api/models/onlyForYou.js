const { STRING, INTEGER, TEXT, TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
  const onlyForYou = Sequelize.define("onlyForYou", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    image: {
      type: STRING,
      allowNull: false,
    },
    title: {
      type: STRING,
    },
    description: {
      type: TEXT,
    },
    buttonText: { type: STRING },
    buttonLink: { type: INTEGER },
    otherLink: { type: STRING },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
    status: {
      type: TINYINT,
      defaultValue: 1,
    },
  });

  return onlyForYou;
};
