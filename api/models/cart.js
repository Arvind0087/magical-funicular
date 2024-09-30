const { INTEGER, DATE, STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const cart = Sequelize.define("cart", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    userId: {
      type: INTEGER,
    },
    amount: {
      type: INTEGER,
    },
    title: {
      type: STRING,
    },
    authorName: {
      type: STRING,
    },
    quantity: {
      type: STRING,
    },
    userLoginType: {
      type: STRING,
    },
  });

  return cart;
};
