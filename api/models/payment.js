const { INTEGER, DATE, STRING } = require("sequelize");

module.exports = (Sequelize) => {
    const payment = Sequelize.define("payment", {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false, //required:true
            unique: true,
        },
        userId: {
            type: INTEGER,
        },
        orderId: {
            type: INTEGER,
        },
        trackingId: {
            type: STRING,
        },
        bankRefNo: {
            type: STRING,
        },
        paymentMode: {
            type: STRING,
        },
        currency: {
            type: STRING,
        },
        status: {
            type: STRING,
        },
        paymentOrderId: {
            type: STRING,
        },
        transactionDate: {
            type: DATE,
            defaultValue: new Date(),
        },
    });

    return payment;
};
