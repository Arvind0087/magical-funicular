const { STRING, INTEGER, BOOLEAN } = require("sequelize");

module.exports = (Sequelize) => {
    const girevancesCategory_subCategory_map = Sequelize.define("girevancesCategory_subCategory_map", {
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
        subCategoryId: {
            type: INTEGER,
            allowNull: false,
        },
        parentId: {
            type: INTEGER,
            allowNull: false,
        },
        userId: {
            type: INTEGER,
            allowNull: false,
        },
        message: {
            type: STRING,
        }
    });

    return girevancesCategory_subCategory_map;
};
