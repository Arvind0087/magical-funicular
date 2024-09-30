const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
    const address = Sequelize.define("address", {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        orderId: {
            type: INTEGER,
        },
        fullAddress: {
            type: STRING,
        },
        city: {
            type: STRING,
        },
        state: {
            type: STRING,
        },
        pincode: {
            type: INTEGER,
            allowNull: false,
        },
        addressType: {
            type: STRING,
            validate: {
                isIn: [["Home", "Work"]],
            },
        },
    });

    return address;
};
