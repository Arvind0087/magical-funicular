const { STRING, INTEGER, DATE, BOOLEAN, DATEONLY, TIME } = require("sequelize");

module.exports = (Sequelize) => {
    const liveclass_report = Sequelize.define("liveclass_report", {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false, //required:true
            unique: true,
        },
        eventId: {
            type: INTEGER,
            allowNull: false,
        },
        studentId: {
            type: INTEGER,
        },
        date: {
            type: DATE,
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
        },
        subjectId: {
            type: INTEGER,
        },
        type: {
            type: STRING,
        },
    });

    return liveclass_report;
};
