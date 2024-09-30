const { INTEGER, TEXT } = require("sequelize");

module.exports = (Sequelize) => {
    const course_package_faq_map = Sequelize.define("course_package_faq_map", {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false, //required:true
            unique: true,
        },
        packageId: {
            type: INTEGER,
            allowNull: false
        },
        question: {
            type: TEXT,
        },
        answer: {
            type: TEXT,
        },
    });

    return course_package_faq_map;
};
