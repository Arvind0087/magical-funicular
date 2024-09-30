const { STRING, INTEGER, DATE, BOOLEAN, TEXT, TIME } = require("sequelize");

module.exports = (Sequelize) => {
  const event = Sequelize.define("event", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    batchTypeId: {
      type: INTEGER,
      allowNull: false,
    },
    subjectId: {
      type: INTEGER,
    },
    chapterId: {
      type: INTEGER,
    },
    zoomApiKey: {
      type: STRING,
    },
    zoomApiSecret: {
      type: STRING,
    },
    meetingNumber: {
      type: STRING,
      //allowNull: false,
    },
    password: {
      type: STRING,
      //allowNull: false,
    },
    teacherId: {
      type: INTEGER,
      allowNull: false,
    },
    endDate: {
      type: DATE,
    },
    category: {
      type: STRING,
      validate: {
        isIn: [["Youtube", "Zoom"]], // Allowed values
      },
    },
    type: {
      type: STRING,
      validate: {
        isIn: [["Live Class", "Doubt Class", "Demo Class", "Mentorship","Free_Live_Class"]], // Allowed values
      },
      allowNull: false,
    },
    attemptBy: {
      type: DATE,
      allowNull: false,
    },
    time: {
      type: TIME,
    },
    role: {
      type: BOOLEAN,
      defaultValue: 1,
    },
    url: {
      type: STRING,
    },
    thumbnail: {
      type: STRING,
    },
    title: {
      type: TEXT,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return event;
};
