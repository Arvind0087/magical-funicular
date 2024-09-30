const db = require("../models/index");
const batchType = db.batchTypes;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;

exports.bathDetails = async (batchTypeId) => {
  //NOTE - batchType details
  const data = await batchType.findOne({
    where: { id: batchTypeId },
    include: [
      { model: Course, attributes: ["name"] },
      { model: Boards, attributes: ["name"] },
      { model: Class, attributes: ["name"] },
    ],
  });

  return data;
};
