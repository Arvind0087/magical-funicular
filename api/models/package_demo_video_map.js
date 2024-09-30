const { STRING, INTEGER, TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
    const package_demo_video_map = Sequelize.define("package_demo_video_map", {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false, //required:true
            unique: true,
        },
        packageId: {
            type: INTEGER,
            allowNull: false,
        },
        thumbnail: {
            type: STRING,
            allowNull: false,        },
        url: {
            type: STRING,
            allowNull: false,        },
    });

    return package_demo_video_map;
};
