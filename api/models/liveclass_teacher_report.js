const { STRING, INTEGER, DATE, BOOLEAN, DATEONLY, TIME } = require("sequelize");

module.exports = (Sequelize) => {
    const liveclass_teacher_report = Sequelize.define("liveclass_teacher_report", {
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
        date: {
            type: DATE,
        },
        batchTypeId: {
            type: INTEGER,
        },
        subjectId: {
            type: INTEGER,
        },
        teacherId: {
            type: INTEGER,
        },
        type: {
            type: STRING,
        },
    });

    return liveclass_teacher_report;
};
