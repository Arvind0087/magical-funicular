const { STRING, INTEGER, BOOLEAN } = require("sequelize");

module.exports = (Sequelize) => {
    const grievance_category = Sequelize.define("grievance_category", {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        category: {
            type: STRING,
            allowNull: false,
        },
        createdById: {
            type: INTEGER,
        },
        updatedById: {
            type: INTEGER,
        },
    });

    return grievance_category;
};
