const { INTEGER, TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
  const package_class_map = Sequelize.define("package_class_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    courseId: {
      type: INTEGER,
    },
    packageId: {
      type: INTEGER,
    },
    subscriptionId: {
      type: INTEGER,
    },
    boardId: {
      type: INTEGER,
    },
    classId: {
      type: INTEGER,
    },
    batchTypeId: {
      type: INTEGER,
    },
    batchStartDateId: {
      type: INTEGER,
    },
    monthlyPrice: {
      type: INTEGER,
    },
    monthlyDiscountedPrice: {
      type: INTEGER,
    },
    realPrice: {
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

  return package_class_map;
};
