const { INTEGER, BOOLEAN } = require("sequelize");

module.exports = (Sequelize) => {
  const permission = Sequelize.define("permission", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    roleId: {
      type: INTEGER,
      allowNull: false,
    },
    routeId: {
      type: INTEGER,
      allowNull: false,
    },
    add: {
      type: BOOLEAN,
    },
    view: {
      type: BOOLEAN,
    },
    edit: {
      type: BOOLEAN,
    },
    remove: {
      type: BOOLEAN,
    },
    createdById: {
      type: INTEGER,
    },
    updatedById: {
      type: INTEGER,
    },
  });

  return permission;
};
