const { STRING,INTEGER, DATE, TINYINT } = require("sequelize");

module.exports = (Sequelize) => {
  const batchDate = Sequelize.define("batchDate", {
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
    batchName: {
      type: STRING,
      allowNull: false,
    },
    date: {
      type: DATE,
      allowNull: false,
    },
    status: {
      type: TINYINT,
      defaultValue: 1,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
    
  });
  
  return batchDate;
};
