const { INTEGER, DATE } = require("sequelize");

module.exports = (Sequelize) => {
    const event_attend_map = Sequelize.define(
        "event_attend_map",
        {
            id: {
                type: INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false, //required:true
                unique: true,
            },
            studentId: {
                type: INTEGER,
            },
            teacherId: {
                type: INTEGER,
            },
            eventId: {
                type: INTEGER,
            },
            date: {
                type: DATE,
            },
        }
    );

    return event_attend_map;
};
