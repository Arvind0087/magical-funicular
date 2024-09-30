const moment = require("moment");
const awsS3 = require("aws-sdk");
const XLSX = require("xlsx");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const ObjectsToCsv = require("objects-to-csv");
const db = require("../../models/index");
const { config } = require("../../config/db.config");
const { Sequelize } = require("sequelize");
const AdminUser = db.admin;
const UserDetails = db.users;
const Course = db.courses;
const Boards = db.boards;
const Class = db.class;
const batchType = db.batchTypes;
const BatchDates = db.batchDate;
const SubjectData = db.subject;

const Chapters = db.chapter;
const Topic = db.topic;
const State = db.state;
const RoleDetails = db.permissionRole;
const grievanceCategory = db.grievance_category;
const grievanceSubCategory = db.grievance_subCategory;
const Girevances = db.girevancesCategory_subCategory_map;

//NOTE - Convert base64 to jsoon format
const convertFile = async (file) => {
  const buff = Buffer.from(file, "base64");
  const buffread = XLSX.read(buff);
  const report = XLSX.utils.sheet_to_json(
    buffread.Sheets[buffread.SheetNames[0]],
    { rawNumbers: true }
  );

  return report;
};

//NOTE - check admin email and phone
const validateUsers = async (user) => {
  let status = false;
  const existingUserPhone = await UserDetails.findOne({
    where: { phone: user.phone },
  });

  const existingUserEmail = await UserDetails.findOne({
    where: { phone: user.email },
  });
  if (existingUserPhone || existingUserEmail) {
    status = true;
  }
  return status;
};

//NOTE - check admin email and phone
const validateBatches = async (user) => {
  let status = false;

  //NOTE - find course
  const courseDetails = await Course.findOne({
    where: {
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", user.course.replace(/\s+/g, " ").trim())
      ),
    },
  });

  if (!courseDetails) {
    status = true;
    return status;
  }

  //NOTE - Find board
  const boardDetails = await Boards.findOne({
    where: {
      courseId: courseDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", user.board.replace(/\s+/g, " ").trim())
      ),
    },
  });

  if (!boardDetails) {
    status = true;
    return status;
  }

  //NOTE - Find Class Details
  const classDetails = await Class.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", user.class.replace(/\s+/g, " ").trim())
      ),
    },
  });

  if (!classDetails) {
    console.log("course worong");
    status = true;
    return status;
  }

  //NOTE - Find Batch Type Details
  const batchTypeDetails = await batchType.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", user.batchType.replace(/\s+/g, " ").trim())
      ),
    },
  });

  if (!batchTypeDetails) {
    console.log("bioard worong");
    status = true;
    return status;
  }

  //TODO - convert the batch dates
  const convertedDate = moment
    .utc("1900-01-01", "YYYY-MM-DD")
    .add(user.batchStartDate - 2, "days");
  const isoString = convertedDate.toISOString();

  //NOTE - find batch dates
  const batchDateValue = await BatchDates.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      batchTypeId: batchTypeDetails.id,
      date: isoString,
    },
  });

  if (!batchDateValue) {
    console.log("batchDateValue worong");
    status = true;
    return status;
  }

  //NOTE:  All data was found, construct and return the response
  const response = {
    status: status,
    courseId: courseDetails.id,
    boardId: boardDetails.id,
    classId: classDetails.id,
    batchTypeId: batchTypeDetails.id,
    batchDateId: batchDateValue.id,
  };

  return response;
};

