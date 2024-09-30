const { INTEGER, STRING, TINYINT, DATE } = require("sequelize");

module.exports = (Sequelize) => {
    const course_package_map = Sequelize.define("course_package_map", {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false, //required:true
            unique: true,
        },
        courseId: {
            type: INTEGER,
        },
        boardId: {
            type: INTEGER,
        },
        classId: {
            type: INTEGER,
        },
        batchTypeId: {
            type: INTEGER,
            allowNull: false,
        },
        package_title: {
            type: STRING,
        },
        package_thumbnail: {
            type: STRING,
        },
        package_duration: {
            type: INTEGER,
        },
        package_start_date: {
            type: DATE,
        },
        package_end_date: {
            type: DATE,
        },
        package_type: {
            type: STRING,
            validate: {
                isIn: [["Live", "Recorded"]], // Allowed values
            },
        },
        package_price: {
            type: INTEGER,
        },
        package_selling_price: {
            type: INTEGER,
        },
        package_description: {
            type: STRING,
        },
        package_brochure: {
            type: STRING,
        },
        package_code: {
            type: STRING,
        },
        createdById: {
            type: INTEGER,
        },
        updatedById: {
            type: INTEGER,
        },
        status: {
            type: TINYINT,
            defaultValue: 1,
        },
    });

    return course_package_map;
};
