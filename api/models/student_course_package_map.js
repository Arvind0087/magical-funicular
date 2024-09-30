const { INTEGER, DATE } = require("sequelize");

module.exports = (Sequelize) => {
    const student_course_package_map = Sequelize.define("student_course_package_map", {
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
        packageId: {
            type: INTEGER,
        },
        batchTypeId: {
            type: INTEGER,
        },
        validity: {
            type: DATE,
        },
    });

    return student_course_package_map;
};
