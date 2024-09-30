const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize, Op, literal } = require("sequelize");
const moment = require("moment");
const { config } = require("../../config/db.config");
const jwt = require("jsonwebtoken");
const {
  createActivity,
  createActivityMentorship,
  createActivityForExpiryDate,
  createActivityLiveClass,
  createActivityForMissedLiveclass,
  dateStatus
} = require("./service");
const { retriveLeads } = require("../../helpers/leadsquard");
const { captureLead } = require("../users/service");
const { userDetails } = require("../../helpers/userdetails");
const { bathDetails } = require("../../helpers/batchValidator");
const {
  generateTokenForZoom,
  toTime,
  generateZoomToken,
  createZoomMeeting,
  getDateParams,
  extractTimeFromDateTime,
  convertIntoMin,
  convertTime,
  formatTime,
  dateFilter,
  addTimeIntoDate,
  recordSessionToken,
  eventStatus,
} = require("./service");
const { timezoneConverter } = require("../../helpers/service");
const { userBased } = require("../../helpers/teacherValidation");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const getSignedUrl = require("../../helpers/getSignedUrl");
const { getYouTubeVideoId, getSignedUrlCloudFront } = require("../../helpers/cloudFront");
const _ = require("lodash");
const axios = require("axios");
const Chapter = db.chapter;
const Subject = db.subject;
const batchType = db.batchTypes;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;
const Event = db.event;
const Admin = db.admin;
const User = db.users;
const StudentEventMap = db.student_event_map;
const BookEvents = db.teacher_book_map;
const TeacherSchedule = db.teacher_schedule;
const eventDemoMap = db.event_demo_map;
const Student = db.student;
const reminderTime = db.reminder_time;
const UserDetails = db.users;
const StudentDetails = db.student;
const studentSubscriptionMap = db.student_subscription_map;
const zoomTeacherMap = db.zoom_teacher_map;
const RolePermission = db.permissionRole;
const studentAttendance = db.event_student_attendance;
const teacherAttendance = db.event_teacher_attendance;
const Content = db.content;
const Syllabus = db.syllabus;
const client = require("../../helpers/init_redis");
const AWS = require("aws-sdk");
const s3Stream = require("s3-upload-stream")(new AWS.S3());
const cron = require("node-cron");
const { log } = require("console");
const { loginAdmin } = require("../admin");
const timeCronMap = db.time_cron_map;
const TeacherSubjectMap = db.teacher_subject_map;
const eventAttendMap = db.event_attend_map;
const liveclassReport = db.liveclass_report;
const liveclassTeacherReport = db.liveclass_teacher_report;
const studentPlanMap = db.student_plan_map;
const student_event_map = db.student_event_map;
const studentEventTrack = db.event_track_map;
const eventChatMap = db.event_chat_map;
const studentCoursePackage = db.student_course_package_map;
const coursePackage = db.course_package_map;




// Set S3 credentials and region
AWS.config.update({
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_KEY,
  region: config.S3_REGION,
});
process.env.AWS_SDK_LOAD_CONFIG = 1;
// Set the Zoom API key and secret
const zoomApiKey = config.ZOOM_API_KEY;
const zoomApiSecret = config.ZOOM_API_SECRET;
// Set the S3 bucket name and key (file name) to upload the video recording to
const bucketName = config.S3_BUCKET_NAME;

