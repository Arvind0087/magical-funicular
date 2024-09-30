const { STRING, INTEGER,  TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
  const packages = Sequelize.define("packages", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    courseId: {
      type: INTEGER,
      allowNull: false,
    },
    name: {
      type: STRING(100),
      allowNull: false,
    },
    tag: {
      type: STRING(20),
      allowNull: false,
    },
    startingPrice: {
      type: STRING,
      allowNull: false,
    },
    list: {
      type: STRING,
      allowNull: false,
    },
    packageType: {
      type: STRING,
      validate: {
        isIn: [["Class", "Batch"]], // TODO: Allowed values
      },
    },
    status: {
      type: TINYINT,
      defaultValue: 1,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return packages;
};
