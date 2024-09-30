const { INTEGER, STRING, DATE, TIME } = require("sequelize");

module.exports = (Sequelize) => {
    const student_attendance = Sequelize.define("student_attendance",
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
            date: {
                type: DATE,
            },
            status: {
                type: STRING,
                validate: {
                    isIn: [["present", "absent"]], // TODO: Allowed values
                },
            }
        });

    return student_attendance;
};
