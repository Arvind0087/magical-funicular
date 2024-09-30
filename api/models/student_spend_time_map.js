const { INTEGER, DATE, STRING } = require("sequelize");

module.exports = (Sequelize) => {
    const student_spend_time_map = Sequelize.define(
        "student_spend_time_map",
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
                allowNull: false,
            },
            status: {
                type: STRING,
                validate: {
                    isIn: [["close"]], // TODO: Allowed values
                },
            },
        }
    );

    return student_spend_time_map;
};