//NOTE - Push file to S3 Bucket
const pushToS3Bucket = async (array, bucket_name) => {
  // S3 bucket details
  const s3 = new awsS3.S3({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
    region: config.S3_REGION,
  });

  // Convert the JSON array to an array of JavaScript objects
  const objectsArray = JSON.parse(JSON.stringify(array));

  // Convert the array of objects to a CSV string using ObjectsToCsv
  const csv = new ObjectsToCsv(objectsArray);
  const csvString = await csv.toString();

  // Encode the CSV string as UTF-8
  const csvBuffer = Buffer.from(csvString, "utf-8");

  let s3path;
  if (
    bucket_name === "question uploaded" ||
    bucket_name === "question upload error"
  ) {
    s3path = new Date().getTime() + "-" + uuidv4() + ".docx";
  } else {
    s3path = new Date().getTime() + "-" + uuidv4() + ".csv";
  }

  const params = {
    Bucket: config.S3_BUCKET_NAME,
    Key: `${bucket_name}/${s3path}`,
    Body: csvBuffer,
    ContentType: "text/csv; charset=utf-8",
  };

  const { Location, Key } = await s3.upload(params).promise();
  return Key;
};

//NOTE - check admin email and phone
const validateStaff = async (user) => {
  let status = false;
  const existingUserPhone = await AdminUser.findOne({
    where: { phone: user.phone },
  });

  const existingUserEmail = await UserDetails.findOne({
    where: { phone: user.email },
  });
  if (existingUserPhone || existingUserEmail) {
    status = true;
  }
  return status;
};

//NOTE - Check role
const validateRole = async (data) => {
  let status = false;

  //NOTE -Check role is exist or not
  const role = await RoleDetails.findOne({
    where: { role: data.role },
  });

  if (role) {
    //NOTE - if role exist
    return [status, role.id, role.role]; //NOTE - return role id
  } else if (role === null) {
    //NOTE - if role not exist, create a new role
    const aa = new RoleDetails({
      role: data.role,
    });

    const getRoles = await aa.save();
    return [status, getRoles.id, getRoles.role]; //NOTE - return new role id after create
  } else {
    status = true;
    return status;
  }
};

//NOTE - Check class and subject
const validateClassDetails = async (data) => {
  let status = false;

  //NOTE - Find Class Details
  const classDetails = await Class.findOne({
    where: {
      name: data.class,
    },
  });

  //NOTE: if class does not match
  if (!classDetails) {
    status = true;
    return status;
  }

  //NOTE - Find Subject Details
  const subjectDetails = await SubjectData.findOne({
    where: { classId: classDetails.id, name: data.subject },
  });

  //NOTE: if subject does not match
  if (!subjectDetails) {
    status = true;
    return status;
  }

  if (classDetails && subjectDetails) {
    return [
      status,
      subjectDetails.courseId,
      subjectDetails.boardId,
      classDetails.id,
      subjectDetails.id,
      subjectDetails.batchTypeId,
    ];
  }
};

