const { INTEGER,  STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const rating = Sequelize.define("rating", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    studentId: {
      type: INTEGER,
      allowNull: false,
    },
    rating: {
      type: INTEGER,
      allowNull: false,
      validate: {
        isIn: [[1, 2, 3, 4, 5]], // Allowed values
      },
    },
    issue: {
      type: STRING,
    },
    comment: {
      type: STRING,
    },
  });

  return rating;
};
