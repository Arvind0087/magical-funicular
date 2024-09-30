const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
    const content_course_map = Sequelize.define("content_course_map", {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false, //required:true
            unique: true,
        },
        contentId: {
            type: INTEGER,
            allowNull: false,
        },
        courseId: {
            type: INTEGER,
            allowNull: false,
        },
        boardId: {
            type: INTEGER,
            allowNull: false,
        },
        classId: {
            type: INTEGER,
            //allowNull: false,
        },
        batchTypeId: {
            type: INTEGER,
            //allowNull: false,
        },
        subjectId: {
            type: INTEGER,
            allowNull: false,
        },
        chapterId: {
            type: INTEGER,
            //allowNull: false,
        },
        topicId: {
            type: INTEGER,
            //allowNull: false,
        },
        ORDERSEQ: {
            type: INTEGER,
            defaultValue: 0,
        },
        createdById: {
            type: INTEGER,
        },
        updatedById: {
            type: INTEGER,
        },
    });

    return content_course_map;
};