//ANCHOR - create Event by only batchType
const createEvent = async (req, res) => {
  try {
    const {
      batchTypeId,
      subjectId,
      chapterId,
      teacherId,
      type,
      attemptBy,
      time,
      url,
      category,
      thumbnail,
      title
    } = req.body;

    //NOTE - ID FROM token
    const userId = req.user.id;

    //NOTE - GET ALL STUDENT DETAILS
    const studentDetails = await Student.findAll({
      where: {
        batchTypeId: batchTypeId,
      },
      attributes: ["id"],
    });
    if (!studentDetails) {
      return res.status(400).send({
        status: 400,
        message: "User not available with this batchType.",
      });
    } else {
      const data = new Date(attemptBy);
      const TeacherSchedules = await TeacherSchedule.findOne({
        where: {
          teacherId: teacherId,
          date: { [Sequelize.Op.eq]: data },
          availability: 1,
        },
      });
      if (!TeacherSchedules)
        return res
          .status(400)
          .send({ status: 400, message: msg.TEACHER_UNAVAILABLE });

      //NOTE - getting only time form date and time 12:00
      let timeString = attemptBy.split("T")[1];

      //NOTE - CONVERT "00:90:00"  INTO "01:30:00"
      const finalTime = convertTime(time);

      //NOTE - get end time of event TO TIME
      const toTimes = extractTimeFromDateTime(timeString, finalTime, attemptBy);

      //NOTE - checking booking event
      const BookEventsDetails = await BookEvents.findOne({
        where: {
          teacherId: teacherId,
          date: { [Sequelize.Op.eq]: data },

          [Sequelize.Op.or]: [
            {
              bookTimeFrom: { [Sequelize.Op.lte]: timeString },
              bookTimeTo: { [Sequelize.Op.gt]: timeString }, //gte if you want to check currect time
            },
            {
              bookTimeFrom: { [Sequelize.Op.lte]: toTimes },
              bookTimeTo: { [Sequelize.Op.gte]: toTimes },
            },
            {
              bookTimeFrom: { [Sequelize.Op.gte]: timeString },
              bookTimeTo: { [Sequelize.Op.lte]: toTimes },
            },
          ],
        },
      });

      if (BookEventsDetails)
        return res
          .status(400)
          .send({ status: 400, message: msg.TEACHER_ALREADY_BOOKED });

      //NOTE - teacher zoom map
      let zoomKeys;
      let generateMeeting;
      //NOTE - when create zoom class
      if (category !== "Youtube") {
        //NOTE - teacher zoom map
        zoomKeys = await zoomTeacherMap.findOne({
          where: { teacherId: teacherId },
        });
        //NOTE - if not find it automatically take teacher id 1 all details
        if (!zoomKeys) {
          zoomKeys = await zoomTeacherMap.findOne({
            where: { teacherId: 1 },
          });
        }

        //NOTE - when zoom credential is not avaliable
        if (zoomKeys === null) {
          return res.status(400).send({
            status: 400,
            message: msg.ADD_ZOOM_CREDENTIAL,
          });
        }

        //NOTE - generate token for zoom
        const token = await generateZoomToken(
          zoomKeys.auth_api_key,
          zoomKeys.auth_api_secret
        );
        if (!token) {
          return res.status(400).send({
            status: 400,
            message: msg.INVALID_CREDENTIAL,
          });
        }

        //NOTE - create meeting ID and password
        generateMeeting = await createZoomMeeting(token);
        if (generateMeeting === false) {
          return res.status(400).send({
            status: 400,
            message: msg.SOMETHING_WRONG,
          });
        }
      }


      const mins = convertIntoMin(time);

      //NOTE - create attempt by started date
      const endDateTime = new Date(
        new Date(new Date(attemptBy).getTime() + mins * 60000).toISOString()
      ); // add 15 minutes in milliseconds

      let Image;
      //NOTE - upload thumbnail
      if (thumbnail && thumbnail.includes("base64")) {
        const uploadImage = await uploadFileS3(thumbnail, msg.EVENT_THUMBNAILS);
        Image = uploadImage.Key
      }

      //NOTE: actual event
      const newEvent = await Event.create({
        batchTypeId: batchTypeId,
        subjectId: subjectId ? subjectId : null,
        chapterId: chapterId ? chapterId : null,
        zoomApiKey: category !== "Youtube" ? zoomKeys.zoom_api_key : null,
        zoomApiSecret: category !== "Youtube" ? zoomKeys.zoom_api_secret : null,
        meetingNumber: category !== "Youtube" ? generateMeeting.id : null,
        password: category !== "Youtube" ? generateMeeting.password : null,
        teacherId: teacherId,
        type: type,
        attemptBy: attemptBy,
        endDate: endDateTime,
        time: finalTime,
        url: url,
        category: category,
        thumbnail: Image,
        title: title,
        createdById: userId,
      });

      for (const ids of studentDetails) {
        const userDetails = await User.findOne({
          where: { typeId: ids.dataValues.id },
        });

        if (userDetails) {
          //NOTE: event created for student
          const studentEvent = new StudentEventMap({
            eventId: newEvent?.id,
            studentId: userDetails?.id,
          });
          await studentEvent.save();

          //NOTE -  final booking for student with teacher
          await BookEvents.create({
            eventId: newEvent.id,
            studentId: userDetails?.id,
            teacherId: teacherId,
            date: attemptBy,
            bookTimeFrom: timeString,
            bookTimeTo: toTimes,
            type: type,
          });
        }
      }
      return res.status(200).send({
        status: 200,
        message: msg.EVENT_CREATED,
      });
    }
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - get all Event
const getAllEvent = async (req, res) => {
  try {
    let getAllEvents = [];

    const { page, limit, teacherId } = req.query;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE - filter teacher by id
    let value = {};
    if (teacherId) {
      value = {
        teacherId: teacherId,
      };
    }

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (["teacher", "mentor", "Teacher", "Mentor"].includes(req.user?.role)) {
        //NOTE - Get  User details from token
        const getAdmin = await Admin.findOne({
          where: { id: req.user.id },
        });
        //NOTE - get Teacher subject details
        subject_details = await TeacherSubjectMap.findAll({
          where: { teacherId: getAdmin.id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });

        //NOTE - push all user class Ids for
        const subjectClassIds = subject_details.map(
          (item) => item.dataValues.classId
        );

        //NOTE - get all batch of class
        const batchesClass = await batchType.findAll({
          where: {
            classId: {
              [Sequelize.Op.in]: subjectClassIds,
            },
          },
          attributes: ["classId", "id"],
        });

        //NOTE - fianl batches
        const classbatches = batchesClass.map((item) => item.id);

        //NOTE - push all batch ids
        const batchIds = subject_details.map(
          (item) => item.dataValues.batchTypeId
        );

        if (batchIds.every((id) => id === null)) {
          //NOTE - all chapter are being taught in the same batch, filter based on classId only
          params = {
            batchTypeId: {
              [Sequelize.Op.in]: classbatches,
            },
          };
        } else {
          //NOTE - filter based on batchTypeId
          params = {
            batchTypeId: {
              [Sequelize.Op.in]: batchIds,
            },
          };
        }
      }

    //NOTE - get all live event
    const getEvent = await Event.findAndCountAll({
      ...query,
      where: { ...value, ...params }, //TODO - teacher filter
      include: [
        {
          model: batchType,
          attributes: ["id", "name"],
        },
        {
          model: Subject,
          attributes: ["id", "name"],
        },
        {
          model: Chapter,
          attributes: ["id", "name"],
        },
        {
          model: Admin,
          attributes: ["id", "name", "email"],
        },
        {
          model: Admin,
          as: "creator",
          attributes: ["id", "name"],
          include: {
            model: RolePermission,
            attributes: ["role"],
          },
        },
        {
          model: Admin,
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
    if (!getEvent) {
      return res
        .status(400)
        .send({ status: 400, message: msg.EVENT_NOT_FOUND });
    }

    //NOTE - generate signature
    for (let data of getEvent.rows) {

      let zoomKeys;
      let generatedToken;
      if (data.category !== "Youtube") {
        generatedToken = generateTokenForZoom(
          data.zoomApiSecret,
          data.meetingNumber,
          data.zoomApiKey,
          data.teacherRole
        );

        //NOTE - teacher zoom map
        zoomKeys = await zoomTeacherMap.findOne({
          where: { teacherId: data.teacherId },
        });

        //NOTE - if not find it automatically take teacher id 1 all details
        if (!zoomKeys) {
          zoomKeys = await zoomTeacherMap.findOne({
            where: { teacherId: 1 },
          });
        }

      }

      //NOTE - final push of event
      getAllEvents.push({
        id: data.id,
        batchTypeId: data.batchType?.batchTypeId,
        batchType: data.batchType?.name,
        subjectId: data.subject?.id,
        subject: data.subject?.name,
        chapterId: data.chapter?.id,
        chapter: data.chapter?.name,
        zoomApiKey: data.category !== "Youtube" && zoomKeys.zoom_api_key ? zoomKeys.zoom_api_key : null,
        zoomApiSecret: data.category !== "Youtube" && zoomKeys.zoom_api_secret
          ? zoomKeys.zoom_api_secret
          : null,
        meetingNumber: data.meetingNumber,
        password: data.password,
        signature: generatedToken || null,
        type: data.type,
        category: data.category,
        url: data?.url,
        thumbnail: data?.thumbnail ? await getSignedUrlCloudFront(data.thumbnail) : null,
        title: data.title,
        endDate: data.endDate,
        startedBy: data.attemptBy,
        time: data.time,
        teacherId: data.teacherId,
        teacherName: data.adminUser.name,
        teacherEmail: data.adminUser.email,
        role: 1,
        createdByName: data.creator ? data.creator?.name : null,
        createdByRole: data.creator
          ? data.creator?.permission_role?.role
          : null,
        updateByName: data.updater ? data.updater?.name : null,
        updateByRole: data.updater ? data.updater?.permission_role.role : null,
        deepLink: `${config.DEEP_LINK_URL}${data.id}`
      });
    }

    //NOTE - return response
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getEvent.count,
      data: getAllEvents,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - get event by id
const getEventById = async (req, res) => {
  try {
    const getEvent = await Event.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: batchType,
          attributes: ["id", "name"],
        },
        {
          model: Subject,
          attributes: ["id", "name"],
        },
        {
          model: Chapter,
          attributes: ["id", "name"],
        },
        {
          model: Admin,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!getEvent) {
      return res
        .status(400)
        .send({ status: 400, message: msg.EVENT_NOT_FOUND });
    }

    const getSubject = await Subject.findOne({
      where: {
        id: getEvent.subjectId,
      },
      include: [
        {
          model: Course,
          attributes: ["name"], //include: { all: true, nested: true },
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
      ],
      order: [["createdAt", "DESC"]],
    });

    //NOTE - final response
    let allEvent = {
      id: getEvent.id,
      courseId: getSubject?.courseId,
      courseName: getSubject.course?.name,
      boardId: getSubject?.boardId,
      boardName: getSubject.board?.name,
      className: getSubject.class?.name,
      classId: getSubject?.classId,
      batchTypeId: getEvent.batchType?.id,
      batchType: getEvent.batchType?.name,
      subjectId: getEvent?.subject?.id,
      subject: getEvent?.subject?.name,
      chapterId: getEvent?.chapter?.id,
      chapter: getEvent?.chapter?.name,
      type: getEvent?.type,
      category: getEvent.category,
      url: getEvent?.url,
      thumbnail: getEvent?.thumbnail ? await getSignedUrlCloudFront(getEvent.thumbnail) : null,
      title: getEvent.title,
      attemptBy: getEvent?.attemptBy,
      time: getEvent?.time,
      zoomApiKey: getEvent?.zoomApiKey,
      zoomApiSecret: getEvent?.zoomApiSecret,
      meetingNumber: getEvent?.meetingNumber,
      password: getEvent?.password,
      teacherId: getEvent?.teacherId,
      teacherName: getEvent?.adminUser?.name,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allEvent,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - update event by Id
const updateEventById = async (req, res) => {
  try {
    const {
      batchTypeId,
      subjectId,
      chapterId,
      zoomApiKey,
      zoomApiSecret,
      meetingNumber,
      password,
      teacherId,
      type,
      attemptBy,
      time,
      eventId,
      url,
      category,
      thumbnail,
      title
    } = req.body;

    //NOTE - check event
    const getEvent = await Event.findOne({
      where: { id: eventId },
    });
    if (!getEvent) {
      return res
        .status(400)
        .send({ status: 400, message: msg.EVENT_NOT_FOUND });
    }

    let Image;
    //NOTE - upload thumbnail
    if (thumbnail && thumbnail.includes("base64")) {
      const uploadImage = await uploadFileS3(thumbnail, msg.EVENT_THUMBNAILS);
      Image = uploadImage.Key
    }

    //NOTE - update event data
    await Event.update(
      {
        batchTypeId: batchTypeId,
        subjectId: subjectId,
        chapterId: chapterId,
        zoomApiKey: zoomApiKey,
        zoomApiSecret: zoomApiSecret,
        meetingNumber: meetingNumber,
        password: password,
        teacherId: teacherId,
        type: type,
        attemptBy: attemptBy,
        time: time,
        url: url,
        category: category,
        thumbnail: Image,
        title: title
      },
      { where: { id: eventId } }
    );

    //NOTE - return final response
    return res.status(200).send({
      status: 200,
      message: msg.EVENT_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - delete event
const deleteEvent = async (req, res) => {
  try {
    const getEvent = await Event.findOne({
      where: { id: req.params.id },
    });
    if (!getEvent) {
      return res
        .status(400)
        .send({ status: 400, message: msg.EVENT_NOT_FOUND });
    }

    await Event.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({ status: 200, message: msg.EVENT_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR  - get all live class history
const getLiveClassHistory = async (req, res) => {
  try {
    let getAllEvents = [];
    const { page, limit } = req.query;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }
    //NOTE - current date
    const startDate = new Date();

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (
        !["admin", "Admin", "superAdmin", "superadmin"].includes(req.user?.role)
      ) {
        // //NOTE - Get  User details from token
        // const getAdmin = await Admin.findOne({
        //   where: { id: req.user.id },
        // });
        params = {
          teacherId: req.user.id,
        };
      }
    //NOTE - get all teacher history of event
    const getEvent = await Event.findAndCountAll({
      ...query,
      where: {
        attemptBy: {
          [Sequelize.Op.lte]: startDate,
        },
        ...params,
      },
      include: [
        {
          model: batchType,
          attributes: ["id", "name"],
        },
        {
          model: Subject,
          attributes: ["id", "name"],
        },
        {
          model: Chapter,
          attributes: ["id", "name"],
        },
        {
          model: Admin,
          attributes: ["name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!getEvent) {
      return res
        .status(400)
        .send({ status: 400, message: msg.EVENT_NOT_FOUND });
    }

    for (let data of getEvent.rows) {
      getAllEvents.push({
        id: data.id,
        batchTypeId: data?.batchTypeId,
        batchType: data.batchType?.name,
        attemptBy: data.attemptBy,
        meetingNumber: data.meetingNumber,
        time: data.time,
        teacherId: data.teacherId,
        teacherName: data.adminUser?.name,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getEvent.count,
      data: getAllEvents,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - create demo
const createEventRequest = async (req, res) => {
  try {
    const {
      subjectId,
      studentId,
      fromTime,
      toTime,
      date,
      type,
      teacherId,
      reminderMe,
    } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    //create request by student
    const eventDemoMaps = await eventDemoMap.create({
      subjectId: subjectId,
      studentId: token,
      teacherId: teacherId,
      fromTime: fromTime,
      toTime: toTime,
      date: date,
      type: type,
      reminderMe: reminderMe,
    });

    return res.status(200).send({
      status: 200,
      message: msg.EVENT_REQUESTED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - create Event FOR DEMO REQUEST
const createEventForDemo = async (req, res) => {
  try {
    const {
      batchTypeId,
      subjectId,
      chapterId,
      zoomApiKey,
      zoomApiSecret,
      meetingNumber,
      password,
      teacherId,
      studentId,
      type,
      date,
      bookTimeFrom,
      bookTimeTo,
    } = req.body;

    const newEvent = await Event.create({
      batchTypeId: batchTypeId,
      subjectId: subjectId,
      chapterId: chapterId,
      zoomApiKey: zoomApiKey,
      zoomApiSecret: zoomApiSecret,
      meetingNumber: meetingNumber,
      password: password,
      teacherId: teacherId,
      type: type === "demo" ? "demo class" : type,
      attemptBy: date,
      time: time,
    });

    const teacherBooked = await BookEvents.create({
      eventId: newEvent.id,
      studentId: studentId,
      teacherId: teacherId,
      date: date,
      bookTimeFrom: bookTimeFrom,
      bookTimeTo: bookTimeTo,
      type: type,
    });

    if (newEvent) {
      await eventDemoMap.update(
        { accept: 1 },
        {
          where: { studentId: studentId, subjectId: subjectId },
        }
      );
    }

    return res.status(200).send({
      status: 200,
      message: msg.EVENT_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//get all event requested
const getAllEventRequested = async (req, res) => {
  try {
    let getAllEventMap = [];
    const { page, limit, student, status } = req.query;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    let final = {};
    if (student) {
      final = {
        studentId: student,
      };
    }
    if (status) {
      final = {
        ...final,
        status: status,
      };
    }

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        params = {
          teacherId: req.user.id,
        };
      }
    let teacher = {};
    if (params !== null && params !== undefined) {
      teacher.teacherId = { [Op.or]: [params.teacherId, null] };
    }

    let userParams;
    if (
      req.user?.role &&
      ["teacher", "mentor"].includes(req.user?.role.toLowerCase())
    ) {
      //NOTE - filter based on batch and class base alluser
      userParams = await userBased(req.user.id, req.user?.role);
    }

    //NOTE - get all event requested details
    const getEventDemoMap = await eventDemoMap.findAndCountAll({
      ...query,
      where: { ...final, ...teacher, ...userParams },
      include: [
        {
          model: Subject,
          attributes: ["name"],
          required: false,
        },
        {
          model: Admin,
          attributes: ["name"],
          required: false,
        },
        {
          model: UserDetails,
          attributes: ["name"],
          where: { type: "student" },
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    for (const allEventDemoMap of getEventDemoMap.rows) {
      getAllEventMap.push({
        id: allEventDemoMap.id,
        teacherId: allEventDemoMap.teacherId,
        teacher: allEventDemoMap.adminUser
          ? allEventDemoMap?.adminUser?.name
          : null,
        studentId: allEventDemoMap.studentId,
        student: allEventDemoMap?.user?.name
          ? allEventDemoMap?.user?.name
          : null,
        subjectId: allEventDemoMap.subjectId ? allEventDemoMap.subjectId : null,
        subject: allEventDemoMap.subject ? allEventDemoMap.subject.name : null,
        type: allEventDemoMap.type,
        date: allEventDemoMap.date,
        fromTime: allEventDemoMap.fromTime ? allEventDemoMap.fromTime : null,
        toTime: allEventDemoMap.toTime ? allEventDemoMap.toTime : null,
        status: allEventDemoMap.status,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getEventDemoMap.count,
      data: getAllEventMap,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : event requested by id
const getEventRequestedById = async (req, res) => {
  try {
    const getEventDemoMap = await eventDemoMap.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Subject,
          attributes: ["name"],
          required: false,
        },
        {
          model: Admin,
          attributes: ["name"],
          required: false,
        },
        {
          model: UserDetails,
          attributes: ["name"],
          where: { type: "student" },
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!getEventDemoMap) {
      return res
        .status(400)
        .send({ status: 400, message: msg.EVENT_REQUESTED_NOT_FOUND });
    }

    let result = {
      id: getEventDemoMap.id,
      teacherId: getEventDemoMap.teacherId,
      teacher: getEventDemoMap.adminUser
        ? getEventDemoMap?.adminUser?.name
        : null,
      studentId: getEventDemoMap.studentId,
      student: getEventDemoMap?.user?.name ? getEventDemoMap?.user?.name : null,
      subjectId: getEventDemoMap.subjectId ? getEventDemoMap.subjectId : null,
      subject: getEventDemoMap.subject ? getEventDemoMap.subject.name : null,
      type: getEventDemoMap.type,
      date: getEventDemoMap.date,
      fromTime: getEventDemoMap.fromTime ? getEventDemoMap.fromTime : null,
      toTime: getEventDemoMap.toTime ? getEventDemoMap.toTime : null,
      status: getEventDemoMap.status,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : update status
const statusUpdatedById = async (req, res) => {
  try {
    const { status, Id } = req.body;
    const statusUpdate = await eventDemoMap.findOne({
      where: { id: Id },
      attributes: ["status", "id"],
    });
    if (!statusUpdate) {
      return res
        .status(400)
        .send({ status: 400, message: msg.EVENT_REQUESTED_NOT_FOUND });
    }

    const updatedDemoMap = await eventDemoMap.update(
      { status: status },
      {
        where: { id: Id },
      }
    );

    return res.status(200).send({
      status: 200,
      message: msg.EVENT_REQUEST_STATUS_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - get all Event BY STUDENT id
const getAllEventByStudentId = async (req, res) => {
  try {
    let getAllEvents = [];
    const { day, date, status, batchTypeId } = req.query;

    //NOTE - getting id from decode tokens
    const userId = req.user.id;

    //NOTE - Get user details from user table
    const user_details = await User.findOne({
      where: { id: userId, type: "Student" },
    });
    if (!user_details)
      return res
        .status(400)
        .send({ status: 400, message: msg.USER_NOT_FOUND });

    //NOTE - Get user Details from student table
    const batchDetails = await bathDetails(batchTypeId);

    let isPurchased;
    if (batchTypeId) {
      //NOTE - Set the time part of the current date to zero
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      //NOTE - find course package purchased or not
      isPurchased = await studentCoursePackage.findOne({
        where: {
          batchTypeId: batchTypeId, userId: userId,
          validity: {
            [Sequelize.Op.gt]: currentDate,
          },
        },
        attributes: ["id"],
        include: {
          model: coursePackage,
          where: {
            batchTypeId: batchTypeId,
            package_type: "Live"
          },
          attributes: ["id"]
        }
      })
    }

    if (status) {
      //NOTE - Get the current datetime
      const now = moment().toDate();
      const currentDate = moment(now).add(5, 'hours').add(30, 'minutes').toDate();

      //NOTE - filter based on status
      let dates;
      let joinSts;
      if (status === "pending") {
        dates = {
          attemptBy: {
            [Op.gt]: currentDate,
          }
        }
        joinSts = 0;
      }
      else if (status === "completed") {
        dates = {
          attemptBy: {
            [Op.lt]: currentDate,
          }
        }
        joinSts = 1;
      }
      else if (status === "missed") {
        dates = {
          attemptBy: {
            [Op.lt]: currentDate,
          }
        }
        joinSts = 0;
      }


      //NOTE - get all event of user
      const getEvent = await StudentEventMap.findAndCountAll({
        where: {
          studentId: userId,
          joinStatus: joinSts
        },
        include: [
          {
            model: Event,
            where: {
              ...dates,
              type: "Live Class"
            },
            include: [
              {
                model: Subject,
                attributes: ["id", "name"],
              },
              {
                model: Chapter,
                attributes: ["id", "name"],
              },
              {
                model: Admin,
                attributes: ["name", "email"],
              },
            ]
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      let eventData = {};
      if (isPurchased) {
        //NOTE - taking data from event map
        for (let data of getEvent.rows) {
          if (data !== null) {
            //NOTE - Get user details from user table
            const user_details = await User.findOne({
              where: { id: userId, type: "Student" },
            });
            if (!user_details)
              return res
                .status(400)
                .send({ status: 400, message: msg.USER_NOT_FOUND });

            //NOTE - Get user Details from student table
            const student_details = await Student.findOne({
              where: { id: user_details.typeId },
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
              ],
              order: [["createdAt", "DESC"]],
            });

            //NOTE - final push event
            getAllEvents.push({
              id: data.eventId,
              // title:
              //   data.type === "Demo Class" || data.type === "Mentorship"
              //     ? `${student_details?.class?.name} ${student_details?.board?.name} - ${data.type}`
              //     : `${student_details?.class?.name} ${student_details?.board?.name
              //     }- ${data?.event?.chapter?.name
              //       ? data?.event?.chapter?.name
              //       : data?.event?.subject?.name
              //     }`,
              class: student_details?.class?.name,
              type: data?.event?.type,
              startedBy: (data?.event?.attemptBy).toISOString().split(".")[0], //TODO - split after .00Z
              time: data?.event?.time,
              teacherId: data?.event?.teacherId,
              teacherName: data?.event?.adminUser?.name,
              password: data?.event?.password || null,
              originalUrl: data?.event?.url || null,
              convertUrl: data?.event?.category === "Youtube" ? await getYouTubeVideoId(data?.event?.url) : null,
              category: data?.event?.category,
              thumbnail: data?.event?.thumbnail ? await getSignedUrlCloudFront(data?.event?.thumbnail) : null,
              title: data?.event?.title,
              status: status === "missed" ? "#E60B0B" : status === "completed" ? "#098A4E" : "#F26B35"
            });
          }
        }

        //NOTE- RETURN DATE IN KEY FORMATE IN CATEGORY ALL
        eventData = getAllEvents.reduce((acc, event) => {
          const dateObj = new Date(event.startedBy); // Convert startedBy to Date object
          const dateStr = dateObj.toISOString().split("T")[0]; // Get date string from the Date object
          if (acc[dateStr]) {
            acc[dateStr].push(event);
          } else {
            acc[dateStr] = [event];
          }
          return acc;
        }, {});
      }

      //NOTE - final response
      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: eventData,
      });
    }

    //NOTE - category and date is null
    if (day === "" && date === "") {
      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: [],
      });
    }
    //NOTE - day based filter
    let dateParams;
    if (["today", "tomorrow", "yesterday", "all"].includes(day)) {
      dateParams = getDateParams(day);
    }

    //NOTE - Set the date range for student event
    const startDate = moment().subtract(15, "days").startOf("day").toDate(); //back date
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = moment().add(15, "days").endOf("day").toDate();  //upcoming dates
    endDate.setUTCHours(0, 0, 0, 0);

    //NOTE - get all data if day is all
    if (day === "all") {
      dateParams = {
        attemptBy: {
          [Op.between]: [startDate, endDate],
        },
      };
    }

    //NOTE - date wise filter
    let val;
    if (date !== "" && date) {
      val = dateFilter(date);
    }

    let eventData = {};
    if (isPurchased) {
      //NOTE - get all events
      const getEvents = await Event.findAll({
        where: {
          ...dateParams,
          ...val,
          type: "Live Class"
        },
        include: [
          {
            model: Subject,
            attributes: ["id", "name"],
          },
          {
            model: Chapter,
            attributes: ["id", "name"],
          },
          {
            model: Admin,
            attributes: ["name", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      for (let getEvent of getEvents) {
        if (getEvent !== null) {

          let zoomKeys;
          if (getEvent.type === "Zoom") {
            //NOTE - teacher zoom map
            zoomKeys = await zoomTeacherMap.findOne({
              where: { teacherId: getEvent.teacherId },
            });
            //NOTE - if not find it automatically take teacher id 1 all details
            if (!zoomKeys) {
              zoomKeys = await zoomTeacherMap.findOne({
                where: { teacherId: 1 },
              });
            }
          }

          //NOTE - student event status
          const status = await eventStatus(
            userId,
            getEvent.id,
            getEvent.attemptBy
          );

          //NOTE - final push event
          getAllEvents.push({
            id: getEvent.id,
            // title: getEvent.type === "Demo Class" || getEvent.type === "Mentorship"
            //     ? `${student_details?.class?.name} ${student_details?.board?.name} - ${getEvent.type}`
            //     : `${student_details?.class?.name} ${student_details?.board?.name
            //     }- ${getEvent.chapter?.name
            //       ? getEvent?.chapter?.name
            //       : getEvent?.subject?.name
            //     }`,
            class: batchDetails.class.name,
            type: getEvent.type,
            startedBy: (getEvent?.attemptBy).toISOString().split(".")[0], //TODO - split after .00Z
            time: getEvent.time,
            teacherId: getEvent.teacherId,
            teacherName: getEvent?.adminUser?.name,
            zoomApiKey: zoomKeys?.zoom_api_key || null,
            zoomApiSecret: zoomKeys?.zoom_api_secret || null,
            meetingNumber: getEvent.meetingNumber || null,
            password: getEvent.password || null,
            originalUrl: getEvent.url || null,
            convertUrl: getEvent.category === "Youtube" ? await getYouTubeVideoId(getEvent.url) : null,
            category: getEvent.category,
            thumbnail: getEvent.thumbnail ? await getSignedUrlCloudFront(getEvent.thumbnail) : null,
            title: getEvent?.title,
            status: status,
          });
        }

      }

      //NOTE- RETURN DATE IN KEY FORMATE IN CATEGORY ALL
      if (day === "all") {
        eventData = getAllEvents.reduce((acc, event) => {
          const dateObj = new Date(event.startedBy); // Convert startedBy to Date object
          const dateStr = dateObj.toISOString().split("T")[0]; // Get date string from the Date object
          if (acc[dateStr]) {
            acc[dateStr].push(event);
          } else {
            acc[dateStr] = [event];
          }
          return acc;
        }, {});
      }
    }

    //NOTE - set client
    //await client.set('getAllEvent', category === "all" ? JSON.stringify(getAllEvents) : JSON.stringify(getAllEvents));

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: day === "all" ? eventData : getAllEvents,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all Subject
const RedisgetAllStudentEvent = async (req, res, next) => {
  try {
    client.get("getAllEvent", (err, redis_data) => {
      if (err) {
        throw err;
      } else if (redis_data) {
        return res.send(JSON.parse(redis_data));
      } else {
        next();
      }
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//create reminder time
const createReminderTime = async (req, res) => {
  try {
    const { time } = req.body;
    const newReminderTime = await reminderTime.create({
      time: time,
    });

    return res.status(200).send({
      status: 200,
      message: msg.REMINDER_TIME_CREATED,
      data: newReminderTime,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//get all ReminderTime
const getAllReminderTime = async (req, res) => {
  try {
    const getReminderTime = await reminderTime.findAndCountAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      order: [["createdAt", "DESC"]],
    });
    if (!getReminderTime) {
      return res
        .status(400)
        .send({ status: 400, message: msg.REMINDER_TIME_NOT_FOUND });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getReminderTime.count,
      data: getReminderTime.rows,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE - GET LIVE EVENT ATTENDENCE
const attendLiveEvent = async (req, res) => {
  try {
    if (req.user.role === " superAdmin" || " superAdmin") {
      //const attend  = await
    }

    //const addAttendance =  await

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: decoded,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - create Event by only batchType
const createEventNew = async (req, res) => {
  try {
    const { teacherId, attemptBy, time, status, requestId } = req.body;

    //NOTE - ID FROM token
    const userId = req.user.id;

    //NOTE - reject user request
    if (requestId && status === "Rejected") {
      const getEventRequest = await eventDemoMap.findOne({
        where: { id: requestId },
      });
      if (!getEventRequest) {
        return res
          .status(200)
          .send({ status: 200, message: msg.EVENT_REQUESTED_NOT_FOUND });
      }

      await eventDemoMap.update(
        { status: status },
        {
          where: { id: requestId },
        }
      );

      return res.status(200).send({
        status: 200,
        message: msg.EVENT_REQUEST_STATUS_UPDATED,
      });
    }

    const getEventRequest = await eventDemoMap.findOne({
      where: { id: requestId },
    });
    if (!getEventRequest) {
      return res
        .status(500)
        .send({ status: 500, message: msg.EVENT_REQUESTED_NOT_FOUND });
    }

    //NOTE - if type mentorship and doubt class create live event
    if (
      getEventRequest.type === "Doubt Class" ||
      getEventRequest.type === "Mentorship" ||
      getEventRequest.type === "Demo Class" ||
      status === "Accepted"
    ) {
      const data = new Date(attemptBy ? attemptBy : getEventRequest.date);

      //NOTE - CHECKING TEACHER SCHEDULE
      const TeacherSchedules = await TeacherSchedule.findOne({
        where: {
          teacherId: getEventRequest.teacherId
            ? getEventRequest.teacherId
            : teacherId,
          date: { [Sequelize.Op.eq]: data },
          availability: 1,
        },
      });
      if (!TeacherSchedules)
        return res
          .status(500)
          .send({ status: 500, message: msg.TEACHER_UNAVAILABLE, data: [] });

      ///NOTE - from time and to time
      let fromTime;
      let toTime;
      if (getEventRequest.type !== "Doubt Class") {
        fromTime = time.split("-")[0];
        toTime = time.split("-")[1];
      }

      //NOTE - booking details of all events
      const BookEventsDetails = await BookEvents.findOne({
        where: {
          teacherId:
            getEventRequest.type === "Doubt Class"
              ? getEventRequest.teacherId
              : teacherId,
          date: { [Sequelize.Op.eq]: data },

          [Sequelize.Op.or]: [
            {
              bookTimeFrom: {
                [Sequelize.Op.lte]: fromTime
                  ? fromTime
                  : getEventRequest.fromTime,
              },
              bookTimeTo: {
                [Sequelize.Op.gt]: fromTime
                  ? fromTime
                  : getEventRequest.fromTime,
              }, //gte if you want to check currect time
            },
            {
              bookTimeFrom: { [Sequelize.Op.lte]: toTime },
              bookTimeTo: { [Sequelize.Op.gte]: toTime },
            },
            {
              bookTimeFrom: {
                [Sequelize.Op.gte]: fromTime
                  ? fromTime
                  : getEventRequest.fromTime,
              },
              bookTimeTo: { [Sequelize.Op.lte]: toTime },
            },
          ],
        },
      });
      if (BookEventsDetails)
        return res
          .status(500)
          .send({ status: 500, message: msg.TEACHER_ALREADY_BOOKED });

      //NOTE - teacher zoom map
      let zoomKeys;
      //NOTE - teacher zoom map
      zoomKeys = await zoomTeacherMap.findOne({
        where: { teacherId: teacherId },
      });
      //NOTE - if not find it automatically take teacher id 1 all details
      if (!zoomKeys) {
        zoomKeys = await zoomTeacherMap.findOne({
          where: { teacherId: 1 },
        });
      }

      //NOTE - when zoom credential is not avaliable
      if (zoomKeys === null) {
        return res.status(400).send({
          status: 400,
          message: msg.ADD_ZOOM_CREDENTIAL,
        });
      }

      //NOTE - generate token for zoom
      const token = await generateZoomToken(
        zoomKeys.auth_api_key,
        zoomKeys.auth_api_secret
      );
      if (!token) {
        return res.status(400).send({
          status: 400,
          message: msg.INVALID_CREDENTIAL,
        });
      }

      //NOTE - create meeting ID and password
      const generateMeeting = await createZoomMeeting(token);
      if (generateMeeting === false) {
        return res.status(400).send({
          status: 400,
          message: msg.SOMETHING_WRONG,
        });
      }

      //NOTE - getting student batchType
      const user_details = await UserDetails.findOne({
        where: { id: getEventRequest.studentId, type: "Student" },
      });
      if (!user_details)
        return res
          .status(400)
          .send({ status: 400, message: msg.USER_NOT_FOUND });

      //NOTE - Get user Details from student table
      const student_details = await StudentDetails.findOne({
        where: { id: user_details.typeId },
      });

      //NOTE - create attempt by started date
      const endDateTime = new Date(
        new Date(
          getEventRequest.type === "Doubt Class"
            ? getEventRequest.date
            : attemptBy
        ).getTime() +
        TeacherSchedules.duration * 60000
      ).toISOString(); // add 15 minutes in milliseconds

      //NOTE - total time like 00:45:00 duration
      const times = formatTime(TeacherSchedules.duration);

      //NOTE - add time in attemptBy
      const attempt = await addTimeIntoDate(data);

      //NOTE: create actual event
      const newEvent = await Event.create({
        batchTypeId: student_details.batchTypeId,
        subjectId: getEventRequest.subjectId ? getEventRequest.subjectId : null,
        chapterId: getEventRequest.chapterId ? getEventRequest.chapterId : null,
        zoomApiKey: config.ZOOM_API_KEY,
        zoomApiSecret: config.ZOOM_API_SECRET,
        meetingNumber: generateMeeting.id,
        password: generateMeeting.password,
        teacherId:
          getEventRequest.type === "Doubt Class"
            ? getEventRequest.teacherId
            : teacherId,
        type: getEventRequest.type,
        attemptBy:
          getEventRequest.type === "Doubt Class"
            ? getEventRequest.date
            : attempt,
        endDate: endDateTime,
        time: times ? times : null,
        createdById: userId,
      });

      //NOTE: event created for student
      const studentEvent = new StudentEventMap({
        eventId: newEvent.id,
        studentId: getEventRequest.studentId,
      });
      await studentEvent.save();

      //NOTE -  final booking for student with teacher
      await BookEvents.create({
        eventId: newEvent.id,
        studentId: getEventRequest.studentId,
        teacherId:
          getEventRequest.type === "Doubt Class"
            ? getEventRequest.teacherId
            : teacherId,
        date:
          getEventRequest.type === "Doubt Class" ? getEventRequest.date : data,
        bookTimeFrom:
          getEventRequest.type === "Doubt Class"
            ? getEventRequest.fromTime
            : fromTime,
        bookTimeTo:
          getEventRequest.type === "Doubt Class"
            ? getEventRequest.toTime
            : toTime,
        type: getEventRequest.type,
      });

      //NOTE - update mentorship session
      if (getEventRequest.type === "Mentorship") {
        const getStudentSubscriptionMap = await studentSubscriptionMap.findOne({
          where: { studentId: getEventRequest.studentId },
        });

        if (getStudentSubscriptionMap) {
          const updatedData = await studentSubscriptionMap.update(
            {
              sessionUsed: getStudentSubscriptionMap.sessionUsed + 1,
              sessionAvailable: getStudentSubscriptionMap.sessionAvailable - 1,
            },
            {
              where: {
                studentId: getEventRequest.studentId,
                id: getStudentSubscriptionMap.id,
              },
            }
          );
        }

        //NOTE - get user details and post activity
        const userDetail = await userDetails(userId);

        //NOTE - retrive Lead
        let retriveData;
        retriveData = await retriveLeads(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          userDetail.phone
        );

        if (retriveData.length < 1) {
          //NOTE - lead capture
          await captureLead(
            config.LEADSQUARD_API_KEY,
            config.LEADSQUARD_CLIENT_SECRET,
            config.LEADSQUARD_HOST,
            userDetail.name,
            userDetail.student.course.name,
            userDetail.student.board.name,
            userDetail.student.class.name,
            userDetail.phone
          );
        }

        // //NOTE - if lead capture for user
        if (retriveData.length < 1) {
          retriveData = await retriveLeads(
            config.LEADSQUARD_API_KEY,
            config.LEADSQUARD_CLIENT_SECRET,
            config.LEADSQUARD_HOST,
            userDetail.phone
          );
        }
        //NOTE - create activity for user
        await createActivity(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          retriveData[0].ProspectID,
          userId,
          teacherId,
          userDetail.student.course.name,
          userDetail.student.board.name,
          userDetail.student.class.name
        );
      }

      //NOTE - update event request status
      await eventDemoMap.update(
        { status: status, teacherId: teacherId },
        {
          where: { id: requestId },
        }
      );

      //NOTE - FINAL event
      return res.status(200).send({
        status: 200,
        message: msg.EVENT_CREATED,
      });
    }
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

// Set the Zoom meeting ID
const meetingId = "94256721880";

// //NOTE - event recorded session video
const getRecordings = async (req, res) => {
  // Generate JWT token
  const token = await recordSessionToken(
    config.ZOOM_API_KEY,
    config.ZOOM_API_SECRET
  );

  // Make API request to retrieve recording information
  const url = `https://api.zoom.us/v2/meetings/${meetingId}/recordings`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.send(response.data);
};

//NOTE - cron for get all recorded live session
exports.handler = async (event, context, callback) => {
  try {
    // Generate JWT token
    const token = await recordSessionToken(zoomApiKey, zoomApiSecret);

    //NOTE - current date
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60 * 1000; // convert to milliseconds
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0 - timezoneOffset
    );
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999 - timezoneOffset
    );

    //NOTE - today event
    const getEvent = await Event.findAll({
      attributes: ["meetingNumber", "batchTypeId", "subjectId", "teacherId"],
      where: {
        attemptBy: {
          [Op.between]: [startDate.toISOString(), endDate.toISOString()],
        },
        type: {
          [Op.not]: "Demo Class",
        },
      },
    });

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    for (let events of getEvent) {
      // Make API request to retrieve recording information
      try {
        const response = await axios.get(
          `https://api.zoom.us/v2/meetings/${events.meetingNumber}/recordings`,
          { headers }
        );
        if (response.status === 200 && response.data.code !== 3301) {
          // Get the play URL of the latest recording
          const latestRecording = response.data.recording_files[0];
          const playUrl = latestRecording.download_url;

          // Set the S3 key (file name) to use for the uploaded recording
          const s3Key = `zoom-recordings/${latestRecording.id}.${"mp4"}`;

          // Download the recording file
          const recordingResponse = await axios.get(playUrl, {
            responseType: "stream",
            headers: {
              Authorization: `Bearer ${token}`,
              "Recording-Password": response.password,
            },
          });

          // Create a new S3 upload stream
          const upload = s3Stream.upload({
            Bucket: bucketName,
            Key: s3Key,
            ContentType: "video/mp4", // Set the content type to video/mp4
          });

          // Add an error event listener to the upload stream
          upload.on("error", (error) => {
            console.log(`Error uploading file to S3: ${error}`);
          });

          upload.on("httpUploadProgress", (progress) => {
            console.log(
              `Uploaded ${progress.loaded} bytes of ${progress.total} bytes`
            );

            if (progress.total) {
              const percent = (
                (progress.loaded / progress.total) *
                100
              ).toFixed(2);
              console.log(`Upload progress: ${percent}%`);
            }
          });

          //const fileSize = latestRecording.file_size;
          const partSize = 1024 * 1024 * 10; // 10 MB part size
          const fileSize = latestRecording.file_size;
          const numParts = Math.ceil(fileSize / partSize);

          upload.on("part", (details) => {
            console.log(
              `Uploaded part ${details.PartNumber} of ${numParts} (${details.uploadedSize} bytes uploaded)`
            );
          });

          // Add a uploaded event listener to the upload stream
          upload.on("uploaded", async (details) => {
            console.log(
              `File uploaded successfully. ETag: ${details.ETag} +s3${s3Key}`
            );
            //NOTE - get all id from get batch type
            const getBatchType = await batchType.findOne({
              where: {
                id: events.batchTypeId,
              },
            });
            //NOTE - save recorded live session into db
            await Content.create({
              courseId: getBatchType.courseId,
              boardId: getBatchType.boardId,
              classId: getBatchType.classId,
              batchTypeId: getBatchType.id,
              subjectId: events.subjectId,
              resourceType: null,
              tag: "Recorded Live Session",
              source: "upload",
              sourceFile: s3Key,
              createdById: events.teacherId,
            });
          });

          // Pipe the recording file stream to the S3 upload stream
          recordingResponse.data.pipe(upload);
        } else {
          console.log("meeting not found");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("Meeting ID not found");
        } else {
          console.log("error");
        }
      }
    }
    //NOTE - cron job event
    await timeCronMap.create({
      reason: msg.RECORDED_LIVE_EVENT_CRON,
    });
  } catch (error) {
    console.log("Error uploading file to S3:", error);
  }
};

// create the cron job
cron.schedule("0 23 * * *", () => {
  console.log("zoom video uploading in process...");
  exports.handler();
});

//NOTE - event participant report
const eventParticipantReport = async (req, res) => {
  try {
    //NOTE - current date
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60 * 1000; // convert to milliseconds
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0 - timezoneOffset
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999 - timezoneOffset
    );

    //NOTE - today event
    const getEvent = await Event.findAll({
      where: {
        attemptBy: {
          [Op.between]: [startOfDay.toISOString(), endOfDay.toISOString()],
        },
      },
    });

    // Generate JWT token
    const token = await recordSessionToken(
      config.ZOOM_API_KEY,
      config.ZOOM_API_SECRET
    );

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    for (let events of getEvent) {
      try {
        const response = await axios.get(
          `https://api.zoom.us/v2/report/meetings/${events.meetingNumber}/participants`,
          { headers }
        );
        if (response.status === 200) {
          // Meeting exists, do something

          const participantReport = response.data;

          // console.log(participantReport);
          let final = [];
          for (let data of participantReport.participants) {
            //NOTE - get unique id of user and staff
            const nameParts = data.name.split("(");
            const vedaId = nameParts[1].replace(")", "");

            if (vedaId.includes("VEDA")) {
              const user_details = await UserDetails.findOne({
                where: { vedaId: vedaId },
              });

              if (user_details && user_details !== null) {
                //NOTE - mark attandence
                const findData = await studentAttendance.findOne({
                  where: {
                    studentId: user_details.id,
                    createdAt: {
                      [Op.between]: [
                        startOfDay.toISOString(),
                        endOfDay.toISOString(),
                      ],
                    },
                  },
                });
                //NOTE - mark attandance new student
                if (!findData && findData === null) {
                  console.log("student");
                  await studentAttendance.create({
                    studentId: user_details.id,
                    status: "Automatic",
                    eventId: events.id,
                    createdById: events.teacherId,
                  });
                }
              }
            } else if (vedaId.includes("VSTAFF")) {
              const adminUser = await Admin.findOne({
                where: { vedaId: vedaId },
              });
              if (adminUser && adminUser !== null) {
                const findData = await teacherAttendance.findOne({
                  where: {
                    teacherId: adminUser.id,
                    createdAt: {
                      [Op.between]: [
                        startOfDay.toISOString(),
                        endOfDay.toISOString(),
                      ],
                    },
                  },
                });

                //NOTE - mark attandance new student
                if (!findData && findData === null) {
                  console.log("tacher");
                  await teacherAttendance.create({
                    teacherId: adminUser.id,
                    status: "Automatic",
                    eventId: events.id,
                    createdById: events.teacherId,
                  });
                }
              }
            } else {
              console.log("Invalid VEDA ID");
              return; // or do some error handling
            }
            //NOTE - mark student attandence
          }
        } else {
          console.log("meeting not found");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Meeting ID not found, return "not found"
          console.log("Meeting ID not found");
        } else {
          console.log("error");
          // Some other error occurred, handle it appropriately
          // res.status(500).send(error.message);
        }
      }
    }
    console.log("markattandance success");
    await timeCronMap.create({
      reason: msg.STUDENT_ATTANDENCE_MARKED_CRON,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
cron.schedule("0 23 * * *", () => {
  console.log("cron running for student attendance");
  eventParticipantReport();
});

//NOTE - event participant report
// const eventParticipantReport = async (req, res) => {
//   try {

//     //NOTE - current date
//     // const now = new Date();
//     // const timezoneOffset = now.getTimezoneOffset() * 60 * 1000; // convert to milliseconds
//     // const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0 - timezoneOffset);
//     // const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999 - timezoneOffset);

//     // //NOTE - today event
//     // const getEvent = await Event.findAll({
//     //   where: {
//     //     attemptBy: {
//     //       [Op.between]: [startOfDay.toISOString(), endOfDay.toISOString()],
//     //     },
//     //   },
//     // })

//     // Generate JWT token
//     const token = await recordSessionToken(config.ZOOM_API_KEY, config.ZOOM_API_SECRET)

//     const headers = {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     };
//     const response = await axios.get(`https://api.zoom.us/v2/report/meetings/92556896110/participants`, { headers });
//     const participantReport = response.data;
//     //NOTE - return final
//     return res.status(200).send({
//       status: 200,
//       message: msg.FOUND_DATA,
//       count: participantReport.total_records,
//       data: participantReport.participants,
//     });
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

//NOTE - event participant report
const EventAttendReport = async (req, res) => {
  try {
    //NOTE - current date
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60 * 1000; // convert to milliseconds
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0 - timezoneOffset
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999 - timezoneOffset
    );

    //NOTE - today event
    const getEvent = await Event.findAll({
      where: {
        attemptBy: {
          [Op.between]: [startOfDay.toISOString(), endOfDay.toISOString()],
        },
      },
      attributes: ["id", "teacherId", "meetingNumber", "attemptBy"],
    });
    // Generate JWT token
    const token = await recordSessionToken(
      config.ZOOM_API_KEY,
      config.ZOOM_API_SECRET
    );
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    for (let events of getEvent) {
      try {
        const response = await axios.get(
          `https://api.zoom.us/v2/report/meetings/${events.meetingNumber}/participants`,
          { headers }
        );
        if (response.status === 200) {
          // Meeting exists, do something
          const participantReport = response.data;
          let final = [];
          for (let data of participantReport.participants) {
            //NOTE - get unique id of user and staff
            const nameParts = data.name.split("(");
            const vedaId = nameParts[1].replace(")", "");

            if (vedaId.includes("VEDA")) {
              //NOTE - Get user details from user table
              const user_details = await UserDetails.findOne({
                where: { vedaId: vedaId, type: "Student" },
                attributes: ["id"],
              });
              const eventAttendDetail = await eventAttendMap.findOne({
                where: {
                  studentId: user_details.id,
                  eventId: events.id,
                  date: events.attemptBy,
                  // date: events.attemptBy
                },
                attributes: ["id"],
              });
              if (eventAttendDetail) {
                await eventAttendMap.update(
                  {
                    studentId: user_details.id,
                    eventId: events.id,
                    date: events.attemptBy,
                  },
                  { where: { id: eventAttendDetail.id } }
                );
              } else {
                await eventAttendMap.create({
                  studentId: user_details.id,
                  eventId: events.id,
                  date: events.attemptBy,
                });
              }
            } else {
              const AdminDetails = await Admin.findOne({
                where: { vedaId: vedaId },
                attributes: ["id"],
              });

              const eventAttendDetail = await eventAttendMap.findOne({
                where: {
                  teacherId: AdminDetails.id,
                  eventId: events.id,
                  date: {
                    [Op.eq]: events.attemptBy,
                  },
                  // date: events.attemptBy
                },
                attributes: ["id"],
              });
              if (eventAttendDetail) {
                await eventAttendMap.update(
                  {
                    teacherId: AdminDetails.id,
                    eventId: events.id,
                    date: {
                      [Op.eq]: events.attemptBy,
                    },
                  },
                  { where: { id: eventAttendDetail.id } }
                );
              } else {
                await eventAttendMap.create({
                  teacherId: AdminDetails.id,
                  eventId: events.id,
                  date: events.attemptBy,
                });
              }
            }
          }
        } else {
          console.log("meeting not found");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("Meeting ID not found");
        } else {
          console.log("error");
        }
      }
    }
    console.log("event attend entry completed");
    await timeCronMap.create({
      reason: msg.EVENT_ATTEND_RECORD_CRON,
    });
  } catch (err) {
    console.log(err);
  }
};
//NOTE - student event attend cron jon
cron.schedule("0 23 * * *", () => {
  console.log("cron running for event attend entry");
  EventAttendReport();
});

cron.schedule("45 22 * * *", async (req, res) => {
  try {
    //NOTE - get all user
    const users = await User.findAll({
      attributes: ["id"],
    });
    for (let user of users) {
      //NOTE - user all event
      const studentEvent = await StudentEventMap.count({
        where: { studentId: user.id },
      });
      //NOTE - user all attend event
      const studentAttend = await eventAttendMap.count({
        where: { studentId: user.id },
      });
      const percentage = Math.floor((studentAttend * 100) / studentEvent);
      //NOTE - update user percentage
      await User.update(
        {
          liveEventPercentage: percentage,
        },
        { where: { id: user.id } }
      );
    }
    //NOTE - CREATE STATUS FOR CRON
    await timeCronMap.create({
      reason: msg.STUDENT_EVENT_PERCENTAGE_CRON,
    });
  } catch (error) {
    console.log("errr");
  }
});

//NOTE - live class report
const liveClassReport = async (req, res) => {
  try {
    //NOTE - current date
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60 * 1000; // convert to milliseconds
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0 - timezoneOffset
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999 - timezoneOffset
    );

    //NOTE - today event
    const getEvent = await Event.findAll({
      where: {
        attemptBy: {
          [Op.between]: [startOfDay.toISOString(), endOfDay.toISOString()],
        },
      },
      attributes: [
        "id",
        "teacherId",
        "meetingNumber",
        "attemptBy",
        "type",
        "batchTypeId",
        "subjectId",
      ],
    });
    // Generate JWT token
    const token = recordSessionToken(
      config.ZOOM_API_KEY,
      config.ZOOM_API_SECRET
    );
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    for (let events of getEvent) {
      try {
        const response = await axios.get(
          `https://api.zoom.us/v2/report/meetings/${events.meetingNumber}/participants`,
          { headers }
        );
        if (response.status === 200) {
          // Meeting exists, do something
          const participantReport = response.data;
          for (let data of participantReport.participants) {
            //NOTE - get unique id of user and staff
            const nameParts = data.name.split("(");
            const vedaId = nameParts[1].replace(")", "");

            //NOTE - if student include
            if (vedaId.includes("VEDA")) {
              //NOTE - Get user details from user table
              const user_details = await UserDetails.findOne({
                where: { vedaId: vedaId, type: "Student" },
                attributes: ["id"],
                include: {
                  model: StudentDetails,
                  attributes: ["courseId", "boardId", "classId", "batchTypeId"],
                },
              });
              //NOTE - find report of user
              const Report = await liveclassReport.findOne({
                where: { studentId: user_details.id, eventId: events.id },
                attributes: ["id"],
              });

              //NOTE - if report not found then it create new
              if (!Report) {
                //NOTE - get all record of live session attend
                await liveclassReport.create({
                  eventId: events.id,
                  studentId: user_details.id,
                  date: events.attemptBy,
                  courseId: user_details.student.courseId,
                  boardId: user_details.student.boardId,
                  classId: user_details.student.classId,
                  batchTypeId: events.batchTypeId ? events.batchTypeId : null,
                  subjectId: events.subjectId ? events.subjectId : null,
                  type: events.type,
                });
                //NOTE - post activity for live class
                if (events.type === "Live Class") {
                  //NOTE - get user details and post activity
                  const userDetail = await userDetails(user_details.id);

                  //NOTE - retrive Lead
                  let retriveData;
                  retriveData = await retriveLeads(
                    config.LEADSQUARD_API_KEY,
                    config.LEADSQUARD_CLIENT_SECRET,
                    config.LEADSQUARD_HOST,
                    userDetail.phone
                  );

                  if (retriveData.length < 1) {
                    //NOTE - lead capture
                    await captureLead(
                      config.LEADSQUARD_API_KEY,
                      config.LEADSQUARD_CLIENT_SECRET,
                      config.LEADSQUARD_HOST,
                      userDetail.name,
                      userDetail.student.course.name,
                      userDetail.student.board.name,
                      userDetail.student.class.name,
                      userDetail.phone
                    );
                  }
                  //NOTE - if lead capture for user
                  if (retriveData.length < 1) {
                    retriveData = await retriveLeads(
                      config.LEADSQUARD_API_KEY,
                      config.LEADSQUARD_CLIENT_SECRET,
                      config.LEADSQUARD_HOST,
                      userDetail.phone
                    );
                  }
                  //NOTE - create activity for user
                  await createActivityLiveClass(
                    config.LEADSQUARD_API_KEY,
                    config.LEADSQUARD_CLIENT_SECRET,
                    config.LEADSQUARD_HOST,
                    retriveData[0].ProspectID,
                    user_details.id,
                    userDetail.name,
                    events.teacherId,
                    events.attemptBy,
                    userDetail.student.course.name,
                    userDetail.student.board.name,
                    userDetail.student.class.name
                  );
                }
                //NOTE - if type mentorship post activity of mentorship attended
                if (events.type === "Mentorship") {
                  //NOTE - get user details and post activity
                  const userDetail = await userDetails(user_details.id);
                  //NOTE - retrive Lead
                  let retriveData;
                  retriveData = await retriveLeads(
                    config.LEADSQUARD_API_KEY,
                    config.LEADSQUARD_CLIENT_SECRET,
                    config.LEADSQUARD_HOST,
                    userDetail.phone
                  );

                  if (retriveData.length < 1) {
                    //NOTE - lead capture
                    await captureLead(
                      config.LEADSQUARD_API_KEY,
                      config.LEADSQUARD_CLIENT_SECRET,
                      config.LEADSQUARD_HOST,
                      userDetail.name,
                      userDetail.student.course.name,
                      userDetail.student.board.name,
                      userDetail.student.class.name,
                      userDetail.phone
                    );
                  }
                  //NOTE - if lead capture for user
                  if (retriveData.length < 1) {
                    retriveData = await retriveLeads(
                      config.LEADSQUARD_API_KEY,
                      config.LEADSQUARD_CLIENT_SECRET,
                      config.LEADSQUARD_HOST,
                      userDetail.phone
                    );
                  }
                  //NOTE - create activity for user
                  await createActivityMentorship(
                    config.LEADSQUARD_API_KEY,
                    config.LEADSQUARD_CLIENT_SECRET,
                    config.LEADSQUARD_HOST,
                    retriveData[0].ProspectID,
                    userDetail.id,
                    events.teacherId,
                    userDetail.student.course.name,
                    userDetail.student.board.name,
                    userDetail.student.class.name
                  );
                }
              }
            }
            //NOTE - get all event report of staffs
            if (vedaId.includes("VSTAFF")) {
              const AdminDetails = await Admin.findOne({
                where: { vedaId: vedaId },
                attributes: ["id"],
              });
              //NOTE - find report of user
              const Report = await liveclassTeacherReport.findOne({
                where: { teacherId: AdminDetails.id, eventId: events.id },
                attributes: ["id"],
              });

              //NOTE - if report not found then it create new
              if (!Report) {
                //NOTE - live event record of staff
                await liveclassTeacherReport.create({
                  eventId: events.id,
                  date: events.attemptBy,
                  batchTypeId: events.batchTypeId ? events.batchTypeId : null,
                  subjectId: events.subjectId ? events.subjectId : null,
                  teacherId: AdminDetails.id,
                  type: events.type,
                });
              }
            }
          }
        } else {
          console.log("meeting not found");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("Meeting ID not found");
        } else {
          console.log("error");
        }
      }
    }
    console.log(" live class report completed");
    await timeCronMap.create({
      reason: msg.LIVE_CLASS_RECORD_CRON,
    });
  } catch (err) {
    console.log(err);
  }
};
//NOTE - student event attend cron jon
cron.schedule("10 23 * * *", () => {
  console.log("cron running for live class report");
  liveClassReport();
});

//ANCHOR - CRON FOR student plane expiry date
cron.schedule("40 23 * * *", async () => {
  try {
    const currentDate = new Date();
    let oneMonthLater = new Date(currentDate);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    if (currentDate.getDate() !== oneMonthLater.getDate()) {
      oneMonthLater.setDate(0);
    }
    oneMonthLater.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00.000

    const expiryDate = await studentPlanMap.findAll({
      where: literal(
        `DATE(validityDate) = '${oneMonthLater.toISOString().slice(0, 10)}'`
      ),
    });

    for (let Id of expiryDate) {
      //NOTE - get user details and post activity
      const userDetail = await userDetails(Id.userId);

      //NOTE - retrive Lead
      let retriveData;
      retriveData = await retriveLeads(
        config.LEADSQUARD_API_KEY,
        config.LEADSQUARD_CLIENT_SECRET,
        config.LEADSQUARD_HOST,
        userDetail.phone
      );
      if (retriveData.length < 1) {
        //NOTE - lead capture
        await captureLead(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          userDetail.name,
          userDetail.student.course.name,
          userDetail.student.board.name,
          userDetail.student.class.name,
          userDetail.phone
        );
      }
      // //NOTE - if lead capture for user
      if (retriveData.length < 1) {
        retriveData = await retriveLeads(
          config.LEADSQUARD_API_KEY,
          config.LEADSQUARD_CLIENT_SECRET,
          config.LEADSQUARD_HOST,
          userDetail.phone
        );
      }
      //NOTE - create activity for user
      await createActivityForExpiryDate(
        config.LEADSQUARD_API_KEY,
        config.LEADSQUARD_CLIENT_SECRET,
        config.LEADSQUARD_HOST,
        retriveData[0].ProspectID,
        userDetail.name,
        userDetail.student.course.name,
        userDetail.student.board.name,
        userDetail.student.class.name,
        Id.validityDate
      );
    }
    console.log("job completed");
  } catch (error) {
    console.log(error);
  }
});


//ANCHOR - CRON FOR student plane expiry date
cron.schedule("40 23 * * *", async () => {
  try {
    //NOTE - current date
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60 * 1000; // convert to milliseconds
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0 - timezoneOffset
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999 - timezoneOffset
    );

    //NOTE - today event
    const getEvent = await Event.findAll({
      where: {
        attemptBy: {
          [Op.between]: [startOfDay.toISOString(), endOfDay.toISOString()],
        },
        type: "Live Class",
      },
      attributes: [
        "id",
        "teacherId",
        "meetingNumber",
        "attemptBy",
        "type",
        "batchTypeId",
        "subjectId",
      ],
    });

    for (let event of getEvent) {
      const studentEvents = await student_event_map.findAll({
        where: { eventId: event.id },
        include: {
          model: Event,
          attribute: ["teacherId", "attemptBy"],
        },
      });

      for (let unattempt of studentEvents) {
        //console.log("unattempt",unattempt.studentId);
        const students = await liveclassReport.findOne({
          where: {
            studentId: unattempt.studentId,
            eventId: unattempt.eventId,
          },
        });

        if (students === null) {
          //NOTE - get user details and post activity
          const userDetail = await userDetails(unattempt.studentId);
          //NOTE - retrive Lead
          let retriveData;
          retriveData = await retriveLeads(
            config.LEADSQUARD_API_KEY,
            config.LEADSQUARD_CLIENT_SECRET,
            config.LEADSQUARD_HOST,
            userDetail.phone
          );
          if (retriveData.length < 1) {
            //NOTE - lead capture
            await captureLead(
              config.LEADSQUARD_API_KEY,
              config.LEADSQUARD_CLIENT_SECRET,
              config.LEADSQUARD_HOST,
              userDetail.name,
              userDetail.student.course.name,
              userDetail.student.board.name,
              userDetail.student.class.name,
              userDetail.phone
            );
          }
          // //NOTE - if lead capture for user
          if (retriveData.length < 1) {
            retriveData = await retriveLeads(
              config.LEADSQUARD_API_KEY,
              config.LEADSQUARD_CLIENT_SECRET,
              config.LEADSQUARD_HOST,
              userDetail.phone
            );
          }

          //NOTE - create activity for user
          await createActivityForMissedLiveclass(
            config.LEADSQUARD_API_KEY,
            config.LEADSQUARD_CLIENT_SECRET,
            config.LEADSQUARD_HOST,
            retriveData[0].ProspectID,
            unattempt.studentId,
            userDetail.name,
            unattempt?.event.teacherId,
            unattempt?.event.attemptBy,
            userDetail.student.course.name,
            userDetail.student.board.name,
            userDetail.student.class.name
          );
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

//ANCHOR - joinEvent
const joinEvent = async (req, res) => {
  try {
    const { eventId } = req.body

    const userId = req.user.id;

    //NOTE - add student in first join
    await StudentEventMap.update({ joinStatus: 1 }, {
      where: { eventId: eventId, studentId: userId },
    });

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.JOINED_EVENT,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};


//ANCHOR - exitEvent
const exitEvent = async (req, res) => {
  try {
    const { studentId, eventId, exitTime } = req.body

    //NOTE - find user
    const exituser = await studentEventTrack.findOne({
      where: { eventId: eventId, studentId: studentId },
    });

    if (!exituser) {
      //NOTE - add student in first join
      await studentEventTrack.create({
        eventId: eventId, studentId: studentId, exitTime: exitTime
      });
    }

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.EXIT_EVENT,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

// //NOTE - send notification before 25 minutes live class started
// cron.schedule("* * * * *", async () => {
//   console.log("batch start alert");

//   //NOTE - Get the current datetime
//   const now = moment().toDate();
//   //NOTE - Add 5 hours and 30 minutes to the datetime 25 minutes from now
//   const newDateTime = moment(now).add(5, 'hours').add(30, 'minutes').toDate();
//   //NOTE - Add 20 minutes from now
//   // twentyMinutes =  moment(newDateTime).add(24, 'minutes').toDate();
//   //NOTE - Get the datetime 25 minutes from now
//   const twentyFiveMinutesFromNow = moment(newDateTime).add(25, 'minutes').toDate();

//   console.log(twentyMinutes, twentyFiveMinutesFromNow);

//   //NOTE - new event
//   const events = await Event.findAll({
//     where: {
//       attemptBy: {
//         [Op.between]: [newDateTime, twentyFiveMinutesFromNow]
//       }
//     }
//   });

//   console.log("events", events);
// });



//ANCHOR - get all Event BY STUDENT id
const getEventByStatus = async (req, res) => {
  try {
    let getAllEvents = [];
    const { status } = req.query;

    //NOTE - getting id from decode token
    const userId = req.user.id;

    //NOTE - Get user details from user table
    const user_details = await User.findOne({
      where: { id: userId, type: "Student" },
    });
    if (!user_details)
      return res
        .status(400)
        .send({ status: 400, message: msg.USER_NOT_FOUND });

    //NOTE - Get the current datetime
    const now = moment().toDate();
    const currentDate = moment(now).add(5, 'hours').add(30, 'minutes').toDate();

    //NOTE - filter based on status
    let dates;
    let joinSts;
    if (status === "pending") {
      dates = {
        attemptBy: {
          [Op.gt]: currentDate,
        }
      }
      joinSts = 0;
    }
    else if (status === "completed") {
      dates = {
        attemptBy: {
          [Op.lt]: currentDate,
        }
      }
      joinSts = 1;
    }
    else if (status === "missed") {
      dates = {
        attemptBy: {
          [Op.lt]: currentDate,
        }
      }
      joinSts = 0;
    }


    //NOTE - get all event of user
    const getEvent = await StudentEventMap.findAndCountAll({
      where: {
        studentId: userId,
        joinStatus: joinSts
      },
      include: [
        {
          model: Event,
          where: {
            ...dates
          },
          include: [
            {
              model: Subject,
              attributes: ["id", "name"],
            },
            {
              model: Chapter,
              attributes: ["id", "name"],
            },
            {
              model: Admin,
              attributes: ["name", "email"],
            },
          ]
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    //NOTE - taking data from event map
    for (let data of getEvent.rows) {
      if (data !== null) {
        //NOTE - Get user details from user table
        const user_details = await User.findOne({
          where: { id: userId, type: "Student" },
        });
        if (!user_details)
          return res
            .status(400)
            .send({ status: 400, message: msg.USER_NOT_FOUND });

        //NOTE - Get user Details from student table
        const student_details = await Student.findOne({
          where: { id: user_details.typeId },
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
          ],
          order: [["createdAt", "DESC"]],
        });

        //NOTE - final push event
        getAllEvents.push({
          id: data.eventId,
          title:
            data.type === "Demo Class" || data.type === "Mentorship"
              ? `${student_details?.class?.name} ${student_details?.board?.name} - ${data.type}`
              : `${student_details?.class?.name} ${student_details?.board?.name
              }- ${data?.event?.chapter?.name
                ? data?.event?.chapter?.name
                : data?.event?.subject?.name
              }`,
          class: student_details?.class?.name,
          type: data?.event?.type,
          startedBy: (data?.event?.attemptBy).toISOString().split(".")[0], //TODO - split after .00Z
          time: data?.event?.time,
          teacherId: data?.event?.teacherId,
          teacherName: data?.event?.adminUser?.name,
          password: data?.event?.password || null,
          originalUrl: data?.event?.url || null,
          convertUrl: data?.event?.category === "Youtube" ? await getYouTubeVideoId(data?.event?.url) : null,
          category: data?.event?.category,
          thumbnail: data?.event?.thumbnail ? await getSignedUrlCloudFront(data?.event?.thumbnail) : null,
          description: data?.event?.title,
        });
      }
    }

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getAllEvents,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};


//ANCHOR - youtube chat
const sendMessage = async (req, res) => {
  try {
    const { eventId, role, message } = req.body;

    //NOTE - getting id from decode token
    const userId = req.user.id;

    //NOTE - Get the current datetime
    const now = moment().toDate();
    const currentDate = moment(now).add(5, 'hours').add(30, 'minutes').toDate();

    //NOTE - save user response of event chat
    eventChatMap.create({
      userId: userId, eventId: eventId, role: role, message: message, dateTime: currentDate
    })

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.MESSAGE_SENDED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};



//ANCHOR - youtube chats
const getyoutubeChats = async (req, res) => {
  try {
    let getAllChats = [];
    const { eventId } = req.body;

    //NOTE - get all chats
    const chats = await eventChatMap.findAndCountAll({
      where: {
        eventId: eventId,
      },
      include: [
        {
          model: User,
          attributes: ["name", "phone"],
          include: [{
            model: StudentDetails,
            attributes: ["avatar"],
          }]
        },
        {
          model: Admin,
          attributes: ["name", "phone"],
        }
      ],
    })

    //NOTE - get all event chats
    for (let chat of chats.rows) {
      getAllChats.push({
        userName: chat.role === "User" ? chat.user.name : chat.adminUser.name,
        avatar: chat.role === "User" && chat?.user?.student?.avatar ? await getSignedUrlCloudFront(chat.user.student.avatar) : null,
        message: chat.message,
        dateTime: chat.dateTime,
        role: chat.role
      })
    }

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.MESSAGE_SENDED,
      data: getAllChats
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};


//ANCHOR - get all Event BY STUDENT id
const getFreeEventByStudentId = async (req, res) => {
  try {
    let getAllEvents = [];
    const { status, batchTypeId } = req.query;

    //NOTE - getting id from decode token
    const userId = req.user.id;

    //NOTE - user check
    const user_details = await User.findOne({
      where: { id: userId, type: "Student" },
    });
    if (!user_details)
      return res
        .status(400)
        .send({ status: 400, message: msg.USER_NOT_FOUND });


    //NOTE - status based filter
    let dates;
    if (["ongoing", "upcoming", "past", "all"].includes(status)) {
      dates = dateStatus(status);
    }

    //NOTE - get all event of user
    const events = await Event.findAll({
      where: {
        ...dates,
        batchTypeId: batchTypeId,
        type: "Free_Live_Class"
      },
      include: [
        {
          model: Admin,
          attributes: ["name", "email"],
        },
        {
          model: batchType,
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    //NOTE - taking data from event map
    for (let data of events) {
      if (data !== null) {
        //NOTE - final push event
        getAllEvents.push({
          id: data.id,
          title: data.title,
          type: data?.event?.type,
          startedBy: (data?.attemptBy).toISOString().split(".")[0], //TODO - split after .00Z
          original_title: data.title,
          teacherId: data?.teacherId,
          teacherName: data?.adminUser?.name,
          originalUrl: data?.url || null,
          convertUrl: data?.category === "Youtube" ? await getYouTubeVideoId(data?.url) : null,
          category: data?.category,
          thumbnail: data?.thumbnail ? await getSignedUrlCloudFront(data?.thumbnail) : null,
          status: status === "past" ? "#FF0000" : status === "ongoing" ? "#00FF00" : "#FFFF00",
          batchName: data.batchType.name
        });
      }
    }

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getAllEvents,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE -  event by event id
const getEventByEventId = async (req, res) => {
  try {
    //NOTE - user id from token
    const userId = req.user.id;

    //NOTE  - find event details
    const event = await Event.findOne({
      where: { id: req.params.id },
      include: [
        { model: Admin, attributes: ["id", "name"] }
      ]
    });
    if (!event) {
      return res.status(404).send({ status: 404, message: msg.NOT_FOUND });
    }


    //NOTE - check user purchased package or not
    const checking = await studentCoursePackage.findOne({
      where: {
        userId: userId,
        batchTypeId: event.batchTypeId,
      },
    });
    if (!checking) {
      return res.status(404).send({ status: 404, message: msg.NOT_FOUND, access: false });
    }

    //NOTE  - convert thumbnail into cloudfront
    let thumbnailUrl = null;
    if (event?.thumbnail) {
      thumbnailUrl = await getSignedUrlCloudFront(event.thumbnail);
    }

    //NOTE - Get user Details from student table
    const batchDetails = await bathDetails(event.batchTypeId);

    const allEvent = {
      title: event.title,
      type: event.type,
      startedBy: event.attemptBy,
      time: event.time,
      teacherId: event.teacherId,
      teacherName: event?.adminUser?.name,
      class: batchDetails?.class?.name,
      originalUrl: event.url,
      category: event.category,
      thumbnail: thumbnailUrl,
      convertUrl: event.category === "Youtube" ? await getYouTubeVideoId(event.url) : null,
    };

    return res.status(200).send({ status: 200, message: msg.FOUND_DATA, data: allEvent, access: true });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};


module.exports = {
  createEvent,
  getAllEvent,
  getEventById,
  updateEventById,
  deleteEvent,
  getLiveClassHistory,
  createEventRequest,
  createEventForDemo,
  getAllEventRequested,
  getEventRequestedById,
  statusUpdatedById,
  getAllEventByStudentId,
  createReminderTime,
  getAllReminderTime,
  attendLiveEvent,
  createEventNew,
  eventParticipantReport,
  getRecordings,
  RedisgetAllStudentEvent,
  EventAttendReport,
  liveClassReport,
  joinEvent,
  exitEvent,
  getEventByStatus,
  sendMessage,
  getyoutubeChats,
  getFreeEventByStudentId,
  getEventByEventId
};
