const { validate } = require("node-cron");
const { INTEGER, DATE, STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const orders = Sequelize.define("orders", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    userName: {
      type: STRING,
    },
    phone: {
      type: STRING,
    },
    packageId: {
      type: INTEGER,
    },
    subscriptionId: {
      type: INTEGER,
    },
    userId: {
      type: INTEGER,
    },
    vedaOrderId: {
      type: STRING,
    },
    orderId: {
      type: STRING,
    },
    paymentId: {
      type: STRING,
    },
    purchaseDate: {
      type: DATE,
      defaultValue: new Date(),
    },
    amount: {
      type: INTEGER,
    },
    paymentMode: {
      type: STRING,
    },
    paymentStatus: {
      type: STRING,
      defaultValue: "Pending",
      validate: {
        isIn: [["Pending", "Success", "Failed"]], // TODO: Allowed values
      },
    },
    validity: {
      type: DATE,
    },
    type: {
      type: STRING,
      validate: {
        isIn: [["Mentor", "Package", "Book", "coursePackage"]], // TODO: Allowed values
      },
    },
    trackingId: {
      type: STRING,
    },
    bankRefNo: {
      type: STRING,
    },
    email: {
      type: STRING,
    },
    title: {
      type: STRING,
    },
    authorName: {
      type: STRING,
    },
    quantity: {
      type: INTEGER,
    },
    totalAmount: {
      type: INTEGER,
    },
    coursePackageId: {
      type: INTEGER,
    },
    batchTypeId: {
      type: INTEGER,
    },
  });

  return orders;
};
