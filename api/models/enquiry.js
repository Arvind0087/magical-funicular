const { STRING, INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const enquiry = Sequelize.define("enquiry", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    name: {
      type: STRING,
    },
    email: {
      type: STRING,
    },
    phone: {
      type: STRING,
    },
    subject: {
      type: STRING,
    },
    message: {
      type: STRING,
    },
  });

  return enquiry;
};
