const { INTEGER } = require("sequelize");

module.exports = (Sequelize) => {
  const assignment_board_map = Sequelize.define("assignment_board_map", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, //required:true
      unique: true,
    },
    assignmentId: {
      type: INTEGER,
      allowNull: false,
    },
    boardId: {
      type: INTEGER,
      allowNull: false,
    },
    classId: {
      type: INTEGER,
      allowNull: false,
    },
    batchTypeId: {
      type: INTEGER,
      allowNull: false,
    },
    subjectId: {
      type: INTEGER,
    },
    chapterId: {
      type: INTEGER,
    },
    createdById: {
      type: INTEGER,
    },
  });

  return assignment_board_map;
};