const validateChapter = async (topic) => {
  let reason = null;
  let status = false;

  //NOTE - find course

  //NOTE - find course
  const courseDetails = await Course.findOne({
    where: {
      name: /\d/.test(topic.course)
        ? topic.course
        : Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("name")),
          Sequelize.fn("LOWER", topic.course.replace(/\s+/g, " ").trim())
        ),
      status: 1,
    },
  });
  if (!courseDetails) {
    status = true;
    reason = "course not found";
    return { status, reason };
  }

  //NOTE - Find board
  const boardDetails = await Boards.findOne({
    where: {
      courseId: courseDetails.id,
      name: /\d/.test(topic.board)
        ? topic.board
        : Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("name")),
          Sequelize.fn("LOWER", topic.board.replace(/\s+/g, " ").trim())
        ),
      status: 1,
    },
  });

  if (!boardDetails) {
    status = true;
    reason = "board not found";
    return { status, reason };
  }

  //NOTE - Find Class Details
  const classDetails = await Class.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      name: /\d/.test(topic.class)
        ? topic.class
        : Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("name")),
          Sequelize.fn("LOWER", topic.class.replace(/\s+/g, " ").trim())
        ),
      status: 1,
    },
  });

  if (!classDetails) {
    status = true;
    reason = "class not found";
    return { status, reason };
  }

  //NOTE - Find Batch Type Details
  const batchTypeDetails = await batchType.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      name: /\d/.test(topic.batch)
        ? topic.batch
        : Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("name")),
          Sequelize.fn("LOWER", topic.batch.replace(/\s+/g, " ").trim())
        ),
      status: 1,
    },
  });

  if (!batchTypeDetails) {
    status = true;
    reason = "batch not found";
    return { status, reason };
  }

  //NOTE - Find subject Details
  const SubjectDetails = await SubjectData.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      batchTypeId: batchTypeDetails.id,
      name: /\d/.test(topic.subject)
        ? topic.subject
        : Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("name")),
          Sequelize.fn("LOWER", topic.subject.replace(/\s+/g, " ").trim())
        ),
      status: 1,
    },
  });

  if (!SubjectDetails) {
    status = true;
    reason = "subject not found";
    return { status, reason };
  }

  //NOTE - Find chapter Details
  const chapterDetails = await Chapters.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      batchTypeId: batchTypeDetails.id,
      subjectId: SubjectDetails.id,
      name: /\d/.test(topic.chapter)
        ? topic.chapter
        : Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("name")),
          Sequelize.fn("LOWER", topic.chapter.replace(/\s+/g, " ").trim())
        ),
      status: 1,
    },
  });
  if (!chapterDetails) {
    status = true;
    reason = "chapter not found";
    return { status, reason };
  }

  if (
    courseDetails &&
    boardDetails &&
    classDetails &&
    batchTypeDetails &&
    SubjectDetails &&
    chapterDetails
  ) {
    return {
      status: status,
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      batchTypeId: batchTypeDetails.id,
      subjectId: SubjectDetails.id,
      chapterId: chapterDetails.id,
    };
  }
};

//name: /\d/.test(data.course)
//? data.course
//: Sequelize.where(
//   Sequelize.fn("LOWER", Sequelize.col("name")),
//  Sequelize.fn("LOWER", data.course.replace(/\s+/g, " ").trim())
//),

//NOTE - topic validation
const validateTopic = async (data) => {
  let status = false;
  let reason = null;

  //NOTE - find course
  const courseDetails = await Course.findOne({
    where: {
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", data.course.replace(/\s+/g, " ").trim())
      ),
      status: 1,
    },
  });
  if (!courseDetails) {
    status = true;
    reason = "course not found";
    return { status, reason };
  }

  //NOTE - Find board
  const boardDetails = await Boards.findOne({
    where: {
      courseId: courseDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", data.board.replace(/\s+/g, " ").trim())
      ),
      status: 1,
    },
  });

  if (!boardDetails) {
    status = true;
    reason = "board not found";
    return { status, reason };
  }

  //NOTE - Find Class Details
  const classDetails = await Class.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", data.class.replace(/\s+/g, " ").trim())
      ),
      status: 1,
    },
  });

  if (!classDetails) {
    status = true;
    reason = "class not found";
    return { status, reason };
  }

  //NOTE - Find Batch Type Details
  const batchTypeDetails = await batchType.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", data.batch.replace(/\s+/g, " ").trim())
      ),
      status: 1,
    },
  });

  if (!batchTypeDetails) {
    status = true;
    reason = "batch not found";
    return { status, reason };
  }

  //NOTE - Find subject Details
  const SubjectDetails = await SubjectData.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      batchTypeId: batchTypeDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", data.subject.replace(/\s+/g, " ").trim())
      ),
      status: 1,
    },
  });

  if (!SubjectDetails) {
    status = true;
    reason = "subject not found";
    return { status, reason };
  }

  //NOTE - Find chapter Details
  const chapterDetails = await Chapters.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      batchTypeId: batchTypeDetails.id,
      subjectId: SubjectDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", data.chapter.replace(/\s+/g, " ").trim())
      ),
      status: 1,
    },
  });

  if (!chapterDetails) {
    status = true;
    reason = "chapter not found";
    return { status, reason };
  }

  const topicDetails = await Topic.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      batchTypeId: batchTypeDetails.id,
      subjectId: SubjectDetails.id,
      chapterId: chapterDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", data.topic.replace(/\s+/g, " ").trim())
      ),
      status: 1,
    },
  });

  if (!topicDetails) {
    status = true;
    reason = "topic not found";
    return { status, reason };
  }

  if (
    courseDetails &&
    boardDetails &&
    classDetails &&
    batchTypeDetails &&
    SubjectDetails &&
    chapterDetails &&
    topicDetails
  ) {
    return {
      status: status,
      reason: reason,
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      batchTypeId: batchTypeDetails.id,
      subjectId: SubjectDetails.id,
      chapterId: chapterDetails.id,
      topicId: topicDetails.id,
    };
  }
};

