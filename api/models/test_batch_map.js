const { INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const test_batch_map = Sequelize.define("test_batch_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    testId: {
      type: INTEGER,
      allowNull: false,
    },
    scholarshipId: {
      type: INTEGER,
    },
    batchTypeId: {
      type: INTEGER,
    },
    batchStartDateId: {
      type: INTEGER,
    },
  });

  return test_batch_map;
};
