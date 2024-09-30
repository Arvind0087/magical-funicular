const { Sequelize, Op, literal } = require("sequelize");
const db = require("../../models/index");
const msg = require("../../constants/Messages");
const uploadWordFile = require("../../helpers/uploadWordFile");
const getSignedUrl = require("../../helpers/getSignedUrl");
const { getSignedUrlCloudFront } = require("../../helpers/cloudFront");
const { addTime, dividTime, addTestAttemptTimes } = require("./service");
const AssignmentData = db.assignment;
const AssignmentQuestion = db.assignment_question_map;
const AssignmentStudent = db.assignment_student_map;
const AssignmentBoard = db.assignment_board_map;
const AssignmentStartTime = db.assignment_startTime_map;
const QuestionBank = db.questionBank;
const User = db.users;
const StudentDetails = db.student;
const Course = db.courses;
const Board = db.boards;
const Class = db.class;
const BatchType = db.batchTypes;
const Subject = db.subject;
const ChapterData = db.chapter;
const AdminUser = db.admin;
const RolePermission = db.permissionRole;
const StudentTestMap = db.student_test_map;
const TeacherSubjectMap = db.teacher_subject_map;

//ANCHOR - Create new Assignments
const createAssignments = async (req, res) => {
  try {
    const {
      testMethod,
      name,
      time,
      type,
      validity,
      boardId,
      classId,
      batchTypeId,
      subjectIds,
      chapterIds,
      questionIds,
      studentIds,
      questionFile,
      answerFile,
      selectionProcess,
    } = req.body;

    //NOTE - Get  User details from token
    const getAdmin = await AdminUser.findOne({
      where: { id: req.user.id }, //NOTE - get user id from token
      include: [
        {
          model: RolePermission,
          attributes: ["role"],
        },
      ],
    });

    let payload = {
      testMethod: testMethod,
      name: name,
      time: time,
      selectionProcess: selectionProcess,
      type: type,
      validity: validity,
      questionCount:
        !!questionIds && questionIds.length > 0 ? questionIds.length : null,
      createdById: getAdmin.department,
      createdByType: getAdmin.permission_role?.role,
    };

    //NOTE - Push question file from base64
    if (questionFile && questionFile.includes("base64")) {
      const uploadQuestion = await uploadWordFile(
        questionFile,
        msg.ASSIGNMENT_QUESTION_URL
      );

      payload = { ...payload, questionFile: uploadQuestion.key };
    }

    //NOTE - Push answer file from base64
    if (answerFile && answerFile.includes("base64")) {
      const uploadAnswer = await uploadWordFile(
        answerFile,
        msg.ASSIGNMENT_ANSWER_URL
      );
      payload = { ...payload, answerFile: uploadAnswer.key };
    }

    //NOTE - Create Assignments
    const assignment = new AssignmentData(payload);

    const getAssignment = await assignment.save();

    if (getAssignment) {
      //NOTE - When manually select questions
      if (questionIds) {
        for (const qu of questionIds) {
          const questionDetails = await QuestionBank.findOne({
            where: { id: qu },
          });
          if (!questionDetails) {
            return res
              .status(400)
              .send({ status: 400, message: msg.QUESTION_BANK_NOT_FOUND });
          }

          //NOTE - Push Questions
          const questions = new AssignmentQuestion({
            assignmentId: getAssignment.id,
            questionId: qu,
          });

          await questions.save();

          //NOTE - Push Subject and chapter
          const allBoards = new AssignmentBoard({
            assignmentId: getAssignment.id,
            boardId: boardId,
            classId: classId,
            batchTypeId: batchTypeId,
            subjectId: questionDetails.subjectId,
            chapterId: questionDetails.chapterId,
          });
          await allBoards.save();
        }
      }

      //NOTE - Push all assign students
      if (studentIds) {
        for (const id of studentIds) {
          const studentMapping = new AssignmentStudent({
            assignmentId: getAssignment.id,
            studentId: id,
          });

          await studentMapping.save();
        }
      }

      //NOTE - If upload questions. push subject and chapters
      if (questionFile || answerFile) {
        //NOTE - Push board and classes if Chapter Ids are coming
        if (chapterIds) {
          for (const id of chapterIds) {
            const chapterDetails = await ChapterData.findOne({
              where: {
                id: id,
              },
            });

            //NOTE - push board mapping based on the chapter id
            const allBoards = new AssignmentBoard({
              assignmentId: getAssignment.id,
              boardId: chapterDetails.boardId,
              classId: chapterDetails.classId,
              batchTypeId: chapterDetails.batchTypeId,
              subjectId: chapterDetails.subjectId,
              chapterId: chapterDetails.id,
            });
            await allBoards.save();
          }
        }

        //NOTE - Push board and classes if only Subject Ids are coming
        if (subjectIds && !chapterIds) {
          //NOTE - push board mapping based on the Subject id
          for (const subb of subjectIds) {
            const allBoards = new AssignmentBoard({
              assignmentId: getAssignment.id,
              boardId: boardId,
              classId: classId,
              batchTypeId: batchTypeId,
              subjectId: subb,
            });
            await allBoards.save();
          }
        }
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.ASSIGNMENT_CREATED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get Assignments
//TODO - only use on Admin Panel
const getAllAssignments = async (req, res) => {
  try {
    const { page, limit, search, classes } = req.query;

    //NOTE - add pagination
    const query =
      page && limit
        ? {
            offset: Number(page - 1) * limit,
            limit: Number(limit),
          }
        : {};

    //NOTE - filter based on id ,name and type
    const searchParams = search
      ? {
          [Op.or]: [
            { id: { [Op.like]: "%" + search + "%" } },
            { name: { [Op.like]: "%" + search + "%" } },
            { type: { [Op.like]: "%" + search + "%" } },
          ],
        }
      : undefined;

    //NOTE - filter by class
    const classParams = classes ? { classId: classes } : undefined;

    //NOTE - user filter based on class and batch type
    let userParams = null;
    if (
      req.user?.role &&
      ["teacher", "mentor"].includes(req?.user?.role.toLowerCase())
    ) {
      //NOTE - get staff class and batch details
      const staffDetails = await TeacherSubjectMap.findAll({
        where: { teacherId: req.user.id },
        attributes: ["classId", "batchTypeId"],
      });

      //NOTE - get all class details
      const classesIds = staffDetails.map((item) => item.classId);

      //NOTE - get all batch details
      const batchIds = staffDetails.map((item) => item.batchTypeId);

      //NOTE - params based on class or batch type
      const idParams = batchIds.every((id) => id === null)
        ? { classId: { [Sequelize.Op.in]: classesIds } }
        : { batchTypeId: { [Sequelize.Op.in]: batchIds } };

      //NOTE - get all assignment details
      const assignmentData = await AssignmentBoard.findAll({ where: idParams });

      //NOTE - get unique assignment data
      const key = "assignmentId";
      const uniqueAssignments = [
        ...new Map(assignmentData.map((item) => [item[key], item])).values(),
      ];
      const assignmentIds = uniqueAssignments.map((item) => item.assignmentId);

      userParams = { id: { [Sequelize.Op.in]: assignmentIds } };
    }

    //NOTE - Get all Assignments for assignment table
    let { count, rows } = await AssignmentData.findAndCountAll({
      ...query,
      where: {
        ...searchParams,
        ...userParams,
      },
      attributes: [
        "id",
        "testMethod",
        "name",
        "time",
        "questionCount",
        "markPerQuestion",
        "type",
        "validity",
        "createdById",
        "createdByType",
        "questionFile",
        "answerFile",
      ],
      include: [
        {
          model: AdminUser,
          as: "creator",
          attributes: ["id", "name"],
          include: {
            model: RolePermission,
            attributes: ["role"],
          },
        },
        {
          model: AdminUser,
          as: "updater",
          attributes: ["id", "name"],
          include: {
            model: RolePermission,
            attributes: ["role"],
          },
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    //NOTE - push final data
    const allAssignments = await Promise.all(
      rows.map(async (ass) => {
        const getClass = await AssignmentBoard.findOne({
          where: { assignmentId: ass.id, ...classParams },
          attributes: ["classId"],
          include: [
            {
              model: Class,
              attributes: ["name"],
            },
          ],
        });

        if (getClass !== null) {
          const [questionFile, answerFile] = await Promise.all([
            ass.questionFile ? getSignedUrl(ass.questionFile) : null,
            ass.answerFile ? getSignedUrl(ass.answerFile) : null,
          ]);

          return {
            id: ass.id,
            name: ass.name,
            time: ass.time,
            testMethod: ass.testMethod,
            questionCount: ass.questionCount,
            markPerQuestion: ass.markPerQuestion,
            type: ass.type,
            validity: ass.validity,
            createdById: ass.createdById,
            createdByType: ass.createdByType,
            questionFile,
            answerFile,
            createdByName: ass.creator ? ass.creator.name : null,
            createdByRole: ass.creator
              ? ass.creator.permission_role.role
              : null,
            updateByName: ass.updater ? ass.updater.name : null,
            updateByRole: ass.updater ? ass.updater.permission_role.role : null,
            classId: getClass.classId,
            class: getClass.class.name,
          };
        }
        return null;
      })
    );

    const filteredAssignments = allAssignments.filter(
      (assignment) => assignment !== null
    );

    const { rows: assignmentRows } = await AssignmentBoard.findAndCountAll({
      where: { ...classParams },
      attributes: ["classId", "assignmentId"],
    });

    const uniqueAssign = [
      ...new Set(assignmentRows.map((item) => item.assignmentId)),
    ].sort();
    const totalCount = classes && limit ? uniqueAssign.length : count;

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      count: totalCount,
      data: filteredAssignments,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get Assignments By id
const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    let questions = [];
    // let students = [];
    // let subjects = [];
    // let chapters = [];

    //NOTE - Find Assignment details
    const assignmentDetails = await AssignmentData.findOne({
      where: { id: id },
      attributes: {
        exclude: ["createdById", "createdByType", "createdAt", "updatedAt"],
      },
    });
    if (!assignmentDetails)
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });

    //NOTE - Find Assignment question details
    const questionData = await AssignmentQuestion.findAll({
      where: { assignmentId: id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: QuestionBank,
        attributes: [
          "id",
          "question",
          "A",
          "B",
          "C",
          "D",
          "answer",
          "explanation",
        ],
      },
    });

    //NOTE - Push all questions
    for (const quu of questionData) {
      questions.push({
        id: quu.questionBank.id,
        question: quu.questionBank.question,
        A: quu.questionBank.A,
        B: quu.questionBank.B,
        C: quu.questionBank.C,
        D: quu.questionBank.D,
        answer: quu.questionBank.answer,
        explanation: quu.questionBank.explanation,
      });
    }

    //NOTE - Find assign Student details
    const studentData = await AssignmentStudent.findAll({
      where: { assignmentId: id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: { model: User, attributes: ["id", "name"] },
    });

    //NOTE - Push all Student details
    const students = studentData.map((stu) => ({
      id: stu.user.id,
      name: stu.user.name,
    }));

    //NOTE - Find all Board and subject details
    const allBoard = await AssignmentBoard.findAll({
      where: { assignmentId: id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Board,
          attributes: ["id", "name"],
          include: { model: Course, attributes: ["id", "name"] },
        },
        { model: Class, attributes: ["id", "name"] },
        { model: BatchType, attributes: ["id", "name"] },
        { model: Subject, attributes: ["id", "name"] },
        { model: ChapterData, attributes: ["id", "name"] },
      ],
    });

    //NOTE - Get Subject
    const subjects = allBoard.map((data) => ({
      subjectId: data.subject?.id,
      subjectName: data.subject?.name,
    }));

    // NOTE - Get chapter
    const chapters = allBoard
      .filter((data) => data.chapter !== null)
      .map((data) => ({
        chapterId: data.chapter?.id,
        chapterName: data.chapter?.name,
      }));

    //NOTE - get unique values
    const getUniqueValues = (arr, key) => {
      const map = new Map();
      arr.forEach((item) => {
        if (item[key] !== undefined) {
          map.set(item[key], item);
        }
      });
      return Array.from(map.values()).sort();
    };

    const uniqueSubject = getUniqueValues(subjects, "subjectId");
    const uniqueChapter = getUniqueValues(chapters, "chapterId");

    //NOTE - Final data push
    const result = {
      id: assignmentDetails.id,
      testMethod: assignmentDetails.testMethod,
      name: assignmentDetails.name,
      time: assignmentDetails.time,
      questionCount: assignmentDetails.questionCount,
      markPerQuestion: assignmentDetails.markPerQuestion,
      selectionProcess: assignmentDetails.selectionProcess,
      type: assignmentDetails.type,
      validity: assignmentDetails.validity,
      courseId: allBoard[0].board?.course.id,
      courseName: allBoard[0].board?.course.name,
      boardId: allBoard[0].board?.id,
      boardName: allBoard[0].board?.name,
      classId: allBoard[0].class?.id,
      className: allBoard[0].class?.name,
      batchTypeId: allBoard[0].batchType?.id,
      batchTypeName: allBoard[0].batchType?.name,
      subjects: uniqueSubject,
      chapters: uniqueChapter,
      questionFile: assignmentDetails.questionFile
        ? await getSignedUrl(assignmentDetails.questionFile)
        : null,
      answerFile: assignmentDetails.answerFile
        ? await getSignedUrl(assignmentDetails.answerFile)
        : null,
      students: students,
      questions: questions,
    };

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Edit Assignments By id
const updateAssignmentById = async (req, res) => {
  try {
    const {
      name,
      time,
      questionCount,
      type,
      validity,
      boardId,
      classId,
      batchTypeId,
      subjectIds,
      chapterIds,
      questionIds,
      studentIds,
      questionFile,
      answerFile,
      id,
    } = req.body;

    //NOTE - Find Assignment details
    const assignmentDetails = await AssignmentData.findOne({
      where: { id: id },
      attributes: {
        exclude: [
          "testMethod",
          "createdById",
          "createdByType",
          "createdAt",
          "updatedAt",
        ],
      },
    });

    let payload = {
      name: name,
      time: time,
      questionCount: questionCount,
      type: type,
      validity: validity,
    };

    if (assignmentDetails) {
      //NOTE - If test method is upload update question File
      if (questionFile && questionFile.includes("base64")) {
        const uploadQuestion = await uploadWordFile(
          questionFile,
          msg.ASSIGNMENT_QUESTION_URL
        );
        payload = { ...payload, questionFile: uploadQuestion.key };
      }

      //NOTE - If test method is upload update answer file
      if (answerFile && answerFile.includes("base64")) {
        const uploadAnswer = await uploadWordFile(
          answerFile,
          msg.ASSIGNMENT_ANSWER_URL
        );
        payload = { ...payload, answerFile: uploadAnswer.key };
      }

      //NOTE - Update Assignment table
      await AssignmentData.update(payload, {
        where: { id: assignmentDetails.id },
      });

      //NOTE - Update Questions
      if (questionIds) {
        //NOTE - destroy all questions
        await AssignmentQuestion.destroy({
          where: { assignmentId: id },
        });

        //NOTE - add all new questions
        for (const q of questionIds) {
          const newQuestions = new AssignmentQuestion({
            assignmentId: id,
            questionId: q,
          });
          await newQuestions.save();
        }
      }

      //NOTE - Update Students
      if (studentIds) {
        //NOTE - destroy all students
        await AssignmentStudent.destroy({
          where: { assignmentId: id },
        });

        //NOTE - add all new students
        for (const ss of studentIds) {
          const studentMapping = new AssignmentStudent({
            assignmentId: id,
            studentId: ss,
          });

          await studentMapping.save();
        }
      }

      //NOTE - Update subject and chapters
      if (subjectIds || chapterIds) {
        //NOTE - destroy all Board
        await AssignmentBoard.destroy({
          where: { assignmentId: id },
        });

        //NOTE - Create board and classes if Chapter Ids are coming
        if (chapterIds) {
          for (const chapId of chapterIds) {
            const chapterDetails = await ChapterData.findOne({
              where: {
                id: chapId,
              },
            });

            //NOTE - push board mapping based on the chapter id
            const allBoards = new AssignmentBoard({
              assignmentId: id,
              boardId: chapterDetails.boardId,
              classId: chapterDetails.classId,
              batchTypeId: chapterDetails.batchTypeId,
              subjectId: chapterDetails.subjectId,
              chapterId: chapterDetails.id,
            });
            await allBoards.save();
          }
        }

        //NOTE - Create board and classes if only Subject Ids are coming
        if (studentIds && !chapterIds) {
          //NOTE - push board mapping based on the Subject id
          for (const subb of subjectIds) {
            const allBoards = new AssignmentBoard({
              assignmentId: id,
              boardId: boardId,
              classId: classId,
              batchTypeId: batchTypeId,
              subjectId: subb,
            });
            await allBoards.save();
          }
        }
      }

      return res.status(200).send({
        status: 200,
        message: msg.ASSIGNMENT_UPDATED,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Delete Assignments By id
const deleteAssignmentById = async (req, res) => {
  try {
    const assignmentId = req.params.id;

    //NOTE - Find Assignment details
    const assignmentDetails = await AssignmentData.findOne({
      where: { id: assignmentId },
    });

    if (!assignmentDetails) {
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });
    }

    //NOTE - destroy all board and class details
    await AssignmentBoard.destroy({
      where: {
        assignmentId: assignmentId,
      },
    });

    //NOTE - destroy all Student details
    await AssignmentStudent.destroy({
      where: {
        assignmentId: assignmentId,
      },
    });

    //NOTE - destroy all Question details
    await AssignmentQuestion.destroy({
      where: {
        assignmentId: assignmentId,
      },
    });

    //NOTE - destroy Assignment Details
    await AssignmentData.destroy({
      where: {
        id: assignmentId,
      },
    });

    return res
      .status(200)
      .send({ status: 200, message: msg.ASSIGNMENT_DELETED });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get Assignments By student id
//TODO - Use for web and Mobile Screen
const getAssignmentsByStudentId = async (req, res) => {
  try {
    const { status, subjectId } = req.body;
    let result = [];
    let getAssignment;

    //NOTE - get student details from  token
    const studentId = req.user.id;

    //NOTE - check status
    let value;
    if (["pending"].includes(status)) {
      value = {
        validity: {
          [Op.lte]: literal("CURRENT_TIMESTAMP"),
        },
      };
    } else if (["upcoming"].includes(status)) {
      value = {
        validity: {
          [Op.gt]: literal("CURRENT_TIMESTAMP"),
        },
      };
    }

    //NOTE - if subject id is coming
    if (subjectId) {
      // NOTE - check subjectId is a all subject or not
      const checkSubjectDetails = await Subject.findOne({
        where: { id: subjectId },
      });

      if (checkSubjectDetails.isAllSubject === 1) {
        // NOTE - get Assignment id based on the student id
        getAssignment = await AssignmentStudent.findAll({
          where: { studentId: studentId },
        });
        if (!getAssignment)
          return res.status(400).send({ status: 400, message: msg.NOT_FOUND });
      } else {
        // NOTE - get Assignment id based on the subject id
        getAssignment = await AssignmentBoard.findAll({
          where: { subjectId: subjectId },
        });

        if (!getAssignment)
          return res.status(400).send({ status: 400, message: msg.NOT_FOUND });
      }
      //NOTE - if subject id is not coming
    } else {
      // NOTE - get Assignment id based on the student id
      getAssignment = await AssignmentStudent.findAll({
        where: { studentId: studentId },
      });
      if (!getAssignment)
        return res.status(400).send({ status: 400, message: msg.NOT_FOUND });
    }

    if (["pending"].includes(status) || ["upcoming"].includes(status)) {
      const uniqueArr = Object.values(
        getAssignment.reduce((acc, obj) => {
          acc[obj.assignmentId] = obj;
          return acc;
        }, {})
      );

      for (const assignment of uniqueArr) {
        //NOTE - check Subject id
        let parms;
        if (subjectId && assignment) {
          parms = {
            studentId: studentId,
            assignmentId: assignment.assignmentId,
            attempted: 0, //NOTE - if not attempt
            reviewed: 0,
          };
        } else {
          parms = {
            studentId: studentId,
            attempted: 0,
            reviewed: 0,
          };
        }

        if (["pending"].includes(status) || ["upcoming"].includes(status)) {
          //NOTE - Find asssignment id based on  Student id
          const studentData = await AssignmentStudent.findAll({
            where: { ...parms },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: {
              model: AssignmentData,
              where: { ...value },
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              include: {
                model: AdminUser,
                as: "creator",
                attributes: ["id", "name"],
                include: {
                  model: RolePermission,
                  attributes: ["role"],
                },
              },
            },
          });

          //NOTE - Final data push
          for (const data of studentData) {
            result.push({
              id: data.assignmentId,
              assignmentId: data.assignmentId,
              name: data.assignment.name,
              assignmentType: data.assignment.type,
              testMethod: data.assignment.testMethod,
              validity: data.assignment.validity,
              time: data.assignment.time,
              createdBy: data.assignment.creator?.name,
            });
          }
        }
      }
    } else if (["completed"].includes(status)) {
      for (const assignment of getAssignment) {
        //NOTE - check Subject idS
        let parms;
        if (subjectId && assignment) {
          parms = {
            studentId: studentId,
            assignmentId: assignment.assignmentId,
          };
        } else {
          parms = {
            studentId: studentId,
          };
        }

        const studentAnswer = await StudentTestMap.findAll({
          where: { ...parms },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: AssignmentData,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: {
              model: AdminUser,
              as: "creator",
              attributes: ["id", "name"],
              include: {
                model: RolePermission,
                attributes: ["role"],
              },
            },
          },
        });

        //NOTE - Final data push
        for (const data of studentAnswer) {
          if (data.assignment)
            result.push({
              id: data.assignmentId,
              assignmentId: data.assignmentId,
              name: data.assignment.name,
              assignmentType: data.assignment.type,
              testMethod: data.assignment.testMethod,
              validity: data.assignment.validity,
              time: data.assignment.time,
              createdBy: data.assignment.creator?.name,
            });
        }
      }
    }

    //NOTE - Get Subject Class
    const key = "assignmentId";
    const uniqueData = [
      ...new Map(result.map((item) => [item[key], item])).values(),
    ].sort();

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: uniqueData,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get Assignment questions by assignment id
//TODO - Use for web and Mobile Screen
const getQuestionByAssignmentId = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const studentId = req.user.id; //TODO - get from token

    let questions = [];
    let startAssignment;

    //NOTE - Find Assignment details
    const assignmentDetails = await AssignmentData.findOne({
      where: { id: assignmentId },
      attributes: {
        exclude: ["createdById", "createdByType", "createdAt", "updatedAt"],
      },
    });
    if (!assignmentDetails) {
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });
    }
    //NOTE - Find Assignment question details
    const questionData = await AssignmentQuestion.findAll({
      where: { assignmentId: assignmentDetails.id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: QuestionBank,
        attributes: [
          "id",
          "question",
          "A",
          "B",
          "C",
          "D",
          "answer",
          "explanation",
          "subjectId",
        ],
      },
    });

    //NOTE - Check if student attempt Assignment or not
    const checkAttempted = await AssignmentStudent.findOne({
      where: {
        assignmentId: assignmentDetails.id,
        studentId: studentId,
        attempted: 0,
      },
    });

    //NOTE - if not attempted
    if (checkAttempted) {
      const checkTime = await AssignmentStartTime.findOne({
        where: {
          assignmentId: assignmentDetails.id,
          studentId: studentId,
        },
      });

      if (checkTime) {
        await AssignmentStartTime.destroy({
          where: {
            assignmentId: assignmentDetails.id,
            studentId: studentId,
          },
        });

        startAssignment = new AssignmentStartTime({
          assignmentId: assignmentDetails.id,
          studentId: studentId,
          startTime: new Date(),
          status: "On going",
        });
        await startAssignment.save();
      } else {
        startAssignment = new AssignmentStartTime({
          assignmentId: assignmentDetails.id,
          studentId: studentId,
          startTime: new Date(),
          status: "On going",
        });
        await startAssignment.save();
      }
    } else {
      startAssignment = new AssignmentStartTime({
        assignmentId: assignmentDetails.id,
        studentId: studentId,
        startTime: new Date(),
        status: "On going",
      });
      await startAssignment.save();
    }

    //NOTE - Push all questions
    for (const data of questionData) {
      await StudentTestMap.create({
        startId: startAssignment.id,
        studentId: studentId,
        testId: null,
        scholarshipId: null,
        assignmentId: assignmentId,
        questionId: data.questionBank.id,
        answer: "",
        time: "00:00:00",
        startDate: new Date(),
        attemptCount: 1,
        status: "Not Visited", //TODO - status will be skipped
      });
    }

    //NOTE - get all question details
    const allQuestionData = await StudentTestMap.findAll({
      where: {
        assignmentId: assignmentId,
        studentId: studentId,
        startId: startAssignment.id,
      },
      include: [
        {
          model: AssignmentData,
          attributes: ["id", "questionCount", "time"],
        },

        {
          model: QuestionBank,
          attributes: [
            "id",
            "question",
            "A",
            "B",
            "C",
            "D",
            "answer",
            "difficultyLevel",
          ],
        },
      ],
    });

    //NOTE - Push all question details
    for (const data of allQuestionData) {
      questions.push({
        id: data.id,
        questionCount: data.assignment.questionCount,
        questionId: data.questionBank.id,
        questions: data.questionBank.question,
        A: data.questionBank.A,
        B: data.questionBank.B,
        C: data.questionBank.C,
        D: data.questionBank.D,
      });
    }

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: {
        testStartId: startAssignment.id,
        time: allQuestionData[0].assignment.time,
        questions: questions,
      },
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Student upload answer sheets
//TODO - Use for web and Mobile Screen
const uploadAnswerSheet = async (req, res) => {
  try {
    const { assignmentId, answerFile } = req.body;

    const studentId = req.user.id;

    //NOTE - Find mapping student
    const mapping = await AssignmentStudent.findOne({
      where: { assignmentId: assignmentId, studentId: studentId },
    });
    if (!mapping)
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });

    //NOTE - Update mapping table as reviewd

    await AssignmentStudent.update(
      {
        attempted: 1,
      },
      {
        where: { assignmentId: assignmentId, studentId: studentId },
      }
    );

    let payload = {
      assignmentId: assignmentId,
      studentId: studentId,
      status: "Answered",
    };

    //NOTE - Create Answer Mapping
    if (answerFile && answerFile.includes("base64")) {
      const uploadAnswer = await uploadWordFile(
        answerFile,
        msg.STUDENT_ASSIGNMENT_ANSWER_URL
      );
      payload = { ...payload, answerFile: uploadAnswer.key };
    }

    const answerMapping = new StudentTestMap(payload);

    await answerMapping.save();

    return res.status(200).send({
      status: 200,
      message: msg.ANSWER_SUBMITTED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR : Student Attempt Assignment
//TODO - Use for web and Mobile Screen
const assignmentAtttempted = async (req, res) => {
  try {
    const { id, answer, time, assignmentId } = req.body;

    //NOTE - studentId from token
    const studentId = req.user.id;

    //NOTE - Find Assignment details
    const assignment = await AssignmentData.findOne({
      where: { id: assignmentId },
    });

    //NOTE - check Assignment start time
    const startAssignment = await AssignmentStartTime.findOne({
      where: { assignmentId: assignmentId, studentId: studentId },
    });

    //NOTE - divied Assignment time in hour ,minutes, seconds
    const [hours, minutes, seconds] = dividTime(assignment.time);

    //NOTE - Get maximum assignment submit date and time based actual assignment time
    const submittedByTime = addTime(
      startAssignment.startTime,
      hours,
      minutes,
      seconds
    );

    const targetTime = new Date(submittedByTime).getTime(); // Get the target time value in milliseconds
    const currentTime = Date.now();

    //NOTE - Push answers
    if (currentTime <= targetTime) {
      const id_value = id ?? null;
      const answer_value = answer ?? null;

      if (typeof id_value === "undefined" || id_value === null) {
        return res.status(400).send({
          status: 400,
          message: msg.QUESTION_CANT_BLANK,
        });
      } else {
        //NOTE - Find question details
        const questionDetails = await StudentTestMap.findOne({
          where: {
            id: id,
          },
        });

        //NOTE - If answer key is not coming then its a skipped question
        if (
          typeof answer_value === "undefined" ||
          answer_value === null ||
          answer_value === ""
        ) {
          //NOTE - push the result
          await StudentTestMap.update(
            {
              studentId: studentId,
              answer: answer,
              time: await addTestAttemptTimes(questionDetails.time, time),
              startDate: new Date(),
              status: "Skipped", //TODO - status will be skipped
            },
            {
              where: {
                id: id,
              },
            }
          );
        } else {
          //NOTE - push the result
          await StudentTestMap.update(
            {
              studentId: studentId,
              answer: answer,
              time: await addTestAttemptTimes(questionDetails.time, time),
              startDate: new Date(),
              scholarshipId: null,
              status: "Answered", //TODO - status will be Answered
            },
            {
              where: {
                id: id,
              },
            }
          );
        }

        AssignmentStudent.update(
          { attempted: 1, reviewed: 1 },
          { where: { assignmentId: assignmentId, studentId: studentId } }
        );
      }
      return res.status(200).send({
        status: 200,
        message: msg.ANSWER_SUBMITTED,
      });
    } else {
      return res.status(400).send({
        status: 400,
        message: msg.UNABLE_TO_SUBMIT,
      });
    }
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all assignment report
const getAllAssignmentReports = async (req, res) => {
  try {
    const { page, limit, studentId } = req.query;

    //NOTE - add pagination
    const query =
      page && limit
        ? {
            offset: Number(page - 1) * limit,
            limit: Number(limit),
          }
        : {};

    //NOTE - filter based on studentId
    const final = studentId ? { id: studentId } : undefined;

    //NOTE - user filter based on class and batch type
    let userParams = null;
    if (
      req.user?.role &&
      ["teacher", "mentor"].includes(req?.user?.role.toLowerCase())
    ) {
      //NOTE - get staff class and batch details
      const staffDetails = await TeacherSubjectMap.findAll({
        where: { teacherId: req.user.id },
        attributes: ["classId", "batchTypeId"],
      });

      //NOTE - get all class details
      const classesIds = staffDetails.map((item) => item.classId);

      //NOTE - get all batch details
      const batchIds = staffDetails.map((item) => item.batchTypeId);

      //NOTE - params based on class or batch type
      const idParams = batchIds.every((id) => id === null)
        ? { classId: { [Sequelize.Op.in]: classesIds } }
        : { batchTypeId: { [Sequelize.Op.in]: batchIds } };

      //NOTE - find student data based on the batchType
      const students = await StudentDetails.findAll({
        where: {
          ...idParams,
        },
        attributes: ["id"],
      });

      //NOTE - push all user type ids for student ids
      const type_id = students.map((item) => item.id);

      userParams = { studentId: { [Sequelize.Op.in]: type_id } };
    }

    //NOTE - get all attempted test details
    const { count, rows } = await AssignmentStartTime.findAndCountAll({
      ...query,
      where: { assignmentId: { [Op.not]: null }, ...userParams },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: AssignmentData,
          attributes: [
            "id",
            "testMethod",
            "name",
            "time",
            "questionCount",
            "markPerQuestion",
            "time",
            "type",
          ],
        },
        { model: User, attributes: ["id", "name"], where: final },
      ],
    });

    //NOTE - final data push
    const result = rows.map((report) => ({
      id: report.id,
      studentName: report.user?.name,
      assignmentId: report.assignmentId,
      title: report.assignment?.name,
      studentId: report.studentId,
      mode: report.assignment?.testMethod,
      type: report.assignment?.type,
    }));

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get Assignment Report by id
const getAssignmentReportById = async (req, res) => {
  try {
    const { studentId, assignmentId, studentStartId } = req.query;
    let allData = {};
    let questions = [];
    let correct = 0;
    let wrongAnswer = 0;
    let unAttemptedAnswer = 0;

    //NOTE - get all attempted test details
    const attemptedTest = await StudentTestMap.findAll({
      where: {
        studentId: studentId,
        assignmentId: assignmentId,
        startId: studentStartId,
      },
      attributes: [
        "id",
        "studentId",
        "assignmentId",
        "questionId",
        "answer",
        "status",
        "answerFile",
      ],
      include: [
        {
          model: AssignmentData,
          attributes: [
            "id",
            "testMethod",
            "name",
            "questionCount",
            "markPerQuestion",
            "time",
            "questionFile",
            "answerFile",
          ],
        },
        {
          model: QuestionBank,
          attributes: [
            "id",
            "question",
            "A",
            "B",
            "C",
            "D",
            "answer",
            "explanation",
            "difficultyLevel",
          ],
        },
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    if (attemptedTest.length === 0)
      return res
        .status(400)
        .send({ status: 400, message: msg.TEST_NOT_ATTEMPTED });

    if (attemptedTest[0].answerFile === null) {
      //NOTE - Count for correct answer and wrong answer
      for (const data of attemptedTest) {
        //NOTE: Atttempted with correct answer
        if (data.answer === data.questionBank.answer) {
          correct = correct + 1;
        }
        //NOTE: Atttempted with wrong answer
        if (["A", "B", "C", "D"].includes(data.answer)) {
          if (data.answer !== data.questionBank.answer) {
            wrongAnswer = wrongAnswer + 1;
          }
        }

        //NOTE - Un Attempted question count
        if ([""].includes(data.answer)) {
          unAttemptedAnswer = unAttemptedAnswer + 1;
        }
      }

      //NOTE - Push questions
      for (const data of attemptedTest) {
        questions.push({
          id: data.questionBank.id,
          question: data.questionBank.question,
          A: data.questionBank.A,
          B: data.questionBank.A,
          C: data.questionBank.C,
          D: data.questionBank.D,
          answer: data.questionBank.answer,
          explanation: data.questionBank.explanation,
          difficultyLevel: data.questionBank.difficultyLevel,
          answerGivenByStudent: data.answer !== "" ? data.answer : null,
          questionAttempted: data.answer !== "" ? true : false,
        });
      }

      allData = {
        id: attemptedTest[0]?.id,
        studentId: attemptedTest[0]?.studentId,
        studentName: attemptedTest[0].user?.name,
        assignmentId: attemptedTest[0]?.assignmentId,
        name: attemptedTest[0].assignment?.name,
        questionCount: attemptedTest[0].assignment?.questionCount,
        markPerQuestion: attemptedTest[0].assignment?.markPerQuestion,
        time: attemptedTest[0].assignment?.time,
        testMethod: attemptedTest[0].assignment?.testMethod,
        correctAnswer: correct,
        wrongAnswer: wrongAnswer,
        unAttemptedAnswer: unAttemptedAnswer,
        questions: questions,
      };
    } else {
      allData = {
        id: attemptedTest[0].id,
        studentId: attemptedTest[0]?.studentId,
        studentName: attemptedTest[0].user?.name,
        assignmentId: attemptedTest[0]?.assignmentId,
        name: attemptedTest[0].assignment?.name,
        questionCount: attemptedTest[0].assignment?.questionCount,
        markPerQuestion: attemptedTest[0].assignment?.markPerQuestion,
        time: attemptedTest[0].assignment?.time,
        testMethod: attemptedTest[0].assignment?.testMethod,
        correctAnswer: null,
        wrongAnswer: null,
        unAttemptedAnswer: null,
        questionFile:
          (await getSignedUrlCloudFront(
            attemptedTest[0]?.assignment?.questionFile
          )) || null,
        answerFileByTeacher:
          (await getSignedUrlCloudFront(
            attemptedTest[0]?.assignment?.answerFile
          )) || null,
        answerFileByStudent:
          (await getSignedUrlCloudFront(attemptedTest[0]?.answerFile)) || null,
      };
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allData,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

const getAssignmentQuestionFile = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const studentId = req.user.id; //TODO - get from token

    ///NOTE - Find Assignment details
    const assignmentDetails = await AssignmentData.findOne({
      where: { id: assignmentId },
      attributes: {
        exclude: ["createdById", "createdByType", "createdAt", "updatedAt"],
      },
    });
    if (!assignmentDetails)
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });

    //NOTE - Check if student attempt Assignment or not
    const checkAttempted = await AssignmentStudent.findOne({
      where: {
        assignmentId: assignmentDetails.id,
        studentId: studentId,
        attempted: 0,
      },
    });

    if (checkAttempted) {
      //NOTE - check startTime
      const checkTime = await AssignmentStartTime.findOne({
        where: {
          assignmentId: assignmentDetails.id,
          studentId: studentId,
        },
      });
      if (checkTime) {
        //NOTE -if time is there destroy it
        await AssignmentStartTime.destroy({
          where: {
            assignmentId: assignmentDetails.id,
            studentId: studentId,
          },
        });

        const startAssignment = new AssignmentStartTime({
          assignmentId: assignmentDetails.id,
          studentId: studentId,
          startTime: new Date(),
        });
        await startAssignment.save();
      } else {
        const startAssignment = new AssignmentStartTime({
          assignmentId: assignmentDetails.id,
          studentId: studentId,
          startTime: new Date(),
        });
        await startAssignment.save();
      }
    } else {
      const startAssignment = new AssignmentStartTime({
        assignmentId: assignmentDetails.id,
        studentId: studentId,
        startTime: new Date(),
      });
      await startAssignment.save();
    }

    const result = {
      id: assignmentDetails.id,
      name: assignmentDetails.name,
      time: assignmentDetails.time,
      markPerQuestion: assignmentDetails.markPerQuestion,
      questionFile: assignmentDetails.questionFile
        ? await getSignedUrlCloudFront(assignmentDetails.questionFile)
        : null,
    };
    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

module.exports = {
  createAssignments,
  getAllAssignments,
  getAssignmentById,
  updateAssignmentById,
  deleteAssignmentById,
  getAssignmentsByStudentId,
  getQuestionByAssignmentId,
  uploadAnswerSheet,
  assignmentAtttempted,
  getAllAssignmentReports, //TODO - use in admin panel
  getAssignmentReportById, //TODO - use in admin panel
  getAssignmentQuestionFile, //TODO - use in web and mobile app
};
