const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const content = Sequelize.define("content", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
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
      allowNull: false,
    },
    batchTypeId: {
      type: INTEGER,
      allowNull: false,
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
  });

  return content;
};
