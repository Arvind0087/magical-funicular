const { STRING, INTEGER, DATE ,TEXT} = require("sequelize");

module.exports = (Sequelize) => {
  const student = Sequelize.define("student", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //TODO :Allowed values
      unique: true,
    },
    avatar: {
      type: TEXT,
    },
    dob: {
      type: DATE,
    },
    gender: {
      type: STRING,
      validate: {
        isIn: [["Male", "Female", "Other"]], // TODO: Allowed values
      },
    },
    address: {
      type: STRING,
    },
    countryId: {
      type: INTEGER,
      defaultValue: 91,
    },
    stateId: {
      type: INTEGER,
    },
    cityId: {
      type: INTEGER,
    },
    pincode: {
      type: INTEGER,
    },
    schoolName: {
      type: STRING,
    },
    wantsToBeId: {
      type: INTEGER,
    },
    courseId: {
      type: INTEGER,
    },
    boardId: {
      type: INTEGER,
    },
    classId: {
      type: INTEGER,
    },
    batchTypeId: {
      type: INTEGER,
    },
    batchStartDateId: {
      type: INTEGER,
    },
    referralCode: {
      type: STRING,
    },
    recommendReferralCode: {
      type: STRING,
    },
    
  });
  return student;
};
