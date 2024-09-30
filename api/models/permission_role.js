const { INTEGER, STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const permission_role = Sequelize.define("permission_role", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    role: {
      type: STRING,
      allowNull: false, //required:true
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
    
  });

  return permission_role;
};
