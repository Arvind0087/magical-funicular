const { STRING, INTEGER, DATE } = require("sequelize");

module.exports = (Sequelize) => {
  const student_plan_map = Sequelize.define("student_plan_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    userId: {
      type: INTEGER,
      allowNull: false,
    },
    subscriptionType: {
      type: STRING,
      defaultValue: "Free",
      validate: {
        isIn: [["Free", "Premium"]], // TODO: Allowed values only
      },
    },
    month: {
      type: INTEGER,
    },
    validityDay: {
      type: INTEGER,
    },
    validityDate: {
      type: DATE,
    },
    entryType: {
      type: STRING,
      validate: {
        isIn: [["Manually", "Purchase"]], // TODO: Allowed values only
      },
    },
    packageId: {
      type: INTEGER,
    },
    createdById: {
      type: INTEGER,
    },
    createdByType: {
      type: STRING,
    },
  });

  return student_plan_map;
};
