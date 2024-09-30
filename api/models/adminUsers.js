const { STRING, INTEGER, TINYINT, DATE, TEXT } = require("sequelize");

module.exports = (Sequelize) => {
  const admin = Sequelize.define("adminUsers", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    vedaId: {
      type: STRING,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    email: {
      type: STRING,
    },
    password: {
      type: STRING,
      allowNull: false,
    },
    phone: {
      type: STRING,
    },
    gender: {
      type: STRING,
      validate: {
        isIn: [["male", "female", "other"]], // TODO: Allowed values
      },
    },
    dob: {
      type: DATE,
    },
    typeId: {
      type: INTEGER,
    },
    department: {
      type: INTEGER,
    },
    avatar: {
      type: STRING,
    },
    teacherInfo: {
      type: TEXT,
    },
    intro_video: {
      type: STRING,
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

  return admin;
};
