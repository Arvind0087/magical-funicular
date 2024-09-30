const { INTEGER, STRING, DATE } = require("sequelize");

module.exports = (Sequelize) => {
  const icic_payment_details = Sequelize.define("icic_payment_details", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },

    responseCode: {
      type: STRING,
    },
    uniqueRefNumber: {
      type: STRING,
    },
    serviceTaxAmount: {
      type: STRING,
    },
    processingFeeAmount: {
      type: STRING,
    },
    totalAmount: {
      type: STRING,
    },
    transctionAmount: {
      type: STRING,
    },
    transctionDate: {
      type: DATE,
    },
    interchnageValue: {
      type: STRING,
    },
    tdr: {
      type: STRING,
    },
    paymentMode: {
      type: STRING,
    },
    subMerchantId: {
      type: STRING,
    },
    referenceNo: {
      type: STRING,
    },
    icicId: {
      type: STRING,
    },
    rs: {
      type: STRING,
    },
    tps: {
      type: STRING,
    },
    mandatoryFields: {
      type: STRING,
    },
    optionalFields: {
      type: STRING,
    },
    rsv: {
      type: STRING,
    },
  });

  return icic_payment_details;
};
