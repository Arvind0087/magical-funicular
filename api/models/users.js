const { STRING, INTEGER, TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
  const users = Sequelize.define("users", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    vedaId: {
      type: STRING,
    },
    name: {
      type: STRING(100),
    },
    email: {
      type: STRING(50),
    },
    phone: {
      type: STRING,
      allowNull: false,
    },
    mPin: {
      type: STRING,
    },
    studentType: {
      type: STRING,
      validate: {
        isIn: [["Primary", "Secondary"]], //TODO: Allowed values
      },
    },
    type: {
      type: STRING,
      validate: {
        isIn: [["Student", "Parent"]], //TODO: Allowed values
      },
    },
    typeId: {
      type: INTEGER,
    },
    parentTypeId: {
      type: INTEGER,
    },
    profilePercentage: {
      type: INTEGER,
    },
    status: {
      type: TINYINT,
      defaultValue: 1,
    },
    subscriptionType: {
      type: STRING,
      defaultValue: "Free",
      validate: {
        isIn: [["Free", "Premium"]], // TODO: Allowed values only
      },
    },
    liveEventPercentage: {
      type: INTEGER,
      defaultValue: 0,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return users;
};
