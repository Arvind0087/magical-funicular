const { INTEGER, DATE, STRING } = require("sequelize");

module.exports = (Sequelize) => {
    const event_chat_map = Sequelize.define(
        "event_chat_map",
        {
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
            teacherId: {
                type: INTEGER,
            },
            eventId: {
                type: INTEGER,
            },
            message: {
                type: STRING,
            },
            dateTime: {
                type: DATE,
            },
            role: {
                type: STRING,
                validate: {
                    isIn: [["User", "Teacher"]], // Allowed values
                },
            }
        }
    );

    return event_chat_map;
};
