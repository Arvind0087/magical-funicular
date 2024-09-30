const { STRING, INTEGER, DATE } = require("sequelize");

module.exports = (Sequelize) => {
  const bulkUpload_files = Sequelize.define("bulkUpload_files", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    fileType: {
      type: STRING,
      allowNull: false,
      validate: {
        isIn: [["state", "city", "chapter", "topic", "question", "content", "revision", "staff", "student", "grivancesCategory", "grivancesSubCategory"]], // Allowed values
      },
    },
    uploadedDate: {
      type: DATE,
    },
    uploadFileUrl: {
      type: STRING,
    },
    errorFileUrl: {
      type: STRING,
    },
    status: {
      type: STRING,
      //enum: ["success", "pending", "error"]
      validate: {
        isIn: [["success", "pending", "error","Server Error"]], // Allowed values
      },
    },
    chapterId: {
      type: INTEGER,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return bulkUpload_files;
};
