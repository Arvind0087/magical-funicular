const { INTEGER, STRING } = require("sequelize");

module.exports = (Sequelize) => {
  const module_child_map = Sequelize.define("module_child_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    moduleId: {
      type: INTEGER,
      allowNull: false,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
  });

  return module_child_map;
};
