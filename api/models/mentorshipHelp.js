const { STRING, INTEGER, DATE } = require("sequelize");

module.exports = (Sequelize) => {
  const mentorshipHelp = Sequelize.define("mentorshipHelp", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    title: {
      type: STRING,
      allowNull: false,
    },
    image: {
      type: STRING,
      allowNull: false,
    },
    description: {
      type: STRING,
      defaultValue: null,
    },
    type: {
      type: STRING,
      values: ["feature", "help", "mentor"],
      allowNull: false,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return mentorshipHelp;
};