//NOTE - validate chapter 
const validateChapterTopic = async (topic) => {
  let status = false;
  let reason = null;

  //NOTE - find course
  const courseDetails = await Course.findOne({
    where: {
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", topic.course.replace(/\s+/g, " ").trim())
      ),
    },
  });
  if (!courseDetails) {
    status = true;
    reason = "course not found";
    return { status, reason };
  }

  //NOTE - Find board
  const boardDetails = await Boards.findOne({
    where: {
      courseId: courseDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", topic.board.replace(/\s+/g, " ").trim())
      ),
    },
  });

  if (!boardDetails) {
    status = true;
    reason = "board not found";
    return { status, reason };
  }

  //NOTE - Find Class Details
  const classDetails = await Class.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", topic.class.replace(/\s+/g, " ").trim())
      ),
    },
  });

  if (!classDetails) {
    status = true;
    reason = "class not found";
    return { status, reason };
  }

  //NOTE - Find Batch Type Details
  const batchTypeDetails = await batchType.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", topic.batchType.replace(/\s+/g, " ").trim())
      ),
    },
  });

  if (!batchTypeDetails) {
    status = true;
    reason = "batchtype not found";
    return { status, reason };
  }

  //NOTE - Find subject Details
  const SubjectDetails = await SubjectData.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      batchTypeId: batchTypeDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", topic.subject.replace(/\s+/g, " ").trim())
      ),
      //name: topic.subject,
    },
  });

  if (!SubjectDetails) {
    status = true;
    reason = "subject not found";
    return { status, reason };
  }

  //NOTE - Find chapter Details
  const chapterDetails = await Chapters.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      batchTypeId: batchTypeDetails.id,
      subjectId: SubjectDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", topic.chapter.replace(/\s+/g, " ").trim())
      ),
    },
  });

  if (!chapterDetails) {
    status = true;
    reason = "chapter not found";
    return { status, reason };
  }

  if (
    courseDetails &&
    boardDetails &&
    classDetails &&
    batchTypeDetails &&
    SubjectDetails &&
    chapterDetails
  ) {
    return {
      status: status,
      reason: reason,
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      batchTypeId: batchTypeDetails.id,
      subjectId: SubjectDetails.id,
      chapterId: chapterDetails.id,
    };
  }
};

//NOTE - validate chapter topic
const validateSubject = async (chapter) => {
  let status = false;

  //NOTE - find course
  const courseDetails = await Course.findOne({
    where: {
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", chapter.course.replace(/\s+/g, " ").trim())
      ),
    },
  });
  if (!courseDetails) {
    status = true;
    return status;
  }

  //NOTE - Find board
  const boardDetails = await Boards.findOne({
    where: {
      courseId: courseDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", chapter.board.replace(/\s+/g, " ").trim())
      ),
    },
  });

  if (!boardDetails) {
    status = true;
    return status;
  }

  //NOTE - Find Class Details
  const classDetails = await Class.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", chapter.class.replace(/\s+/g, " ").trim())
      ),
    },
  });

  if (!classDetails) {
    status = true;
    return status;
  }

  //NOTE - Find Batch Type Details
  const batchTypeDetails = await batchType.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", chapter.batch.replace(/\s+/g, " ").trim())
      ),
    },
  });

  if (!batchTypeDetails) {
    status = true;
    return status;
  }

  //NOTE - Find subject Details
  const SubjectDetails = await SubjectData.findOne({
    where: {
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      batchTypeId: batchTypeDetails.id,
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", chapter.subject.replace(/\s+/g, " ").trim())
      ),
      //name: topic.subject,
    },
  });

  if (!SubjectDetails) {
    status = true;
    return status;
  }

  if (
    courseDetails &&
    boardDetails &&
    classDetails &&
    batchTypeDetails &&
    SubjectDetails
  ) {
    return {
      status: status,
      courseId: courseDetails.id,
      boardId: boardDetails.id,
      classId: classDetails.id,
      batchTypeId: batchTypeDetails.id,
      subjectId: SubjectDetails.id,
    };
  }
};

