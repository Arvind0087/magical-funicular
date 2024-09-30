const { STRING, INTEGER, DATE } = require("sequelize");

module.exports = (Sequelize) => {
  const mobile_token_map = Sequelize.define("mobile_token_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: STRING,
    },
    userId: {
      type: INTEGER,
    },
    parentId: {
      type: INTEGER,
    },
    token: {
      type: STRING,
    },
    type: {
      type: STRING,
      defaultValue: null,
    },
    expiry: {
      type: DATE,
    },
  });

  return mobile_token_map;
};
