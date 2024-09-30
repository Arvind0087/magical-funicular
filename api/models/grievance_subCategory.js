const { STRING, INTEGER, BOOLEAN } = require("sequelize");

module.exports = (Sequelize) => {
    const grievance_subCategory = Sequelize.define("grievance_subCategory", {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        categoryId: {
            type: INTEGER,
            allowNull: false,
        },
        subCategory: {
            type: STRING,
        },
        createdById: {
            type: INTEGER,
        },
        updatedById: {
            type: INTEGER,
        },
    });

    return grievance_subCategory;
};
