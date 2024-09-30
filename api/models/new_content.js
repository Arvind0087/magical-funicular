const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
    const new_content = Sequelize.define("new_content", {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false, //required:true
            unique: true,
        },
        tag: {
            type: STRING,
            validate: {
                isIn: [["Learning Content", "Recorded Live Session", "Help Resource"]], // Allowed values
            },
        },
        source: {
            type: STRING,
            validate: {
                isIn: [["youtube", "vimeo", "upload", "gallerymanager"]], // Allowed values
            },
        },
        resourceType: {
            type: STRING,
            validate: {
                isIn: [["video", "image", "pdf"]], // Allowed values
            },
        },
        sourceFile: {
            type: STRING,
        },
        thumbnailFile: {
            type: STRING,
        },
        resourceFile: {
            type: STRING,
        },
        createdById: {
            type: INTEGER,
        },
        updatedById: {
            type: INTEGER,
        },
        ORDERSEQ: {
            type: INTEGER,
        },
        
    });

    return new_content;
};
