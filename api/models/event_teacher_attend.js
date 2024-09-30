const { INTEGER, STRING, DATE, TIME } = require("sequelize");

module.exports = (Sequelize) => {
    const event_teacher_attend = Sequelize.define(
        "event_teacher_attend",
        {
            id: {
                type: INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false, //required:true
                unique: true,
            },
            teacherId: {
                type: INTEGER,
            },
            eventId: {
                type: INTEGER,
            },
        }
    );

    return event_teacher_attend;
};
