const { STRING, INTEGER,TEXT } = require("sequelize");

module.exports = (Sequelize) => {
    const error = Sequelize.define("error", {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false, //required:true
            unique: true,
        },
        status: {
            type: INTEGER,
        },
        message: {
            type: STRING,
        },
        route: {
            type: STRING,
        },
        userId: {
            type: INTEGER,
        },
        stack: {
            type: TEXT,
        },
    });

    return error;
};
