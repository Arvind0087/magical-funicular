const { INTEGER, TINYINT, STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const subscriptions = Sequelize.define("subscriptions", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    packageId: {
      type: INTEGER,
    },
    title: {
      type: STRING,
    },
    month: {
      type: INTEGER,
    },
    days: {
      type: INTEGER,
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

  return subscriptions;
};
