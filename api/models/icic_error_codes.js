const { INTEGER, STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const icic_error_codes = Sequelize.define("icic_error_codes", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    code: {
      type: STRING,
    },
    description: {
      type: STRING,
    },
    status: {
      type: STRING,
    },
  });

  return icic_error_codes;
};
