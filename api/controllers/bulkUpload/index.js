const { Sequelize, Op } = require("sequelize");
const _ = require("lodash");
const mammoth = require("mammoth");
const cheerio = require("cheerio");
const db = require("../../models/index");
const msg = require("../../constants/Messages");
const bcrypt = require("bcryptjs");
const { config } = require("../../config/db.config");
const { captureLead } = require("../users/service");
const {
  generateVedaIdForStudent,
  generateVedaIdForParent,
} = require("../users/service");
const {
  convertFile,
  validateUsers,
  validateBatches,
  pushToS3Bucket,
  validateStaff,
  validateRole,
  validateClassDetails,
  validateChapter,
  validateTopic,
  validateChapterTopic,
  validateState,
  validateSubject,
  validatecategory,
  checkVideoFilename,
  AllName,
  isHtmlTableEmpty,
  difficultyLevel,
  extractAnswer
} = require("./service");
const getSignedUrl = require("../../helpers/getSignedUrl");
const { profilePercentage } = require("../students/service");
const {
  removeTdTags,
  removeHtmlTags,
  removeParentheses,
} = require("../../helpers/htmlElements");
const { convertDayIntoDate } = require("../../helpers/service");
const { getSignedUrlCloudFront } = require("../../helpers/cloudFront");
const { log } = require("@grpc/grpc-js/build/src/logging");
const { getBase64ExtensionTypeTwo } = require("../../helpers/service");
const questionBank = db.questionBank;
const UserDetails = db.users;
const TeacherDetails = db.teachers;
const AdminDetails = db.admin;
const RolePermission = db.permissionRole;
const TeacherSubjectDetails = db.teacher_subject_map;
const StudentDetails = db.student;
const BulkUploadFiles = db.bulkUploadFiles;
const revisionTitleMap = db.revision_title_map;
const Topic = db.topic;
const RevisionDetails = db.revisions;
const Content = db.content;
const Chapter = db.chapter;
const State = db.state;
const City = db.city;
const StudentPlanMap = db.student_plan_map;
const ParentDetails = db.parent;
const parentStudentmap = db.parent_student_map;
const grievanceCategory = db.grievance_category;
const grievanceSubCategory = db.grievance_subCategory;
const NewContent = db.new_content;
const contentCourseMap = db.content_course_map;
const axios = require("axios");
const FormData = require('form-data');

