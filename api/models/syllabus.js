const { STRING, INTEGER} = require("sequelize");

module.exports = (Sequelize) => {
  const syllabus = Sequelize.define("syllabus", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    topicId: {
      type: INTEGER,
      allowNull: false,
    },
    video: {
      type: STRING,
      allowNull: false,
    },
    // thumbnail: {
    //   type: STRING,
    //   allowNull: false,
    // },
    name: {
      type: STRING,
      allowNull: false,
    },
    time: {
      type: STRING,
      allowNull: false,
    },
    
    
  });

  return syllabus;
};
