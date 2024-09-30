const { INTEGER, DATE, STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const coupon = Sequelize.define("coupon", {
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
    validity: {
      type: DATE,
    },
    amount: {
      type: INTEGER,
    },
    couponCode: {
      type: STRING,
    },
   
  });

  return coupon;
};