//ANCHOR: Define a function that hits the Python API
const getPythonData = async (data) => {
  const response = await axios.post("https://qbapi.anshuagrawal.in/convert", {
    data,
  });

  return response.data;
};

//NOTE - state validation
const validateState = async (state) => {
  let status = false;
  //NOTE - find course
  const stateDetails = await State.findOne({
    where: {
      name: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        Sequelize.fn("LOWER", state.state.replace(/\s+/g, " ").trim())
      ),
    },
  });
  if (!stateDetails) {
    status = true;
    return status;
  }

  if (stateDetails) {
    return { status: status, stateId: stateDetails.id };
  }
};

//NOTE - grivances category validation
const validatecategory = async (category) => {
  let status = false;
  //NOTE - find course
  const categoryDetails = await grievanceCategory.findOne({
    where: {
      category: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("category")),
        Sequelize.fn("LOWER", category.category.replace(/\s+/g, " ").trim())
      ),
    },
  });
  if (!categoryDetails) {
    status = true;
    return status;
  }

  if (categoryDetails) {
    return { status: status, categoryId: categoryDetails.id };
  }
};

//NOTE - check video url is good for m3u8 format
const checkVideoFilename = async (filename) => {
  var parts = filename.split("/");
  if (parts.length > 1) {
    var afterSlash = parts[1];
    if (afterSlash.includes(" ")) {
      return false;
    } else if (!afterSlash.includes("_")) {
      return false;
    }
  }
  return true;
};

const AllName = async (chapterId) => {
  try {
    const getChapter = await Chapters.findOne({
      where: {
        id: chapterId,
      },
      include: [
        {
          model: Course,
          attributes: ["name"],
        },
        {
          model: Boards,
          attributes: ["name"],
        },
        {
          model: Class,
          attributes: ["name"],
        },
        {
          model: batchType,
          attributes: ["name"],
        },
        {
          model: SubjectData,
          attributes: ["name"],
        },
      ],
    });

    //NOTE - return final response
    return {
      course: getChapter.course.name,
      board: getChapter.board.name,
      class: getChapter.class.name,
      batchType: getChapter.batchType.name,
      subject: getChapter.subject.name,
      chapter: getChapter.course.name,
    };
  } catch (error) { }
};

//NOTE - checking table has value or not
const isHtmlTableEmpty = (htmlString) => {
  const cleanText = htmlString.replace(/<\/?[^>]+(>|$)/g, '').trim();
  return cleanText === '';
}

//NOTE - get difficulty level
const difficultyLevel = (htmlString) => {
  // Remove HTML tags and white spaces
  const cleanText = htmlString.replace(/<\/?[^>]+(>|$)/g, '').trim();

  if (cleanText !== '') {
    return cleanText;
  }
  return null;
}

//NOTE - get difficulty level
const extractAnswer = (htmlString) => {
  const match = htmlString.match(/">(.+?)</);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}


module.exports = {
  convertFile,
  validateUsers,
  validateBatches,
  pushToS3Bucket,
  validateStaff,
  validateRole,
  validateClassDetails,
  getPythonData,
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
};