const db = require("../models/index");
const msg = require("../constants/Messages");
const UserDetails = db.users;
const StudentDetails = db.student;
const AllCourses = db.courses;
const Boards = db.boards;
const Class = db.class;
const batchType = db.batchTypes;

//NOTE - user details
exports.userDetails = async (Id) => {
  const usersDetail = await UserDetails.findOne({
    attributes: ["phone", "id", "name"],
    where: { type: "Student", id: Id },
    include: [
      {
        model: StudentDetails,
        attributes: ["courseId"],
        include: [
          { model: AllCourses, attributes: ["name"] },
          { model: Boards, attributes: ["name"] },
          { model: Class, attributes: ["name"] },
          //{ model: batchType, attributes: ["name"] },
        ],
      },
    ],
  });

  return usersDetail;
};
