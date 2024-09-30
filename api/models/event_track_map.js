const { STRING, INTEGER, DATE, BOOLEAN, TEXT, TIME } = require("sequelize");

module.exports = (Sequelize) => {
    const event_track_map = Sequelize.define("event_track_map", {
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
            allowNull: false,
        },
        joinTime: {
            type: DATE,
        },
        exitTime: {
            type: DATE,
        },
    });

    return event_track_map;
};
