const { STRING, INTEGER, TINYINT, DATE } = require("sequelize");

module.exports = (Sequelize) => {
  const upload = Sequelize.define("upload", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    title: {
      type: STRING,
    },
    source: {
      type: STRING,
      validate: {
        isIn: [["File", "URL"]], // Allowed values
      },
    },
    url: {
      type: STRING,
    },
    createdBy: {
      type: STRING,
      defaultValue: "superAdmin",
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return upload;
};
