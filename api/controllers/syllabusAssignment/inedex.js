const db = require("../../models/index");
const { converterType } = require("../../helpers/service");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const getSignedUrl = require("../../helpers/getSignedUrl");
const { replaceDirectoryInPath } = require("./service");
const { Sequelize, Op, literal } = require("sequelize");
const msg = require("../../constants/Messages");
const Syllabus = db.syllabus;
const Topic = db.topic;
const Subject = db.subject;
const batchType = db.batchTypes;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;
const Chapter = db.chapter;
const Content = db.content;
const Bookmark = db.bookmark;
const UserDetails = db.users;
const StudentDetails = db.student;
const RolePermission = db.permissionRole;
const AdminUser = db.admin;
const recentActivityDetails = db.recentActivity;
const TeacherSubjectMap = db.teacher_subject_map;
const NewContent = db.new_content;
const contentCourseMap = db.content_course_map;
const AssignmentData = db.assignment;
const AssignmentQuestion = db.assignment_question_map;
const AssignmentStudent = db.assignment_student_map;
const AssignmentBoard = db.assignment_board_map;
const AssignmentStartTime = db.assignment_startTime_map;
const QuestionBank = db.questionBank;
const User = db.users;
const Board = db.boards;
const BatchType = db.batchTypes;
const ChapterData = db.chapter;
const StudentTestMap = db.student_test_map;

//NOTE - assignment syllabus map
const assignmentBySyllabusId = async (req, res) => {
  const { videoId, subjectId } = req.query;
  //NOTE - decode user id
  const userId = req.user.id;

  //NOTE - checking assignment created for student or not
  const getAssignment = await AssignmentStudent.findOne({
    where: {
      studentId: userId,
      attempted: 0,
    },
  });
  if (!getAssignment)
    return res
      .status(400)
      .send({ status: 400, message: msg.ASSIGNMENT_UNAVALIABLE });

  //NOTE - Get user details from user table
  const user_details = await UserDetails.findOne({
    where: { id: userId, type: "Student" },
    include: [
      {
        model: StudentDetails,
        attributes: ["gender"],
        include: [
          { model: AllCourses, attributes: ["id", "name"] },
          { model: Boards, attributes: ["id", "name"] },
          { model: Class, attributes: ["id", "name"] },
          { model: batchType, attributes: ["id", "name"] },
        ],
      },
    ],
  });
  if (!user_details)
    return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

  //NOTE - get syllabus details
  const syllabusDetails = await NewContent.findOne({
    where: { contentId: videoId },
  }); 
};

module.exports = { assignmentBySyllabusId };