//ANCHOR : get all Bulk files
const getAllBulkFiles = async (req, res) => {
  try {
    const { page, limit, search, fileType } = req.query;

    //NOTE - add pagination
    const query =
      page && limit
        ? {
          offset: Number(page - 1) * limit,
          limit: Number(limit),
        }
        : {};

    //NOTE - Search value
    const val = search
      ? { [Op.or]: [{ fileType: { [Op.like]: "%" + search + "%" } }] }
      : undefined;

    //NOTE - get file type
    const type = fileType ? { fileType: fileType } : {};

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user.role.toLowerCase())) {
        params = {
          createdById: req.user.id,
        };
      }

    const { count, rows } = await BulkUploadFiles.findAndCountAll({
      ...query,
      where: { ...type, ...val, ...params },

      include: [
        {
          model: AdminDetails,
          as: "creator",
          attributes: ["id", "name"],
          include: {
            model: RolePermission,
            attributes: ["role"],
          },
        },
        {
          model: AdminDetails,
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

    if (!rows) {
      return res
        .status(200)
        .send({ status: 200, message: msg.NOT_FOUND, data: [] });
    }

    const getAllFiles = rows.map(async (data) => {
      const {
        id,
        fileType,
        uploadedDate,
        uploadFileUrl,
        errorFileUrl,
        status,
        creator,
        updater,
        chapterId,
      } = data;

      let FinalData;
      if (fileType === "question" && chapterId !== null) {
        FinalData = await AllName(chapterId);
      }

      return {
        id,
        fileType,
        uploadedDate,
        uploadFileUrl: uploadFileUrl
          ? await getSignedUrlCloudFront(uploadFileUrl)
          : null,
        errorFileUrl: errorFileUrl
          ? await getSignedUrlCloudFront(errorFileUrl)
          : null,
        status,
        course: FinalData?.course || null,
        board: FinalData?.board || null,
        class: FinalData?.class || null,
        batchType: FinalData?.batchType || null,
        subject: FinalData?.subject || null,
        chapter: FinalData?.chapter || null,
        createdByName: creator?.name || null,
        createdByRole: creator?.permission_role?.role || null,
        updateByName: updater?.name || null,
        updateByRole: updater?.permission_role?.role || null,
      };
    });

    // If you need to await the completion of all the promises in getAllFiles array:
    const allFiles = await Promise.all(getAllFiles);

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: allFiles,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Upload excel for student
const uploadStudentExcel = async (req, res) => {
  try {
    const { file } = req.body;
    const errorArray = [];
    const successArray = [];
    const base64Encoded = file.split(";base64,").pop();

    //NOTE - getting id from  token
    const userId = req.user.id;

    //NOTE - Convert base64 to jsoon format
    const convertFileToBase64 = await convertFile(base64Encoded);

    // NOTE : Push pending status
    const createStaus = await BulkUploadFiles.create({
      fileType: "student",
      status: "pending",
      uploadedDate: new Date(),
      createdById: userId,
    });

    res.send({ status: 200, message: msg.STUDENT_EXCEL_UPLOAD });

    //NOTE - check  the json and push to the repo
    for (const user of convertFileToBase64) {
      const usersObject = {
        name: user["Name"],
        phone: user["Mobile Number"],
        email: user["Email"],
        mPin: user["Mpin"],
        course: user["Course"],
        board: user["Board"],
        class: user["Class"],
        batchType: user["Batch Type"],
        batchStartDate: user["Batch Start Date"],
        subscriptionType: user["Subscription Type"],
        validityDay: user["Days"],
      };

      if (
        usersObject &&
        usersObject.mPin !== undefined &&
        usersObject.phone !== undefined &&
        usersObject.email !== undefined &&
        usersObject.subscriptionType !== undefined
      ) {
        //let mPinCoverter = toString(usersObject.mPin);

        //NOTE - Encrypt Mpin
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(
          usersObject.mPin.toString(),
          salt
        );

        //NOTE - Validate the user based on email and phone
        const validateUser = await validateUsers(usersObject);

        //NOTE - Validate all course ,board, class and batchType
        const { status, courseId, boardId, classId, batchTypeId, batchDateId } =
          await validateBatches(usersObject);

        let validityDayStatus = false;
        let validityDate;

        //NOTE - Check subscriptionType  by regex
        const regex = /Premium|Free/i;
        const string = usersObject.subscriptionType;

        let convertSubscriptionType;

        if (regex.test(string)) {
          switch (string.toLowerCase()) {
            case "premium":
              convertSubscriptionType = "Premium";
              break;
            case "free":
              convertSubscriptionType = "Free";
              break;
          }
        }

        //NOTE - if subscriptionType is Premium
        if (
          ["Premium"].includes(convertSubscriptionType) &&
          (usersObject.validityDay < 1 || usersObject.validityDay === undefined)
        ) {
          validityDayStatus = true;
        } else if (
          ["Premium"].includes(convertSubscriptionType) &&
          usersObject.validityDay >= 1
        ) {
          //NOTE - convert validity days into date
          validityDate = await convertDayIntoDate(usersObject.validityDay);
        }
        //NOTE - if error push to error object
        if (
          validateUser === true ||
          status === true ||
          status === undefined ||
          validityDayStatus === true
        ) {
          errorArray.push(usersObject);
        } else if (
          validateUser === false &&
          status === false &&
          validityDayStatus === false
        ) {
          try {
            //NOTE - if no error push to user table
            const studentData = new StudentDetails({
              courseId: courseId,
              boardId: boardId,
              classId: classId,
              batchTypeId: batchTypeId,
              batchStartDateId: batchDateId,
              referralCode: Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase(), //TODO - Generate referralCode
            });
            const getStudent = await studentData.save();

            //NOTE - if no error push to student table
            const userData = await UserDetails.create({
              name: usersObject.name,
              email: usersObject.email,
              phone: usersObject.phone,
              mPin: hashedPassword,
              studentType: "Primary",
              type: "Student",
              typeId: getStudent.id,
              subscriptionType: convertSubscriptionType,
              createdById: userId,
            });

            //NOTE - update the veda user id
            UserDetails.update(
              {
                vedaId: generateVedaIdForStudent(userData.id),
              },
              { where: { id: userData.id } }
            );

            //NOTE - create parent for primary user only
            const parentData = await ParentDetails.create({
              dob: null,
              gender: null,
              occupation: null,
            });

            //NOTE - create parent in user table
            const parentUser = await UserDetails.create({
              phone: usersObject.phone,
              mPin: hashedPassword,
              type: "Parent",
              subscriptionType: null,
              parentTypeId: parentData.id,
              createdById: userId,
            });

            //NOTE - update the veda user id
            UserDetails.update(
              {
                vedaId: generateVedaIdForParent(parentUser.id),
              },
              { where: { id: parentUser.id } }
            );

            //NOTE - create parent user map table
            await parentStudentmap.create({
              parentId: parentUser.id,
              studentId: userData.id,
              relationship: "Father",
            });
            //NOTE - push all subscription details in student_plan_map table
            await StudentPlanMap.create({
              userId: userData.id,
              subscriptionType: convertSubscriptionType,
              validityDay: ["Premium"].includes(convertSubscriptionType)
                ? usersObject.validityDay
                : null,
              validityDate: ["Premium"].includes(convertSubscriptionType)
                ? validityDate
                : null,
              entryType: ["Premium"].includes(convertSubscriptionType)
                ? "Purchase"
                : "Manually",
              createdById: userId,
              createdByType: "Admin",
            });

            //NOTE - Calculate Profile percentage
            const percentage = await profilePercentage(userData.id);

            UserDetails.update(
              { profilePercentage: percentage },
              { where: { id: userData.id } }
            );

            //NOTE - lead capture
            await captureLead(
              config.LEADSQUARD_API_KEY,
              config.LEADSQUARD_CLIENT_SECRET,
              config.LEADSQUARD_HOST,
              usersObject.name,
              usersObject.course,
              usersObject.board,
              usersObject.class,
              usersObject.phone
            );
            //NOTE - if no error push to success object
            successArray.push(usersObject);
          } catch (error) {
            errorArray.push(usersObject);
          }
        }
      }
    }

    //NOTE - Get Url for success object
    if (successArray && successArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        successArray,
        msg.STUDENT_BULK_UPLOAD
      );

      await BulkUploadFiles.update(
        {
          fileType: "student",
          status: "success",
          uploadedDate: new Date(),
          uploadFileUrl: fileUrl,
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }

    //NOTE - Get Url for Error object
    if (errorArray && errorArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        errorArray,
        msg.STUDENT_BULK_UPLOAD_ERROR
      );

      await BulkUploadFiles.update(
        {
          fileType: "student",
          errorFileUrl: fileUrl,
          uploadedDate: new Date(),
          status: successArray.length === 0 ? "error" : "success",
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }
  } catch (error) {
    await BulkUploadFiles.create({
      fileType: "student",
      status: "Server Error",
      uploadedDate: new Date(),
    });
    return;
  }
};

//ANCHOR - Upload Excel for Staff
const uploadStaffExcel = async (req, res) => {
  try {
    const { file } = req.body;
    const errorArray = [];
    const successArray = [];

    const base64Encoded = file.split(";base64,").pop();

    //NOTE - getting id from  token
    const userId = req.user.id;

    //NOTE - Convert base64 to json format
    const convertToJson = await convertFile(base64Encoded);

    //NOTE : Push pending status
    const createStaus = new BulkUploadFiles({
      fileType: "staff",
      status: "pending",
      uploadedDate: new Date(),
      createdById: userId,
    });

    await createStaus.save();

    res.send({ status: 200, message: msg.STAFF_EXCEL_UPLOAD });

    //NOTE - check  the json and push to the repo
    for (const staff of convertToJson) {
      const staffObject = {
        name: staff["name"],
        email: staff["email"],
        phone: staff["phone"],
        password: staff["password"],
        role: staff["role"],
        class: staff["class"],
        subject: staff["subject"],
      };

      if (staffObject) {
        //let passwordCoverter = toString(staffObject.password);

        //NOTE - HASH PASSWORD
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(
          staffObject.password.toString(),
          salt
        );

        //NOTE - Validate the user based on email and phone
        const validateUser = await validateStaff(staffObject);

        //NOTE - Validate  role
        const [roleStatus, roleId, role] = await validateRole(staffObject);

        //NOTE - Validate  class and subject
        const [status, courseId, boardId, classId, subjectId, batchTypeId] =
          await validateClassDetails(staffObject);

        //NOTE - if error push to error object
        if (validateUser === true || status === true || roleStatus === true) {
          errorArray.push(staffObject);
        } else if (
          validateUser === false &&
          status === false &&
          roleStatus === false
        ) {
          let getTeacher;

          //NOTE - If role comes as teacher or mentor
          if (["teacher", "mentor", "Teacher", "Mentor"].includes(role)) {
            //NOTE - if no error push to teacher table
            const teacher_user = new TeacherDetails({
              dob: null,
            });
            getTeacher = await teacher_user.save();
          }

          //NOTE - push in teacher table
          const admin_user = new AdminDetails({
            name: staffObject.name,
            email: staffObject.email,
            phone: staffObject.phone,
            department: roleId,
            password: hashedPassword,
            typeId: getTeacher ? getTeacher.id : null,
            createdById: userId,
          });

          const adminData = await admin_user.save();

          //NOTE - push Subject in  teacher_subject_map table
          const push_subject_map = new TeacherSubjectDetails({
            teacherId: adminData.id,
            courseId: courseId,
            boardId: boardId,
            classId: classId,
            subjectId: subjectId,
            batchTypeId: batchTypeId,
          });
          await push_subject_map.save();

          //NOTE - if no error push to success object
          successArray.push(staffObject);
        }
      }
    }

    // NOTE - Get Url for success object
    if (successArray && successArray.length > 0) {
      const fileUrl = await pushToS3Bucket(successArray, msg.STAFF_BULK_UPLOAD);

      await BulkUploadFiles.update(
        {
          fileType: "staff",
          status: "success",
          uploadedDate: new Date(),
          uploadFileUrl: fileUrl,
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }

    //NOTE - Get Url for Error object
    if (errorArray && errorArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        errorArray,
        msg.STAFF_BULK_UPLOAD_ERROR
      );

      await BulkUploadFiles.update(
        {
          fileType: "staff",
          errorFileUrl: fileUrl,
          uploadedDate: new Date(),
          status: successArray.length === 0 ? "error" : "success",
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }
  } catch (error) {
    await BulkUploadFiles.create({
      fileType: "staff",
      status: "Server Error",
      uploadedDate: new Date(),
    });
    return;
  }
};

//ANCHOR - Upload bulk of questions
const uploadQuestions = async (req, res) => {
  try {
    const { file } = req.body;
    const errorArray = [];
    const successArray = [];
    const base64Encoded = file.split(";base64,").pop();
    let chapter;

    //NOTE - getting id from  token
    const userId = req.user.id;

    //const extension = await getBase64ExtensionTypeTwo(file);

    //NOTE - Convert base64 to jsoon format
    const convertFileToBase64 = await convertFile(base64Encoded);

    //NOTE : Push pending status
    const createStaus = new BulkUploadFiles({
      fileType: 'question',
      status: 'pending',
      uploadedDate: new Date(),
      createdById: userId,
    });

    await createStaus.save();


    await res.json({ status: 200, message: "question bulk uploading" });
    //NOTE - check  the json and push to the repo
    for (const ques of convertFileToBase64) {
      const questionObject = {
        course: ques.Course,
        board: ques.Board,
        class: ques.Class,
        batchType: ques.Batch,
        subject: ques.Subject,
        chapter: ques.Chapter,
      };

      if (questionObject) {
        //NOTE - topic
        const {
          status,
          courseId,
          boardId,
          classId,
          batchTypeId,
          subjectId,
          chapterId,
        } = await validateChapterTopic(questionObject);
        chapter = chapterId;
        //NOTE - if error push to error object
        if (status === undefined || status === true) {
          errorArray.push(questionObject);
        } else if (status === false) {
          //NOTE - if no error push to question table

          await questionBank.create({
            courseId: courseId,
            boardId: boardId,
            classId: classId,
            batchTypeId: batchTypeId,
            subjectId: subjectId,
            chapterId: chapterId,
            question: `<p>${ques.Question}</p>`,
            A: `<p>${ques.A}</p>`,
            B: `<p>${ques.B}</p>`,
            C: `<p>${ques.C}</p>`,
            D: `<p>${ques.D}</p>`,
            answer: ques.correctAnswer,
            explanation: `<p>${ques.Explanation}</p>`,
            difficultyLevel: ques.DifficultyLevel,
            createdById: userId,
          });

          //NOTE - if no error push to success object
          successArray.push(questionObject);
        }
      }
    }

    await BulkUploadFiles.update(
      {
        chapterId: chapter,
      },
      { where: { id: createStaus.id } }
    );
    //NOTE - Get Url for success object
    if (successArray && successArray.length > 0) {
      const fileUrl = await pushToS3Bucket(successArray, 'question uploaded');
      await BulkUploadFiles.update(
        {
          fileType: 'question',
          status: 'success',
          uploadedDate: new Date(),
          uploadFileUrl: fileUrl,
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }

    //NOTE - Get Url for Error object
    if (errorArray && errorArray.length > 0) {
      const fileUrl = await pushToS3Bucket(errorArray, 'question upload error');

      await BulkUploadFiles.update(
        {
          fileType: 'question',
          errorFileUrl: fileUrl,
          uploadedDate: new Date(),
          status: successArray.length === 0 ? 'error' : 'success',
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }

  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Upload excel for student
const uploadTopicExcel = async (req, res) => {
  try {
    const { file } = req.body;
    let errorArray = [];
    let successArray = [];
    let base64Encoded = file.split(";base64,").pop();

    //NOTE - getting id from  token
    const userId = req.user.id;

    //NOTE - Convert base64 to json format
    const convertFileToBase64 = await convertFile(base64Encoded);

    //NOTE : Push pending status
    const createStaus = new BulkUploadFiles({
      fileType: "topic",
      status: "pending",
      uploadedDate: new Date(),
      createdById: userId,
    });

    await createStaus.save();

    res.send({ status: 200, message: "TOPIC BULK UPLOADING" });

    //NOTE - check  the json and push to the repo
    for (const topic of convertFileToBase64) {
      const requiredKeys = [
        "course",
        "board",
        "class",
        "batch",
        "subject",
        "chapter",
      ];
      const missingKeys = requiredKeys.filter(
        (key) => topic[key] === undefined
      );
      //NOTE - checking length of key
      if (missingKeys.length > 0) {
        const topicObject = {
          course: topic.course,
          board: topic.board,
          class: topic.class,
          batch: topic.batch,
          subject: topic.subject,
          chapter: topic.chapter,
          topic: topic.topic,
          reason: missingKeys.map((key) => `${key} not found`).join(", "),
        };
        errorArray.push(topicObject);
      }

      //NOTE - if all data come
      if (
        topic.course &&
        topic.board &&
        topic.class &&
        topic.batch &&
        topic.subject &&
        topic.chapter
      ) {
        const topicObject = {
          course: topic["course"],
          board: topic["board"],
          class: topic["class"],
          batch: topic["batch"],
          subject: topic["subject"],
          chapter: topic["chapter"],
          topic: topic["topic"],
          reason: null,
        };

        //NOTE - if no value is undefined
        if (topicObject) {
          //NOTE - Validate all course ,board, class ,batchType, subject and chapter
          const {
            status,
            courseId,
            boardId,
            classId,
            batchTypeId,
            subjectId,
            chapterId,
            reason,
          } = await validateChapter(topicObject);

          //NOTE - insert reason in to topicObject
          topicObject.reason = reason;

          //NOTE - if error push to error object
          if (status === undefined || status === true) {
            errorArray.push(topicObject);
          } else if (status === false) {
            //NOTE - if no error push to TOPIC table
            const Topics = await Topic.findOne({
              where: {
                courseId: courseId,
                boardId: boardId,
                classId: classId,
                batchTypeId: batchTypeId,
                subjectId: subjectId,
                chapterId: chapterId,
                name:
                  typeof topicObject.topic === "string"
                    ? Sequelize.where(
                      Sequelize.fn("LOWER", Sequelize.col("name")),
                      Sequelize.fn(
                        "LOWER",
                        topicObject.topic.replace(/\s+/g, " ").trim()
                      )
                    )
                    : topicObject.topic,
              },
            });
            //NOTE - if topic found
            if (Topics) {
              topicObject.reason = "Topic already exists";
              errorArray.push(topicObject);
            }
            //NOTE - if topic not found
            if (!Topics || Topics === null) {
              await Topic.create({
                courseId: courseId,
                boardId: boardId,
                classId: classId,
                batchTypeId: batchTypeId,
                subjectId: subjectId,
                chapterId: chapterId,
                name: topicObject.topic.replace(/\s+/g, " ").trim(),
                createdById: userId,
              });
              //NOTE - if no error push to success object
              successArray.push(topicObject);
            }
          }
        }
      }
    }

    //NOTE - Get Url for success object
    if (successArray && successArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        successArray,
        msg.TOPIC_UPLOAD_SUCCESS
      );
      await BulkUploadFiles.update(
        {
          fileType: "topic",
          status: "success",
          uploadedDate: new Date(),
          uploadFileUrl: fileUrl,
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }

    //NOTE - Get Url for Error object
    if (errorArray && errorArray.length > 0) {
      const fileUrl = await pushToS3Bucket(errorArray, msg.TOPIC_UPLOAD_ERROR);
      await BulkUploadFiles.update(
        {
          fileType: "topic",
          errorFileUrl: fileUrl,
          uploadedDate: new Date(),
          status: successArray.length === 0 ? "error" : "success",
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }
  } catch (error) {
    await BulkUploadFiles.create({
      fileType: "topic",
      status: "Server Error",
      uploadedDate: new Date(),
    });
    return;
  }
};
//ANCHOR - Upload excel for student
const uploadRevisionExcel = async (req, res) => {
  try {
    const { file } = req.body;
    let errorArray = [];
    let successArray = [];
    let base64Encoded = file.split(";base64,").pop();

    //NOTE - Convert base64 to jsoon format
    const convertFileToBase64 = await convertFile(base64Encoded);

    //NOTE - id form token
    const userId = req.user.id;

    let lastCompleteObj = null;
    let final = [];
    for (const revision of convertFileToBase64) {
      if (
        !revision["course"] &&
        !revision["board"] &&
        !revision["class"] &&
        !revision["batch"] &&
        !revision["subject"] &&
        !revision["chapter"]
      ) {
        // Add the revision to the last object that has all values
        if (lastCompleteObj) {
          if (revision["title"]) {
            lastCompleteObj.list.push({
              title: revision["title"],
              description: revision["description"],
              image_name: revision["image_name"],
            });
          }
        }
      } else {
        // Create a new object with the revision data
        let newObj = {
          course: revision["course"] || "",
          board: revision["board"] || "",
          class: revision["class"] || "",
          batch: revision["batch"] || "",
          subject: revision["subject"] || "",
          chapter: revision["chapter"] || "",
          category: revision["category"] || "",
          topic: revision["topic"] || "",
          list: [
            {
              title: revision["title"],
              description: revision["description"],
              image_name: revision["image_name"],
            },
          ],
        };

        // Check if the new object has any empty values
        const hasEmptyValues =
          newObj.course === "" ||
          newObj.board === "" ||
          newObj.class === "" ||
          newObj.batch === "" ||
          newObj.subject === "" ||
          newObj.chapter === "";

        // Add the new object to the final array
        if (hasEmptyValues) {
          // Add the list to the previous object that has all values
          if (lastCompleteObj) {
            if (revision["title"]) {
              lastCompleteObj.list.push({
                title: revision["title"],
                description: revision["description"],
                image_name: revision["image_name"],
              });
            }
          }
        } else {
          // Add the new object to the final array
          final.push(newObj);
          lastCompleteObj = newObj;
        }
      }
    }

    // If the last object doesn't have all values, remove it from the final array
    if (
      final.length > 0 &&
      (!lastCompleteObj ||
        !(
          lastCompleteObj.course &&
          lastCompleteObj.board &&
          lastCompleteObj.class &&
          lastCompleteObj.batch &&
          lastCompleteObj.subject &&
          lastCompleteObj.chapter
        ))
    ) {
      final.pop();
    }

    //NOTE : Push pending status
    const createStaus = new BulkUploadFiles({
      fileType: "revision",
      status: "pending",
      uploadedDate: new Date(),
      createdById: userId,
    });

    await createStaus.save();

    res.json({ status: 200, message: "revision bulk uploading" });
    //NOTE - check  the json and push to the repo
    for (const revision of final) {
      const revisionObject = {
        course: revision["course"],
        board: revision["board"],
        class: revision["class"],
        batch: revision["batch"],
        subject: revision["subject"],
        chapter: revision["chapter"],
        category: revision["category"],
        topic: revision["topic"],
        list: revision.list,
      };

      if (revisionObject) {
        //NOTE - Validate all course ,board, class ,batchType, subject and chapter
        const {
          status,
          courseId,
          boardId,
          classId,
          batchTypeId,
          subjectId,
          chapterId,
        } = await validateChapter(revisionObject);
        //NOTE - if error push to error object
        if (status === undefined || status === true) {
          errorArray.push(revisionObject);
        } else if (status === false) {
          try {
            //NOTE - CHECKING CATEGORY by regex
            const regex = /Summary|Questions|Quick Bites/i;
            const string = revisionObject.category;

            let cat;
            if (regex.test(string)) {
              switch (string.toLowerCase()) {
                case "summary":
                  cat = "Summary";
                  break;
                case "questions":
                  cat = "Questions";
                  break;
                case "quick bites":
                  cat = "Quick Bites";
                  break;
              }
            }

            //NOTE - CHECKING TOPIC by regex
            const topicRegex = /^Definition$|^Diagram$|^Application$/i;
            const topics = revisionObject.topic;

            let top;
            if (topics) {
              if (topicRegex.test(topics)) {
                switch (topics.toLowerCase()) {
                  case "definition":
                    top = "Definition";
                    break;
                  case "diagram":
                    top = "Diagram";
                    break;
                  case "application":
                    top = "Application";
                    break;
                }
              }
            }

            //NOTE - push to revision table
            const createNewRevision = await RevisionDetails.create({
              courseId: courseId,
              boardId: boardId,
              classId: classId,
              batchTypeId: batchTypeId,
              subjectId: subjectId,
              chapaterId: chapterId,
              topic: top ? top : null,
              category: cat,
              createdById: userId,
            });

            for (let data of revisionObject.list) {
              await revisionTitleMap.create({
                revisionId: createNewRevision.id,
                title: data.title ? data.title : null,
                description: data.description ? data.description : null,
                image: data.image_name ? data.image_name : null,
              });
            }
            //NOTE - if no error push to success object
            successArray.push(revisionObject);
          } catch (error) {
            errorArray.push(revisionObject);
          }
        }
      }
    }

    //NOTE - Get Url for success object
    if (successArray && successArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        successArray,
        msg.REVISION_UPLOAD_SUCCESS
      );

      await BulkUploadFiles.update(
        {
          fileType: "revision",
          status: "success",
          uploadedDate: new Date(),
          uploadFileUrl: fileUrl,
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }

    //NOTE - Get Url for Error object
    if (errorArray && errorArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        errorArray,
        msg.REVISION_UPLOAD_ERROR
      );

      await BulkUploadFiles.update(
        {
          fileType: "revision",
          errorFileUrl: fileUrl,
          uploadedDate: new Date(),
          status: successArray.length === 0 ? "error" : "success",
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }
  } catch (error) {
    await BulkUploadFiles.create({
      fileType: "revision",
      status: "Server Error",
      uploadedDate: new Date(),
    });
    return;
  }
};

//ANCHOR - Upload excel for CONTENT
const uploadBulkContent = async (req, res) => {
  try {
    const { file } = req.body;
    let errorArray = [];
    let successArray = [];
    let base64Encoded = file.split(";base64,").pop();

    //NOTE - getting id from  token
    const token = req.user.id;

    //NOTE - Convert base64 to jsoon format
    const convertFileToBase64 = await convertFile(base64Encoded);

    //NOTE : Push pending status
    const createStaus = await BulkUploadFiles.create({
      fileType: "content",
      status: "pending",
      uploadedDate: new Date(),
      createdById: token,
    });

    res.send({ status: 200, message: msg.CONTENT_BULK_UPLOADING });

    //NOTE - check  the json and push to the repo
    for (const content of convertFileToBase64) {
      const contentObject = {
        course: content["course"],
        board: content["board"],
        class: content["class"],
        batch: content["batch"],
        subject: content["subject"],
        chapter: content["chapter"],
        topic: content["topic"],
        tag: content["tag"],
        source: content["source"],
        resourceType:
          content["tag"] === "Help Resource" ||
            content["tag"] === "help_resource"
            ? content["resource_type"]
            : null,
        sourceFile: content["video_name"],
        thumbnailFile: content["thumbnail_name"],
        //resourceFile: content["resources_name"],
      };

      if (
        content["course"] === undefined ||
        content["board"] === undefined ||
        content["class"] === undefined ||
        content["batch"] === undefined ||
        content["subject"] === undefined ||
        content["chapter"] === undefined ||
        content["topic"] === undefined
      ) {
        errorArray.push(contentObject);
      }

      //NOTE - validate video file name
      const videoFile = await checkVideoFilename(contentObject.sourceFile);
      if (!videoFile) {
        errorArray.push(contentObject);
      }

      //NOTE - if content object is validate
      if (contentObject && videoFile === true) {
        //NOTE - topic
        const {
          status,
          courseId,
          boardId,
          classId,
          batchTypeId,
          subjectId,
          chapterId,
          topicId,
        } = await validateTopic(contentObject);
        //NOTE - if error push to error object
        if (status === undefined || status === true) {
          errorArray.push(contentObject);
        } else if (status === false) {
          try {
            //NOTE - if no error push to content table
            await Content.create({
              courseId: courseId,
              boardId: boardId,
              classId: classId,
              batchTypeId: batchTypeId,
              subjectId: subjectId,
              chapterId: chapterId,
              topicId: topicId,
              tag: contentObject.tag,
              source: contentObject.source ? contentObject.source : "upload",
              resourceType: contentObject.resourceType
                ? contentObject.resourceType
                : null,
              sourceFile: contentObject.sourceFile
                ? `content-video/${contentObject.sourceFile}`
                : null,
              thumbnailFile: contentObject.thumbnailFile
                ? `content-thumbnail/${contentObject.thumbnailFile}`
                : null,
              createdById: token,
            });

            //NOTE - if no error push to success object
            successArray.push(contentObject);
          } catch (error) {
            errorArray.push(contentObject);
          }
        }
      }
    }

    //NOTE - Get Url for success object
    if (successArray && successArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        successArray,
        msg.CONTENT_UPLOAD_SUCCESS
      );

      await BulkUploadFiles.update(
        {
          fileType: "content",
          status: "success",
          uploadedDate: new Date(),
          uploadFileUrl: fileUrl,
          updatedById: token,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }

    // //NOTE - Get Url for Error object
    if (errorArray && errorArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        errorArray,
        msg.CONTENT_UPLOAD_ERROR
      );

      await BulkUploadFiles.update(
        {
          fileType: "content",
          errorFileUrl: fileUrl,
          uploadedDate: new Date(),
          status: successArray.length === 0 ? "error" : "success",
          updatedById: token,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }
  } catch (error) {
    await BulkUploadFiles.create({
      fileType: "content",
      status: "Server Error",
      uploadedDate: new Date(),
    });
    return;
  }
};

//ANCHOR - UPLOAD QUESTION BANK UPDATED
const uploadQuestionBank = async (req, res) => {
  try {
    const errorArray = [];
    const successArray = [];
    let chapter;

    //NOTE - getting id from  token
    const userId = req.user.id;

    if (!req?.file?.buffer) {
      return res
        .status(400)
        .send({ status: 400, message: "File is required!" });
    }
    if (!_.includes(req.file.originalname, ".docx")) {
      return res
        .status(400)
        .send({ status: 400, message: "File type is Invalid!" });
    }

    const buffer = req.file.buffer;
    const result = await mammoth.convertToHtml({ buffer });
    const $ = cheerio.load(result.value);
    const rows = $("table tr");

    const extractData = (row) => {
      return new Promise((resolve, reject) => {
        const cells = $(row).find("td");
        let counter = 1;
        let temp = { column1: "", column2: "" };

        cells.each(async (j, cell) => {
          const pTagHtml = $.html(cell);

          if (counter === 1) {
            temp.column1 = $(cell).text();
          } else {
            temp.column2 = removeTdTags(String(pTagHtml));
          }

          counter += 1;
        });
        resolve(temp);
      });
    };

    const promises = [];

    rows.each((i, row) => {
      if (_.some(row, (value) => !_.isEmpty(value))) {
        promises.push(extractData(row));
      }
    });

    Promise.all(promises)
      .then(async (results) => {
        const filterIn = _.filter(results, (ev) => ev.column1 !== "");
        const firstFive = _.take(filterIn, 6);
        const remaining = _.drop(filterIn, 6);
        const info = firstFive.reduce((acc, cur) => {
          acc[cur.column1] = removeHtmlTags(cur.column2);
          return acc;
        }, {});

        const result = _.chain(info)
          .mapValues((value) => _.trim(value))
          .mapKeys((value, key) =>
            _.trim(key.replace(/\s+/g, "")).toLowerCase().replace(" ", "")
          )
          .mapValues((value, key) => _.trim(value.replace(/\s+/g, " ")))
          .value();

        const formattedData = [];

        for (let i = 0; i < remaining.length; i += 8) {
          let questionObj = {};
          questionObj.question = remaining[i]?.column2;
          questionObj.option1 = remaining[i + 1]?.column2;
          questionObj.option2 = remaining[i + 2]?.column2;
          questionObj.option3 = remaining[i + 3]?.column2;
          questionObj.option4 = remaining[i + 4]?.column2;
          questionObj.correctAnswer = _.capitalize(
            _.trim(removeParentheses(removeHtmlTags(remaining[i + 5]?.column2)))
          );
          questionObj.explanation = remaining[i + 6]?.column2;
          questionObj.difficultyLevel = removeHtmlTags(
            remaining[i + 7]?.column2
          );
          formattedData.push(questionObj);
        }

        //NOTE : Push pending status
        const createStaus = await BulkUploadFiles.create({
          fileType: "question",
          status: "pending",
          uploadedDate: new Date(),
          createdById: userId,
        });
        createStaus.save();

        res.json({ status: 200, message: msg.QUESTION_EXCEL_UPLOAD });

        //NOTE - check  the json and push to the repo
        for (const ques of formattedData) {
          const requiredKeys = [
            "course",
            "board",
            "class",
            "batchtype",
            "subject",
            "chapter",
          ];
          const missingKeys = requiredKeys.filter(
            (key) => result[key] === undefined
          );
          //NOTE - checking if result any value is undefined
          if (missingKeys.length > 0) {
            const questionObject = {
              course: result?.course,
              board: result.board,
              class: result.class,
              batchType: result.batchtype,
              subject: result.subject,
              chapter: result.chapter,
              question: ques.question,
              option1: ques.option1,
              option2: ques.option2,
              option3: ques.option3,
              option4: ques.option4,
              correctAnswer: ques.correctAnswer,
              explanation: ques.explanation,
              difficultyLevel: ques.difficultyLevel,
              reason: missingKeys.map((key) => `${key} not found`).join(", "),
            };
            errorArray.push(questionObject);
          }

          //NOTE - if result all key present
          const requireKey = [
            "question",
            "option1",
            "option2",
            "option3",
            "option4",
            "correctAnswer",
            "difficultyLevel",
          ];
          const missingKey = requireKey.filter(
            (key) => ques[key] === undefined || ques[key] === ""
          );
          //NOTE - checking length of key
          if (missingKey.length > 0) {
            const questionObject = {
              course: result?.course,
              board: result.board,
              class: result.class,
              batchType: result.batchtype,
              subject: result.subject,
              chapter: result.chapter,
              question: ques.question,
              option1: ques.option1,
              option2: ques.option2,
              option3: ques.option3,
              option4: ques.option4,
              correctAnswer: ques.correctAnswer,
              explanation: ques.explanation,
              difficultyLevel: ques.difficultyLevel,
              reason: missingKey.map((key) => `${key} not found`).join(", "),
            };
            errorArray.push(questionObject);
          }

          //NOTE - if all value come
          if (
            ques.question !== "" &&
            ques.option1 !== "" &&
            ques.option2 !== "" &&
            ques.option3 !== "" &&
            ques.option4 !== "" &&
            ques.correctAnswer !== "" &&
            ques.difficultyLevel !== ""
          ) {
            const questionObject = {
              course: result?.course,
              board: result.board,
              class: result.class,
              batchType: result.batchtype,
              subject: result.subject,
              chapter: result.chapter,
              question: ques.question,
              option1: ques.option1,
              option2: ques.option2,
              option3: ques.option3,
              option4: ques.option4,
              correctAnswer: ques.correctAnswer,
              explanation: ques.explanation,
              difficultyLevel: ques.difficultyLevel,
              reason: null,
            };

            if (questionObject) {
              //NOTE - topic
              const {
                status,
                courseId,
                boardId,
                classId,
                batchTypeId,
                subjectId,
                chapterId,
                reason,
              } = await validateChapterTopic(questionObject);
              //NOTE - insert reason into question object
              questionObject.reason = reason;
              //NOTE - get chapter id
              chapter = chapterId;
              //NOTE - if error push to error object
              if (
                status === undefined ||
                status === true ||
                ques.difficultyLevel === ""
              ) {
                errorArray.push(questionObject);
              } else if (status === false) {
                //NOTE - if no error push to TOPIC table
                try {
                  //NOTE - CHECKING DIFFICULTY LEVEL by regex
                  const regex = /Easy|Medium|Hard/i;
                  const string = ques.difficultyLevel;

                  let diff;
                  if (regex.test(string)) {
                    switch (string.toLowerCase()) {
                      case "easy":
                        diff = "Easy";
                        break;
                      case "medium":
                        diff = "Medium";
                        break;
                      case "hard":
                        diff = "Hard";
                        break;
                    }
                  }
                  //NOTE - bulk uploading  on database
                  questionBank.create({
                    courseId: courseId,
                    boardId: boardId,
                    classId: classId,
                    batchTypeId: batchTypeId,
                    subjectId: subjectId,
                    chapterId: chapterId,
                    question: ques.question,
                    A: ques.option1,
                    B: ques.option2,
                    C: ques.option3,
                    D: ques.option4,
                    answer: ques.correctAnswer,
                    explanation: ques.explanation,
                    difficultyLevel: diff,
                    createdById: userId,
                  });

                  //NOTE - if no error push to success object
                  successArray.push(questionObject);
                } catch (err) {
                  errorArray.push(questionObject);
                }
              }
            }
          }
        }

        //NOTE - update chapter Id
        await BulkUploadFiles.update(
          {
            chapterId: chapter,
          },
          { where: { id: createStaus.id } }
        );

        //NOTE - Get Url for success object
        if (successArray && successArray.length > 0) {
          const fileUrl = await pushToS3Bucket(
            successArray,
            msg.QUESTION_UPLOAD_SUCCESS
          );

          await BulkUploadFiles.update(
            {
              fileType: "question",
              status: "success",
              uploadedDate: new Date(),
              uploadFileUrl: fileUrl,
              updatedById: userId,
            },
            { where: { id: createStaus.id } }
          );
        }

        //NOTE - Get Url for Error object
        if (errorArray && errorArray.length > 0) {
          const fileUrl = await pushToS3Bucket(
            errorArray,
            msg.QUESTION_UPLOAD_ERROR
          );

          await BulkUploadFiles.update(
            {
              fileType: "question",
              errorFileUrl: fileUrl,
              uploadedDate: new Date(),
              status: successArray.length === 0 ? "error" : "success",
              updatedById: userId,
            },
            {
              where: { id: createStaus.id },
            }
          );
        }
      })
      .catch(async (error) => {
        await BulkUploadFiles.create({
          fileType: "question",
          status: "Server Error",
          uploadedDate: new Date(),
        });
        return;
      });
  } catch (error) {
    await BulkUploadFiles.create({
      fileType: "question",
      status: "Server Error",
      uploadedDate: new Date(),
    });
    return;
  }
};

//ANCHOR - Upload excel for state
const uploadStateExcel = async (req, res) => {
  try {
    const { file } = req.body;
    let errorArray = [];
    let successArray = [];
    let base64Encoded = file.split(";base64,").pop();

    //NOTE - getting id from  token
    const userId = req.user.id;

    //NOTE - Convert base64 to json format
    const convertFileToBase64 = await convertFile(base64Encoded);

    //NOTE : Push pending status
    const createStaus = new BulkUploadFiles({
      fileType: "state",
      status: "pending",
      uploadedDate: new Date(),
      createdById: userId,
    });

    await createStaus.save();

    res.send({ status: 200, message: "state bulk uploading" });

    //NOTE - check  the json and push to the repo
    for (const state of convertFileToBase64) {
      const stateObject = {
        state: state["State"],
      };

      if (stateObject === null || stateObject === undefined) {
        errorArray.push(stateObject);
      }

      if (stateObject) {
        try {
          if (stateObject !== null) {
            //NOTE - if no error push to TOPIC table
            const States = await State.findOne({
              where: {
                name: Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col("name")),
                  Sequelize.fn(
                    "LOWER",
                    stateObject.state.replace(/\s+/g, " ").trim()
                  )
                ),
              },
            });
            if (States) {
              errorArray.push(stateObject);
            }
            if (!States) {
              await State.create({
                name: stateObject.state.replace(/\s+/g, " ").trim(),
                createdById: userId,
              });

              //NOTE - if no error push to success object
              successArray.push(stateObject);
            }
          }
        } catch (err) {
          errorArray.push(stateObject);
        }
      }
    }

    //NOTE - Get Url for success object
    if (successArray && successArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        successArray,
        msg.STATE_UPLOAD_SUCCESS
      );
      await BulkUploadFiles.update(
        {
          fileType: "state",
          status: "success",
          uploadedDate: new Date(),
          uploadFileUrl: fileUrl,
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }

    //NOTE - Get Url for Error object
    if (errorArray && errorArray.length > 0) {
      const fileUrl = await pushToS3Bucket(errorArray, msg.STATE_UPLOAD_ERROR);

      await BulkUploadFiles.update(
        {
          fileType: "state",
          errorFileUrl: fileUrl,
          uploadedDate: new Date(),
          status: successArray.length === 0 ? "error" : "success",
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }
  } catch (error) {
    await BulkUploadFiles.create({
      fileType: "state",
      status: "Server Error",
      uploadedDate: new Date(),
    });
    return;
  }
};

//ANCHOR - Upload excel for city
const uploadCityExcel = async (req, res) => {
  try {
    const { file } = req.body;
    let errorArray = [];
    let successArray = [];
    let base64Encoded = file.split(";base64,").pop();

    //NOTE - getting id from  token
    const userId = req.user.id;

    //NOTE - Convert base64 to json format
    const convertFileToBase64 = await convertFile(base64Encoded);

    //NOTE : Push pending status
    const createStaus = new BulkUploadFiles({
      fileType: "city",
      status: "pending",
      uploadedDate: new Date(),
      createdById: userId,
    });

    await createStaus.save();

    res.send({ status: 200, message: "city bulk uploading" });

    //NOTE - check  the json and push to the repo
    for (const city of convertFileToBase64) {
      const cityObject = {
        state: city["State"],
        city: city["City"],
      };

      if (cityObject === undefined || cityObject === null) {
        errorArray.push(cityObject);
      }
      if (cityObject) {
        //NOTE - validate state
        const { status, stateId } = await validateState(cityObject);
        //NOTE - if error push to error object
        if (status === undefined || status === true) {
          errorArray.push(cityObject);
        } else if (status === false) {
          try {
            //NOTE - if no error push to city table
            const getCity = await City.findOne({
              where: {
                stateId: stateId,
                //name: cityObject.city,

                name: Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col("name")),
                  Sequelize.fn(
                    "LOWER",
                    cityObject.city.replace(/\s+/g, " ").trim()
                  )
                ),
              },
            });
            if (getCity) {
              errorArray.push(cityObject);
            }

            //NOTE - upload city if get city
            if (!getCity) {
              await City.create({
                stateId: stateId,
                name: cityObject.city.replace(/\s+/g, " ").trim(),
                createdById: userId,
              });

              //NOTE - if no error push to success object
              successArray.push(cityObject);
            }
          } catch (err) {
            errorArray.push(cityObject);
          }
        }
      }
    }

    //NOTE - Get Url for success object
    if (successArray && successArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        successArray,
        msg.CITY_UPLOAD_SUCCESS
      );

      await BulkUploadFiles.update(
        {
          fileType: "city",
          status: "success",
          uploadedDate: new Date(),
          uploadFileUrl: fileUrl,
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }

    //NOTE - Get Url for Error object
    if (errorArray && errorArray.length > 0) {
      const fileUrl = await pushToS3Bucket(errorArray, msg.CITY_UPLOAD_ERROR);

      await BulkUploadFiles.update(
        {
          fileType: "city",
          errorFileUrl: fileUrl,
          uploadedDate: new Date(),
          status: successArray.length === 0 ? "error" : "success",
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }
  } catch (error) {
    await BulkUploadFiles.create({
      fileType: "city",
      status: "Server Error",
      uploadedDate: new Date(),
    });
    return;
  }
};

//ANCHOR - Upload BULK CHAPTER BULK
const uploadChapterExcel = async (req, res) => {
  try {
    const { file } = req.body;
    let errorArray = [];
    let successArray = [];
    let base64Encoded = file.split(";base64,").pop();

    //NOTE - getting id from  token
    const userId = req.user.id;

    //NOTE - Convert base64 to jsoon format
    const convertFileToBase64 = await convertFile(base64Encoded);

    //NOTE : Push pending status
    const createStaus = new BulkUploadFiles({
      fileType: "chapter",
      status: "pending",
      uploadedDate: new Date(),
      createdById: userId,
    });

    await createStaus.save();

    res.send({ status: 200, message: "chapter BULK UPLOADING" });

    //NOTE - check  the json and push to the repo
    for (const chapter of convertFileToBase64) {
      const chapterObject = {
        course: chapter["course"],
        board: chapter["board"],
        class: chapter["class"],
        batch: chapter["batch"],
        subject: chapter["subject"],
        chapter: chapter["chapter"],
      };

      //NOTE - checking if topic is blank or undefined
      if (
        chapter["course"] === undefined ||
        chapter["board"] === undefined ||
        chapter["class"] === undefined ||
        chapter["batch"] === undefined ||
        chapter["subject"] === undefined ||
        chapter["chapter"] === undefined
      ) {
        errorArray.push(chapterObject);
      }

      //NOTE - if topic is defined then it run
      if (chapterObject) {
        //NOTE - Validate all course ,board, class ,batchType, subject and chapter
        const { status, courseId, boardId, classId, batchTypeId, subjectId } =
          await validateSubject(chapterObject);

        //NOTE - if error push to error object
        if (status === undefined || status === true) {
          errorArray.push(chapterObject);
        } else if (status === false) {
          //NOTE - if no error push to TOPIC table

          const chapters = await Chapter.findOne({
            where: {
              courseId: courseId,
              boardId: boardId,
              classId: classId,
              batchTypeId: batchTypeId,
              subjectId: subjectId,
              name: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("name")),
                Sequelize.fn(
                  "LOWER",
                  chapterObject.chapter.replace(/\s+/g, " ").trim()
                )
              ),
            },
          });
          if (chapters) {
            errorArray.push(chapterObject);
          }

          if (!chapters) {
            await Chapter.create({
              courseId: courseId,
              boardId: boardId,
              classId: classId,
              batchTypeId: batchTypeId,
              subjectId: subjectId,
              name: chapterObject.chapter.replace(/\s+/g, " ").trim(),
              createdById: userId,
            });
            //NOTE - if no error push to success object
            successArray.push(chapterObject);
          }
        }
      }
    }

    //NOTE - Get Url for success object
    if (successArray && successArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        successArray,
        msg.CHAPTER_UPLOAD_SUCCESS
      );
      await BulkUploadFiles.update(
        {
          fileType: "chapter",
          status: "success",
          uploadedDate: new Date(),
          uploadFileUrl: fileUrl,
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }

    //NOTE - Get Url for Error object
    if (errorArray && errorArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        errorArray,
        msg.CHAPTER_UPLOAD_ERROR
      );
      await BulkUploadFiles.update(
        {
          fileType: "chapter",
          errorFileUrl: fileUrl,
          uploadedDate: new Date(),
          status: successArray.length === 0 ? "error" : "success",
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }
  } catch (error) {
    await BulkUploadFiles.create({
      fileType: "chapter",
      status: "Server Error",
      uploadedDate: new Date(),
    });
    return;
  }
};

//ANCHOR - Upload excel for grivances category
const uploadGrivancesCategoryExcel = async (req, res) => {
  try {
    const { file } = req.body;
    let errorArray = [];
    let successArray = [];
    let base64Encoded = file.split(";base64,").pop();

    //NOTE - getting id from  token
    const userId = req.user.id;

    //NOTE - Convert base64 to json format
    const convertFileToBase64 = await convertFile(base64Encoded);

    //NOTE : Push pending status
    const createStaus = new BulkUploadFiles({
      fileType: "grivancesCategory",
      status: "pending",
      uploadedDate: new Date(),
      createdById: userId,
    });

    await createStaus.save();

    res.send({ status: 200, message: msg.GRIVANCES_CATEGORY_UPLOADING });

    //NOTE - check  the json and push to the repo
    for (const category of convertFileToBase64) {
      const categoryObject = {
        category: category["Category"],
      };

      if (categoryObject === null || categoryObject === undefined) {
        errorArray.push(categoryObject);
      }

      if (
        categoryObject &&
        categoryObject !== null &&
        categoryObject !== undefined
      ) {
        try {
          //if (categoryObject !== null) {
          //NOTE - if no error
          const getCategory = await grievanceCategory.findOne({
            where: {
              name: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("category")),
                Sequelize.fn(
                  "LOWER",
                  categoryObject.category.replace(/\s+/g, " ").trim()
                )
              ),
            },
          });
          if (getCategory) {
            errorArray.push(categoryObject);
          }
          if (!getCategory) {
            await grievanceCategory.create({
              category: categoryObject.category.replace(/\s+/g, " ").trim(),
              createdById: userId,
            });

            //NOTE - if no error push to success object
            successArray.push(categoryObject);
            // }
          }
        } catch (err) {
          errorArray.push(categoryObject);
        }
      }
    }

    //NOTE - Get Url for success object
    if (successArray && successArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        successArray,
        msg.GRIVANCES_CATEGORY_UPLOAD_SUCCESS
      );
      await BulkUploadFiles.update(
        {
          fileType: "grivancesCategory",
          status: "success",
          uploadedDate: new Date(),
          uploadFileUrl: fileUrl,
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }

    //NOTE - Get Url for Error object
    if (errorArray && errorArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        errorArray,
        msg.GRIVANCES_CATEGORY_UPLOAD_ERROR
      );
      await BulkUploadFiles.update(
        {
          fileType: "grivancesCategory",
          errorFileUrl: fileUrl,
          uploadedDate: new Date(),
          status: successArray.length === 0 ? "error" : "success",
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }
  } catch (error) {
    await BulkUploadFiles.create({
      fileType: "grivancesCategory",
      status: "Server Error",
      uploadedDate: new Date(),
    });
    return;
  }
};

//ANCHOR - Upload excel for grivances sub category
const uploadGrivancesSubCategoryExcel = async (req, res) => {
  try {
    const { file } = req.body;
    let errorArray = [];
    let successArray = [];
    let base64Encoded = file.split(";base64,").pop();

    //NOTE - getting id from  token
    const userId = req.user.id;

    //NOTE - Convert base64 to json format
    const convertFileToBase64 = await convertFile(base64Encoded);

    //NOTE : Push pending status
    const createStaus = new BulkUploadFiles({
      fileType: "grivancesSubCategory",
      status: "pending",
      uploadedDate: new Date(),
      createdById: userId,
    });

    await createStaus.save();

    res.send({ status: 200, message: msg.GRIVANCES_SUB_CATEGORY_UPLOADING });

    //NOTE - check  the json and push to the repo
    for (const subCategory of convertFileToBase64) {
      const subCategoryObject = {
        category: subCategory["Category"],
        subCategory: subCategory["Sub Category"],
      };

      //NOTE - if any error
      if (subCategoryObject === undefined || subCategoryObject === null) {
        errorArray.push(subCategoryObject);
      }

      if (
        subCategoryObject &&
        subCategoryObject !== null &&
        subCategoryObject !== undefined
      ) {
        //NOTE - validate category
        const { status, categoryId } = await validatecategory(
          subCategoryObject
        );

        //NOTE - if error push to error object
        if (status === undefined || status === true) {
          errorArray.push(subCategoryObject);
        } else if (status === false) {
          try {
            //NOTE - if no error
            const getSubCategory = await grievanceSubCategory.findOne({
              where: {
                categoryId: categoryId,
                subCategory: Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col("subCategory")),
                  Sequelize.fn(
                    "LOWER",
                    subCategoryObject.subCategory.replace(/\s+/g, " ").trim()
                  )
                ),
              },
            });
            if (getSubCategory) {
              errorArray.push(subCategoryObject);
            }

            //NOTE - upload sub category
            if (!getSubCategory) {
              await grievanceSubCategory.create({
                categoryId: categoryId,
                subCategory: subCategoryObject.subCategory
                  .replace(/\s+/g, " ")
                  .trim(),
                createdById: userId,
              });

              //NOTE - if no error push to success object
              successArray.push(subCategoryObject);
            }
          } catch (err) {
            errorArray.push(subCategoryObject);
          }
        }
      }
    }

    //NOTE - Get Url for success object
    if (successArray && successArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        successArray,
        msg.GRIVANCES_SUB_CATEGORY_UPLOAD_SUCCESS
      );

      await BulkUploadFiles.update(
        {
          fileType: "grivancesSubCategory",
          status: "success",
          uploadedDate: new Date(),
          uploadFileUrl: fileUrl,
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }

    //NOTE - Get Url for Error object
    if (errorArray && errorArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        errorArray,
        msg.GRIVANCES_SUB_CATEGORY_UPLOAD_ERROR
      );

      await BulkUploadFiles.update(
        {
          fileType: "grivancesSubCategory",
          errorFileUrl: fileUrl,
          uploadedDate: new Date(),
          status: successArray.length === 0 ? "error" : "success",
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }
  } catch (error) {
    await BulkUploadFiles.create({
      fileType: "grivancesSubCategory",
      status: "Server Error",
      uploadedDate: new Date(),
    });
    return;
  }
};

//ANCHOR - Upload excel for CONTENT
const demoContetn = async (req, res) => {
  try {
    const { file } = req.body;
    let errorArray = [];
    let successArray = [];
    let base64Encoded = file.split(";base64,").pop();

    //NOTE - Convert base64 to jsoon format
    const convertFileToBase64 = await convertFile(base64Encoded);

    //NOTE : Push pending status
    const createStaus = await BulkUploadFiles.create({
      fileType: "content",
      status: "pending",
      uploadedDate: new Date(),
      createdById: 1,
    });

    res.send({ status: 200, message: msg.CONTENT_BULK_UPLOADING });

    let sucess = [];
    let error = [];
    //NOTE - check  the json and push to the repo
    for (const content of convertFileToBase64) {
      const contentObject = {
        course: content["course"],
        board: content["board"],
        class: content["class"],
        batch: content["batch"],
        subject: content["subject"],
        chapter: content["chapter"],
        topic: content["topic"],
        tag: content["tag"],
        source: content["source"],
        resourceType:
          content["tag"] === "Help Resource" ||
            content["tag"] === "help_resource"
            ? content["resource_type"]
            : null,
        sourceFile: content["video_name"],
        thumbnailFile: content["thumbnail_name"],
        //resourceFile: content["resources_name"],
      };

      if (contentObject) {
        //NOTE - topic
        const {
          status,
          courseId,
          boardId,
          classId,
          batchTypeId,
          subjectId,
          chapterId,
          topicId,
        } = await validateTopic(contentObject);

        if (status === undefined || status === true) {
          errorArray.push(contentObject);
        } else if (status === false) {
          //NOTE - if error push to error object
          const final = await Content.findOne({
            where: {
              courseId: courseId,
              boardId: boardId,
              classId: classId,
              batchTypeId: batchTypeId,
              subjectId: subjectId,
              chapterId: chapterId,
              topicId: topicId,
              tag: "Learning Content",
            },
          });
          if (final && final !== null) {
            // sucess.push({
            //   sourceFile: contentObject.sourceFile, thumbnailFile: contentObject.thumbnailFile
            // })
            await Content.update(
              {
                sourceFile: contentObject.sourceFile,
                thumbnailFile: contentObject.thumbnailFile,
                source: contentObject.source,
                tag: "Learning Content",
                updatedById: 1,
              },
              { where: { id: final.id } }
            );
          }

          if (!final && final === null) {
            // error.push({
            //   contentObject: contentObject.topic,
            //   sourceFile: contentObject.sourceFile, thumbnailFile: contentObject.thumbnailFile
            // })
            //NOTE - if no error push to content table
            await Content.create({
              courseId: courseId,
              boardId: boardId,
              classId: classId,
              batchTypeId: batchTypeId,
              subjectId: subjectId,
              chapterId: chapterId,
              topicId: topicId,
              tag: contentObject.tag,
              source: contentObject.source ? contentObject.source : null,
              resourceType: contentObject.resourceType
                ? contentObject.resourceType
                : null,
              sourceFile: contentObject.sourceFile
                ? contentObject.sourceFile
                : null,
              thumbnailFile: contentObject.thumbnailFile
                ? contentObject.thumbnailFile
                : null,
              createdById: 1,
            });
          }

          //NOTE - if no error push to success object
          successArray.push(contentObject);
        }
      }
    }
    //NOTE - Get Url for success object
    if (successArray && successArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        successArray,
        msg.CONTENT_UPLOAD_SUCCESS
      );

      await BulkUploadFiles.update(
        {
          fileType: "content",
          status: "success",
          uploadedDate: new Date(),
          uploadFileUrl: fileUrl,
          updatedById: 1,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }

    // //NOTE - Get Url for Error object
    if (errorArray && errorArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        errorArray,
        msg.CONTENT_UPLOAD_ERROR
      );

      await BulkUploadFiles.update(
        {
          fileType: "content",
          errorFileUrl: fileUrl,
          uploadedDate: new Date(),
          status: successArray.length === 0 ? "error" : "success",
          updatedById: 1,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }
  } catch (error) {
    await BulkUploadFiles.create({
      fileType: "content",
      status: "Server Error",
      uploadedDate: new Date(),
    });
    return;
  }
};

//ANCHOR - Upload excel for CONTENT
const uploadBulkContentNew = async (req, res) => {
  try {
    const { file } = req.body;
    let errorArray = [];
    let successArray = [];
    let base64Encoded = file.split(";base64,").pop();

    //NOTE - getting id from  token
    const token = req.user.id;

    //NOTE - Convert base64 to jsoon format
    const convertFileToBase64 = await convertFile(base64Encoded);

    //NOTE : Push pending status
    const createStaus = await BulkUploadFiles.create({
      fileType: "content",
      status: "pending",
      uploadedDate: new Date(),
      createdById: token,
    });

    res.send({ status: 200, message: msg.CONTENT_BULK_UPLOADING });

    //NOTE - check  the json and push to the repo
    for (const content of convertFileToBase64) {
      const requiredKeys = [
        "course",
        "board",
        "class",
        "batch",
        "subject",
        "chapter",
        "topic",
        "tag",
        "source",
      ];
      const missingKeys = requiredKeys.filter(
        (key) => content[key] === undefined
      );
      //NOTE - checking length of key
      if (missingKeys.length > 0) {
        const contentObject = {
          course: content["course"],
          board: content["board"],
          class: content["class"],
          batch: content["batch"],
          subject: content["subject"],
          chapter: content["chapter"],
          topic: content["topic"],
          tag: content["tag"],
          source: content["source"],
          resource_type:
            content["tag"] === "Help Resource" ||
              content["tag"] === "help_resource"
              ? content["resource_type"]
              : null,
          video_name: content["video_name"],
          thumbnail_name: content["thumbnail_name"],
          Topic_Sequence: content["Topic_Sequence"],
          reason: missingKeys.map((key) => `${key} not found`).join(", "),
        };
        errorArray.push(contentObject);
      }

      //NOTE - if all perfect then it works
      if (
        content.course &&
        content.board &&
        content.class &&
        content.batch &&
        content.subject &&
        content.chapter &&
        content.tag &&
        content.source
      ) {
        const contentObject = {
          course: content["course"],
          board: content["board"],
          class: content["class"],
          batch: content["batch"],
          subject: content["subject"],
          chapter: content["chapter"],
          topic: content["topic"],
          tag: content["tag"],
          source: content["source"],
          resource_type:
            content["tag"] === "Help Resource" ||
              content["tag"] === "help_resource"
              ? content["resource_type"]
              : null,
          video_name: content["video_name"],
          thumbnail_name: content["thumbnail_name"],
          Topic_Sequence: content["Topic_Sequence"],
          reason: null,
        };

        //NOTE - validate video file name
        // const videoFile = await checkVideoFilename(contentObject.sourceFile)
        // if (!videoFile) {
        //   errorArray.push(contentObject);
        // }

        //NOTE - if content object is validate
        if (contentObject) {
          //NOTE - topic
          const {
            status,
            courseId,
            boardId,
            classId,
            batchTypeId,
            subjectId,
            chapterId,
            topicId,
            reason,
          } = await validateTopic(contentObject);

          //NOTE - insert reason into content reason
          contentObject.reason = reason;

          //NOTE - if error push to error object
          if (status === undefined || status === true) {
            errorArray.push(contentObject);
          } else if (status === false) {
            try {
              //NOTE - CHECKING DIFFICULTY LEVEL by regex
              const regex =
                /Learning Content|Recorded Live Session|Help Resource/i;
              const string = contentObject.tag;

              let tags;
              if (regex.test(string)) {
                switch (string.toLowerCase()) {
                  case "learning content":
                    tags = "Learning Content";
                    break;
                  case "recorded live session":
                    tags = "Recorded Live Session";
                    break;
                  case "help resource":
                    tags = "Help Resource";
                    break;
                }
              }

              //NOTE - if no error push to new content table
              const contetns = await NewContent.create({
                tag: tags,
                source: contentObject.source ? contentObject.source : null,
                resourceType: contentObject.resource_type
                  ? contentObject.resource_type
                  : null,
                sourceFile: contentObject.video_name && contentObject.video_name.includes("youtu") ? contentObject.video_name : contentObject.video_name ?
                  `content-video/${contentObject.video_name}`
                  : null,
                thumbnailFile: contentObject.thumbnail_name
                  ? `content-thumbnail/${contentObject.thumbnail_name}`
                  : null,
                createdById: token,
              });

              //NOTE - sequence validation
              let sequence = 0;
              if (contentObject.Topic_Sequence) {
                if (contentObject.Topic_Sequence > 0) {
                  //NOTE - checking sequence number added on this topic Id or not
                  const TopicData = await contentCourseMap.findOne({
                    attributes: ["ORDERSEQ", "contentId"],
                    where: {
                      subjectId: subjectId,
                      chapterId: chapterId,
                      topicId: topicId,
                      ORDERSEQ: {
                        [Op.gt]: 0, //NOTE - Check if ORDERSEQ is greater than 0
                      },
                    },
                  });
                  //NOTE - finding sequence number already exist on this subject and chapter
                  const checkingChapterData = await contentCourseMap.findOne({
                    attributes: ["ORDERSEQ"],
                    where: {
                      subjectId: subjectId,
                      chapterId: chapterId,
                      ORDERSEQ: {
                        [Op.and]: [
                          {
                            [Op.eq]: contentObject.Topic_Sequence, // Check if ORDERSEQ is equal to the specified sequence
                          },
                          {
                            [Op.not]: 0, // Exclude records where ORDERSEQ is equal to 0
                          },
                        ],
                      },
                    },
                  });
                  if (!TopicData && !checkingChapterData) {
                    sequence = contentObject.Topic_Sequence;
                  }
                }
              }

              //NOTE - if no error push to content course map table
              await contentCourseMap.create({
                contentId: contetns.id,
                courseId: courseId,
                boardId: boardId,
                classId: classId,
                batchTypeId: batchTypeId,
                subjectId: subjectId,
                chapterId: chapterId,
                topicId: topicId,
                createdById: token,
                ORDERSEQ: sequence ? sequence : 0,
              });

              //NOTE - if no error push to success object
              successArray.push(contentObject);
            } catch (error) {
              errorArray.push(contentObject);
            }
          }
        }
      }
    }

    //NOTE - Get Url for success object
    if (successArray && successArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        successArray,
        msg.CONTENT_UPLOAD_SUCCESS
      );

      await BulkUploadFiles.update(
        {
          fileType: "content",
          status: "success",
          uploadedDate: new Date(),
          uploadFileUrl: fileUrl,
          updatedById: token,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }

    //NOTE - Get Url for Error object
    if (errorArray && errorArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        errorArray,
        msg.CONTENT_UPLOAD_ERROR
      );

      await BulkUploadFiles.update(
        {
          fileType: "content",
          errorFileUrl: fileUrl,
          uploadedDate: new Date(),
          status: successArray.length === 0 ? "error" : "success",
          updatedById: token,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }
  } catch (error) {
    await BulkUploadFiles.create({
      fileType: "content",
      status: "Server Error",
      uploadedDate: new Date(),
    });
    return;
  }
};

//ANCHOR - UPLOAD QUESTION BANK
const questionBulkWithConverter = async (req, res) => {
  try {
    const errorArray = [];
    const successArray = [];
    let chapter;

    //NOTE - getting id from  token
    const userId = req.user.id;

    //NOTE - Docx converter api
    const url = 'https://questionconverter.vedaacademy.org.in/api/extract-docx-4';
    const formData = new FormData();
    formData.append('file', req.file.buffer, { filename: req.file.originalname });

    //NOTE - request question converter api
    const response = await axios.post(url, formData, {
      headers: formData.getHeaders(),
    });

    //NOTE - return if data is empty
    if (response.data.extracted_data.Questions.length <= 0) {
      return res.status(400).send({
        status: 400,
        message: msg.EMPTY_DATA,
      });
    }

    //NOTE - extract course data 
    let result = {
      course: response.data.extracted_data.Course,
      board: response.data.extracted_data.Board,
      class: response.data.extracted_data.Class,
      batchtype: response.data.extracted_data["Batch Type"],
      subject: response.data.extracted_data.Subject,
      chapter: response.data.extracted_data.Chapter,
    }

    //NOTE : Push pending status
    const createStaus = await BulkUploadFiles.create({
      fileType: "question",
      status: "pending",
      uploadedDate: new Date(),
      createdById: userId,
    });

    res.json({ status: 200, message: msg.QUESTION_EXCEL_UPLOAD });

    //NOTE - checking the json 
    for (const ques of response.data.extracted_data.Questions) {
      //NOTE - checking course to chapter keys
      const requiredKeys = [
        "course",
        "board",
        "class",
        "batchtype",
        "subject",
        "chapter",
      ];
      const missingKeys = requiredKeys.filter((key) => result[key] === undefined || result[key] === null || result[key] === '');
      //NOTE - checking if result any value is undefined
      if (missingKeys.length > 0) {
        const questionObject = {
          Course: response.data.extracted_data["Course"],
          Board: response.data.extracted_data["Board"],
          Class: response.data.extracted_data["Class"],
          BatchType: response.data.extracted_data["Batch Type"],
          Subject: response.data.extracted_data["Subject"],
          Chapter: response.data.extracted_data["Chapter"],
          Question: ques["Question"],
          A: ques["A"],
          B: ques["B"],
          C: ques["C"],
          D: ques["D"],
          CorrectAnswer: ques["Correct Answer"],
          Explanation: ques["Explanation"],
          DifficultyLevel: ques["Difficulty Level"],
          reason: missingKeys.map((key) => `${key} not found`).join(", "),
        };
        errorArray.push(questionObject);
      }

      if (isHtmlTableEmpty(ques["Correct Answer"]) & !isHtmlTableEmpty(ques["Difficulty Level"])) {
        const questionObject = {
          Course: response.data.extracted_data["Course"],
          Board: response.data.extracted_data["Board"],
          Class: response.data.extracted_data["Class"],
          BatchType: response.data.extracted_data["Batch Type"],
          Subject: response.data.extracted_data["Subject"],
          Chapter: response.data.extracted_data["Chapter"],
          Question: ques["Question"],
          A: ques["A"],
          B: ques["B"],
          C: ques["C"],
          D: ques["D"],
          CorrectAnswer: ques["Correct Answer"],
          Explanation: ques["Explanation"],
          DifficultyLevel: ques["Difficulty Level"],
          reason: "Correct Answer Not Found",
        };
        errorArray.push(questionObject);

      }

      if (isHtmlTableEmpty(ques["Difficulty Level"]) & !isHtmlTableEmpty(ques["Correct Answer"])) {
        const questionObject = {
          Course: response.data.extracted_data["Course"],
          Board: response.data.extracted_data["Board"],
          Class: response.data.extracted_data["Class"],
          BatchType: response.data.extracted_data["Batch Type"],
          Subject: response.data.extracted_data["Subject"],
          Chapter: response.data.extracted_data["Chapter"],
          Question: ques["Question"],
          A: ques["A"],
          B: ques["B"],
          C: ques["C"],
          D: ques["D"],
          CorrectAnswer: ques["Correct Answer"],
          Explanation: ques["Explanation"],
          DifficultyLevel: ques["Difficulty Level"],
          reason: "Difficulty Level Not Found",
        };
        errorArray.push(questionObject);
      }


      if (isHtmlTableEmpty(ques["Difficulty Level"]) && isHtmlTableEmpty(ques["Correct Answer"])) {
        const questionObject = {
          Course: response.data.extracted_data["Course"],
          Board: response.data.extracted_data["Board"],
          Class: response.data.extracted_data["Class"],
          BatchType: response.data.extracted_data["Batch Type"],
          Subject: response.data.extracted_data["Subject"],
          Chapter: response.data.extracted_data["Chapter"],
          Question: ques["Question"],
          A: ques["A"],
          B: ques["B"],
          C: ques["C"],
          D: ques["D"],
          CorrectAnswer: ques["Correct Answer"],
          Explanation: ques["Explanation"],
          DifficultyLevel: ques["Difficulty Level"],
          reason: "Difficulty Level Not Found ,Correct Answer Not Found",
        };
        errorArray.push(questionObject);
      }


      if (!isHtmlTableEmpty(ques["Correct Answer"]) && !isHtmlTableEmpty(ques["Difficulty Level"])) {
        //NOTE - creating json 
        const questionObject = {
          course: response.data.extracted_data["Course"],
          board: response.data.extracted_data["Board"],
          class: response.data.extracted_data["Class"],
          batchType: response.data.extracted_data["Batch Type"],
          subject: response.data.extracted_data["Subject"],
          chapter: response.data.extracted_data["Chapter"],
          Question: ques["Question"],
          A: ques["A"],
          B: ques["B"],
          C: ques["C"],
          D: ques["D"],
          CorrectAnswer: ques["Correct Answer"],
          Explanation: ques["Explanation"],
          DifficultyLevel: ques["Difficulty Level"],
          reason: null,
        };

        if (questionObject) {
          //NOTE - topic
          const {
            status,
            courseId,
            boardId,
            classId,
            batchTypeId,
            subjectId,
            chapterId,
            reason,
          } = await validateChapterTopic(questionObject);

          //NOTE - insert reason into question object
          questionObject.reason = reason;
          //NOTE - get chapter id
          chapter = chapterId;

          //NOTE - if error push to error object
          if (
            status === undefined ||
            status === true ||
            isHtmlTableEmpty(ques["Difficulty Level"])
          ) {
            errorArray.push(questionObject);
          } else if (status === false) {
            //NOTE - if no error push to TOPIC table
            try {
              //NOTE - CHECKING DIFFICULTY LEVEL by regex
              const regex = /Easy|Medium|Hard/i;
              const string = difficultyLevel(ques["Difficulty Level"]);

              let diff;
              if (regex.test(string)) {
                switch (string.toLowerCase()) {
                  case "easy":
                    diff = "Easy";
                    break;
                  case "medium":
                    diff = "Medium";
                    break;
                  case "hard":
                    diff = "Hard";
                    break;
                }
              }

              //NOTE - bulk uploading  on database
              questionBank.create({
                courseId: courseId,
                boardId: boardId,
                classId: classId,
                batchTypeId: batchTypeId,
                subjectId: subjectId,
                chapterId: chapterId,
                question: ques["Question"],
                A: ques["A"],
                B: ques["B"],
                C: ques["C"],
                D: ques["D"],
                answer: extractAnswer(ques["Correct Answer"]),
                explanation: ques["Explanation"],
                difficultyLevel: diff,
                createdById: userId,
              });
              //NOTE - if no error push to success object
              successArray.push(questionObject);
            } catch (err) {
              errorArray.push(questionObject);
            }
          }
        }

      }
    }
    //NOTE - update chapter Id
    await BulkUploadFiles.update(
      {
        chapterId: chapter,
      },
      { where: { id: createStaus.id } }
    );
    //NOTE - Get Url for success object
    if (successArray && successArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        successArray,
        msg.QUESTION_UPLOAD_SUCCESS
      );

      await BulkUploadFiles.update(
        {
          fileType: "question",
          status: "success",
          uploadedDate: new Date(),
          uploadFileUrl: fileUrl,
          updatedById: userId,
        },
        { where: { id: createStaus.id } }
      );
    }

    //NOTE - Get Url for Error object
    if (errorArray && errorArray.length > 0) {
      const fileUrl = await pushToS3Bucket(
        errorArray,
        msg.QUESTION_UPLOAD_ERROR
      );

      await BulkUploadFiles.update(
        {
          fileType: "question",
          errorFileUrl: fileUrl,
          uploadedDate: new Date(),
          status: successArray.length === 0 ? "error" : "success",
          updatedById: userId,
        },
        {
          where: { id: createStaus.id },
        }
      );
    }

  } catch (error) {
    await BulkUploadFiles.create({
      fileType: "question",
      status: "Server Error",
      uploadedDate: new Date(),
    });
    return;
  }
};

module.exports = {
  getAllBulkFiles,
  uploadStudentExcel,
  uploadStaffExcel,
  uploadQuestions,
  uploadTopicExcel,
  uploadRevisionExcel,
  uploadBulkContent,
  uploadQuestionBank,
  uploadStateExcel,
  uploadCityExcel,
  uploadChapterExcel,
  uploadGrivancesCategoryExcel,
  uploadGrivancesSubCategoryExcel,
  demoContetn,
  uploadBulkContentNew,
  questionBulkWithConverter
};
