const { STRING, INTEGER,TEXT} = require("sequelize");

module.exports = (Sequelize) => {
  const faq = Sequelize.define("faq", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    question: {
      type: TEXT,
    },
    answer: {
      type: TEXT,
    },
    type: {
      type: STRING,
      validate: {
        isIn: [["help","mentorship","scholarship","refer","course"]], // Allowed values
      },
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return faq;
};
