const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize, Op } = require("sequelize");
const { Response } = require("../../helpers/response.helper");
const { converterType } = require("../../helpers/service");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const getSignedUrl = require("../../helpers/getSignedUrl");
const {
  getSignedUrlCloudFront,
  getYouTubeVideoId,
  cloudFrontM3u8Converter,
} = require("../../helpers/cloudFront");
const { replaceDirectoryInPath } = require("./service");
const {
  HelpResourcedefaultImages,
} = require("../../helpers/studentDefaultImages");
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

//ANCHOR : add addSyllabus
const addSyllabus = async (req, res) => {
  try {
    const { title, topicId, video, type, time, videoBy } = req.body;

    const newVideo = new Video({
      title: title,
      topicId: topicId,
      video: video,
      type: type,
      time: time,
      videoBy: videoBy,
    });

    const createdVideo = await newVideo.save();
    return res.status(200).send({
      status: 200,
      message: msg.SYLLABUS_CREATED,
      data: createdVideo,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get syllabus by id
const getSyllabusById = async (req, res) => {
  try {
    const getSyllabus = await Syllabus.findOne({
      where: { id: req.params.id },
    });
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getSyllabus,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//ANCHOR : get syllabus by id
const getSyllabusByTopicId = async (req, res) => {
  try {
    const topicId = req.params.id;
    const topicDetails = await Topic.findOne({
      where: { id: topicId },
    });

    if (!topicDetails) {
      return res
        .status(400)
        .send({ status: 400, message: msg.TOPIC_NOT_FOUND });
    }

    const getSyllabus = await Syllabus.findAndCountAll({
      where: { topicId: topicId },
      attributes: ["id", "topicId", "video", "time", "name"],
    });

    if (!getSyllabus) {
      return res
        .status(400)
        .send({ status: 400, message: msg.SYLLABUS_NOT_FOUND, data: [] });
    }

    let response = [];
    for (let syllabus of getSyllabus.rows) {
      const video = await getSignedUrl(syllabus.dataValues.video);
      response.push({
        ...syllabus.dataValues,
        video,
      });
    }

    getSyllabus.rows = response;

    const result = {
      id: topicDetails.id,
      courseId: topicDetails.courseId,
      boardId: topicDetails.boardId,
      classId: topicDetails.classId,
      batchTypeId: topicDetails.batchTypeId,
      subjectId: topicDetails.subjectId,
      chapterId: topicDetails.chapterId,
      TopicName: topicDetails.name,
      //totalVideo: getSyllabus.count,
      videos: getSyllabus.rows,
    };

    return res.send({
      msg: msg.FOUND_DATA,
      count: getSyllabus.count,
      data: result,
    });
  } catch (err) {
    return Response(res, 500, err.message, []);
  }
};

//ANCHOR: get all syllabus
const getAllSyllabus = async (req, res) => {
  try {
    let getAllSyllabus = [];
    const { page, limit, search } = req.query;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    let val;
    if (search) {
      val = {
        [Op.or]: [
          { id: search },
          { name: search },
          { name: { [Op.like]: "%" + search + "%" } },
        ],
      };
    }

    const getSyllabus = await Syllabus.findAndCountAll({
      ...query,

      where: {
        ...val,
      },

      order: [["createdAt", "DESC"]],
    });

    if (!getSyllabus) {
      return res
        .status(400)
        .send({ status: 400, message: msg.SYLLABUS_NOT_FOUND, data: [] });
    }

    for (const allSyllabus of getSyllabus.rows) {
      const video = await getSignedUrl(allSyllabus.dataValues.video);
      getAllSyllabus.push({
        id: allSyllabus.id,
        topicId: allSyllabus.topicId,
        video: video,
        name: allSyllabus.name,
        time: allSyllabus.time,
        createdAt: allSyllabus.createdAt,
        updatedAt: allSyllabus.updatedAt,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getSyllabus.count,
      data: getAllSyllabus,
    });
  } catch (err) {
    console.log(err);
    return Response(res, 500, err.message, []);
  }
};

//ANCHOR: get all video by chapterId
const getAllSyllabusByChapterId = async (req, res) => {
  try {
    let allTopic = [];
    const { subjectId, chapterId } = req.body;

    let val;
    if (subjectId) {
      val = {
        id: subjectId,
      };
    }

    let chap;
    if (chapterId) {
      chap = {
        id: chapterId,
      };
    }

    const getTopic = await Topic.findAll({
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
          model: Subject,
          attributes: ["name"],
          where: val,
        },
        {
          model: Chapter,
          attributes: ["name"],
          where: chap,
        },
      ],
    });
    if (!getTopic) {
      return res
        .status(400)
        .send({ status: 400, message: msg.TOPIC_NOT_FOUND });
    }

    for (let data of getTopic) {
      const array = await Content.findOne({
        where: { topicId: data.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      console.log("array", array);
      allTopic.push({
        topicId: data.id,
        name: data.name,
        subjectId: data.subjectId,
        subject: data.subject?.name,
        chapterId: data.chapterId,
        chapterName: data.name,
        thumbnail:
          !!array && array.thumbnailFile
            ? `https://dwc48rifn4uxk.cloudfront.net/${array.thumbnailFile}`
            : null,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allTopic,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: add syllabusContent
const addSyllabusContent = async (req, res) => {
  try {
    let {
      courseId,
      boardId,
      classId,
      batchTypeId,
      subjectId,
      chapterId,
      topicId,
      tag,
      resourceType,
      source,
      sourceFile,
      thumbnailFile,
      resourceFile,
    } = req.body;

    //NOTE - id from token
    const userId = req.user.id;

    //NOTE - payload for all data
    let payload = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      subjectId: subjectId,
      chapterId: chapterId,
      topicId: topicId,
      resourceType: tag === "Help Resource" ? resourceType : null,
      tag: tag,
      source: source,
      createdById: userId,
    };

    const resource = [];
    if (source !== "upload") {
      // FOR YOUTUBE AND VIMEO
      payload = { ...payload, sourceFile: sourceFile };
    } else {
      payload = { ...payload, sourceFile: sourceFile };
    }
    // FOR THUMBNAIL
    const uploadS3Thumbnail = await uploadFileS3(
      thumbnailFile,
      msg.SYLLABUS_CONTENT_THUMBNAIL_URL
    );
    payload = {
      ...payload,
      thumbnailFile: uploadS3Thumbnail.Key,
    };

    const final = new Content(payload);
    const data = await final.save();

    //NOTE - final return
    return res.status(200).send({
      status: 200,
      message: msg.CONTENT_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get all syllabus content
const getAllSyllabusContent = async (req, res) => {
  try {
    const { page, limit, search, classes, subject, chapter } = req.query;
    let subject_details;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    let val;
    if (search) {
      val = {
        name: { [Op.like]: "%" + search + "%" },
      };
    }

    //NOTE - class filter
    let cls = {};
    if (classes) {
      cls = {
        classId: classes,
      };
    }

    //NOTE - subject filter
    let sub = {};
    if (subject) {
      sub = {
        subjectId: subject,
      };
    }

    //NOTE - chapter filter
    let chap = {};
    if (chapter) {
      chap = {
        chapterId: chapter,
      };
    }

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (["teacher", "mentor", "Teacher", "Mentor"].includes(req.user?.role)) {
        //NOTE - Get  User details from token
        const getAdmin = await AdminUser.findOne({
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
        const classesIds = subject_details.map(
          (item) => item.dataValues.classId
        );

        //NOTE - push all batch ids
        const batchIds = subject_details.map(
          (item) => item.dataValues.batchTypeId
        );

        if (batchIds.every((id) => id === null)) {
          //NOTE - all chapter are being taught in the same batch, filter based on classId only
          params = {
            classId: {
              [Sequelize.Op.in]: classesIds,
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

    //NOTE - get all content videos
    const getSyllabusContent = await Content.findAndCountAll({
      ...query,
      where: { ...params, ...cls, ...sub, ...chap },
      include: [
        {
          model: Course,
          attributes: ["id", "name"],
        },
        {
          model: Boards,
          attributes: ["id", "name"],
        },
        {
          model: Class,
          attributes: ["id", "name"],
        },
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
          model: Topic,
          attributes: ["id", "name"],
          where: val,
        },
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
    if (!getSyllabusContent)
      return res
        .status(400)
        .send({ status: 400, message: msg.SYLLABUS_NOT_FOUND });

    //NOTE - converting in cloudfront
    let getAllContent = [];
    for (const allContents of getSyllabusContent.rows) {
      //NOTE - converting in cloudfront
      let sourceFiles;
      if (
        allContents.source !== null &&
        allContents?.source.includes("upload")
      ) {
        sourceFiles = await getSignedUrlCloudFront(allContents?.sourceFile);
      } else {
        sourceFiles =
          allContents?.sourceFile && allContents?.sourceFile
            ? allContents?.sourceFile
            : null;
      }

      //NOTE - push all final data
      getAllContent.push({
        id: allContents?.id,
        courseId: allContents?.course?.id,
        course: allContents?.course?.name,
        boardId: allContents?.board?.id,
        board: allContents?.board?.name,
        classId: allContents?.class?.id,
        class: allContents?.class?.name,
        batchTypeId: allContents?.batchType?.id,
        batchType: allContents?.batchType?.name,
        subjectId: allContents?.subject?.id,
        subject: allContents?.subject?.name,
        chapterId: allContents?.chapter?.id,
        chapter: allContents?.chapter?.name,
        topicId: allContents?.topicId,
        topic: allContents?.topic?.name,
        tag: allContents?.tag,
        source: allContents?.source,
        resourceType: allContents?.resourceType,
        sourceFiles: sourceFiles ? sourceFiles : null,
        thumbnailFile:
          allContents.thumbnails !== null
            ? await getSignedUrlCloudFront(
                allContents?.dataValues?.thumbnailFile
              )
            : null,
        createdByName: allContents.creator ? allContents.creator?.name : null,
        createdByRole: allContents.creator
          ? allContents.creator?.permission_role?.role
          : null,
        updateByName: allContents.updater ? allContents.updater?.name : null,
        updateByRole: allContents.updater
          ? allContents.updater?.permission_role.role
          : null,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getSyllabusContent.count,
      data: getAllContent,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get syllabus content by id
const getSyllabusContentById = async (req, res) => {
  try {
    const allContents = await Content.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Course,
          attributes: ["id", "name"],
        },
        {
          model: Boards,
          attributes: ["id", "name"],
        },
        {
          model: Class,
          attributes: ["id", "name"],
        },
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
          model: Topic,
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!allContents) {
      return res
        .status(400)
        .send({ status: 400, message: msg.SYLLABUS_NOT_FOUND });
    }

    let getAllContent = {};
    const arr = JSON.parse(allContents?.resourceFile);
    let response = [];
    if (arr !== null) {
      for (let final of arr) {
        response.push(final);
      }
    }

    getAllContent = {
      id: allContents.id,
      courseId: allContents.course?.id,
      course: allContents.course?.name,
      boardId: allContents.board.id,
      board: allContents.board?.name,
      classId: allContents.class.id,
      class: allContents.class?.name,
      batchTypeId: allContents.batchType.id,
      batchType: allContents.batchType?.name,
      subjectId: allContents.subject.id,
      subject: allContents.subject?.name,
      chapterId: allContents.chapter.id,
      chapter: allContents.chapter?.name,
      topicId: allContents.topicId,
      tag: allContents.tag,
      topic: allContents.topic.name,
      source: allContents.source,
      resourceType: allContents?.resourceType,
      sourceFile:
        allContents?.sourceFile && allContents?.sourceFile
          ? allContents?.sourceFile
          : "",
      thumbnailFile:
        allContents?.dataValues?.thumbnailFile &&
        allContents?.dataValues?.thumbnailFile
          ? allContents?.dataValues?.thumbnailFile
          : "",
      resourceFile: response ? response : "",
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getAllContent,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: update syllabus content
const updateSyllabusContentById = async (req, res) => {
  try {
    const {
      courseId,
      boardId,
      classId,
      batchTypeId,
      subjectId,
      chapterId,
      topicId,
      tag,
      source,
      sourceFile,
      resourceType,
      thumbnailFile,
      Id,
    } = req.body;

    const getContent = await Content.findOne({
      where: { id: Id },
    });
    if (!getContent) {
      return res
        .status(400)
        .send({ status: 400, message: msg.CONTENT_NOT_FOUND });
    }

    let payload = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      subjectId: subjectId,
      chapterId: chapterId,
      topicId: topicId,
      tag: tag,
      source: source,
      resourceType: resourceType,
    };

    //thumbnailFile upload
    if (thumbnailFile && thumbnailFile.includes("base64")) {
      const uploadImage = await uploadFileS3(
        thumbnailFile,
        msg.SYLLABUS_CONTENT_THUMBNAIL_URL
      );
      payload = { ...payload, thumbnailFile: uploadImage.Key };
    } else {
      payload = { ...payload };
    }

    //sourceFile upload[]
    if (sourceFile && sourceFile.includes("cloudfront")) {
      payload = { ...payload };
    } else {
      payload = { ...payload, sourceFile: sourceFile };
    }

    const updatedContent = await Content.update(payload, {
      where: { id: Id },
    });

    return res.status(200).send({
      status: 200,
      message: msg.CONTENT_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//ANCHOR: get content by chapterId or subjectId
const getLearningContentById = async (req, res) => {
  try {
    const { subjectId, chapterId, category } = req.body;
    let allTopic = [];

    //NOTE - user id from token
    const token = req.user.id;

    //NOTE - find user details
    const user_details = await UserDetails.findOne({
      where: { id: token, type: "Student" },
      include: {
        model: StudentDetails,
        attributes: ["courseId", "boardId", "classId", "batchTypeId"],
      },
    });
    if (!user_details)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    let subjectParams;
    //NOTE - subject filter
    if (subjectId) {
      //NOTE - check subject details
      const checkSubject = await Subject.findOne({
        where: { id: subjectId },
      });

      //NOTE - if isAllsubject is true
      if (checkSubject?.isAllSubject === 1) {
        //NOTE - if isAllsubject is true and user is Free user
        if (["Free"].includes(user_details.subscriptionType)) {
          const allSubjects = await Subject.findAll({
            where: {
              batchTypeId: user_details.student.batchTypeId,
              isAllSubject: 0,
            },
            include: {
              model: Chapter,
              as: "chapters",
              order: [["createdAt", "ASC"]],
              limit: 1,
            },
          });

          const chapterIds = allSubjects.map(
            (subject) => subject.chapters[0].id
          );

          subjectParams = {
            chapterId: {
              [Sequelize.Op.in]: chapterIds,
            },
          };
        } else {
          //NOTE - if isAllsubject is true and user is premium user
          subjectParams = undefined;
        }
      } else {
        if (["Free"].includes(user_details.subscriptionType)) {
          //NOTE - subject first chapter filter
          const getChapter = await Chapter.findOne({
            where: {
              subjectId: subjectId,
            },
            order: [["createdAt", "ASC"]],
          });
          subjectParams = {
            subjectId: getChapter.subjectId,
            chapterId: getChapter.id,
          };
        } else {
          //NOTE - if isAllsubject is false
          subjectParams = {
            subjectId: subjectId,
          };
        }
      }
    }

    //NOTE - chapter filter
    const chapterParams = chapterId ? { chapterId } : undefined;

    //NOTE - category filter
    const query = category ? { tag: category } : undefined;

    //NOTE - get all content
    const array = await Content.findAll({
      where: {
        courseId: user_details.student?.courseId,
        boardId: user_details.student?.boardId,
        classId: user_details.student?.classId,
        batchTypeId: user_details.student?.batchTypeId,
        ...query,
        ...subjectParams,
        ...chapterParams,

        sourceFile: {
          [Op.not]: null, //NOTE - null sourceFIle can be neglated
        },
      },

      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        { model: batchType, attributes: ["name"] },
        { model: Subject, attributes: ["name"] },
        { model: Chapter, attributes: ["name"] },
        { model: Topic, attributes: ["name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    // NOTE - Get unique by topic id only tag is learning content
    const uniqueMap = new Map();
    for (const item of array) {
      if (item.tag === "Learning Content") {
        uniqueMap.set(item.topicId, item);
      } else {
        uniqueMap.set(item.id, item);
      }
    }

    const uniqueArray = [...uniqueMap.values()].sort();

    for (let data of uniqueArray) {
      if (category) {
        console.log('grtytreyetr');

        let bookmarks;
        if (array !== null) {
          bookmarks = await Bookmark.findOne({
            where: {
              typeId: data && data?.id ? data?.id : null,
              subjectId: data.subjectId,
              bookmarkType: "video",
              userId: token,
            },
            attributes: ["bookmark"],
            order: [["createdAt", "DESC"]],
          });
          //NOTE - final push
          allTopic.push({
            id: data.topicId,
            name: data?.topic?.name,
            subjectId: data.subjectId,
            subject: data?.subject?.name,
            chapterId: data?.chapterId,
            chapterName: data?.chapter?.name,
            tag: data?.tag,
            videoId: data?.id,
            thumbnail:
              data.tag === "Help Resource" && data.thumbnailFile === null
                ? await getSignedUrlCloudFront(
                    HelpResourcedefaultImages.HelpResource[0].image
                  )
                : data.tag === "Learning Content" &&
                  data?.thumbnailFile !== null
                ? await getSignedUrlCloudFront(data?.thumbnailFile)
                : null,
            bookmark:
              bookmarks && bookmarks?.bookmark ? bookmarks?.bookmark : false,
            source: data.source ? data.source : null,
            resourceType: data.resourceType ? data.resourceType : "",
            sourceFile:
              data?.sourceFile && data.resourceType === "video"
                ? await cloudFrontM3u8Converter(converterType(data?.sourceFile))
                : data.sourceFile
                ? await getSignedUrlCloudFront(data.sourceFile)
                : null,
            originalSource: data?.sourceFile
              ? await getSignedUrlCloudFront(data.sourceFile)
              : null,
            downloadSource:
              data?.sourceFile && data.resourceType === "video"
                ? await cloudFrontM3u8Converter(
                    replaceDirectoryInPath(data?.sourceFile)
                  )
                : data.sourceFile
                ? await getSignedUrlCloudFront(data.sourceFile)
                : null, //TODO - only for download
          });
        }
      }

      //NOTE - category is null or undefined
      if (category === undefined || category === "") {
        let bookmarks;
        if (array !== null) {
          bookmarks = await Bookmark.findOne({
            where: {
              typeId: data && data?.id ? data?.id : null,
              subjectId: data.subjectId,
              bookmarkType: "video",
              userId: token,
            },
            attributes: ["bookmark"],
            order: [["createdAt", "DESC"]],
          });
          //NOTE - final push
          allTopic.push({
            id: data.topicId,
            name: data?.topic?.name,
            subjectId: data.subjectId,
            subject: data.subject?.name,
            chapterId: data.chapterId,
            chapterName: data.chapter?.name,
            tag: data?.tag,
            videoId: data?.id,
            thumbnail:
              data.tag === "Help Resource" && data.thumbnailFile === null
                ? await getSignedUrlCloudFront(
                    HelpResourcedefaultImages.HelpResource[0].image
                  )
                : data.tag === "Learning Content" &&
                  data?.thumbnailFile !== null
                ? await getSignedUrlCloudFront(data?.thumbnailFile)
                : null,
            bookmark:
              bookmarks && bookmarks?.bookmark ? bookmarks?.bookmark : false,
            source: data.source ? data.source : null,
            resourceType: data.resourceType ? data.resourceType : "",
            sourceFile:
              data?.sourceFile && data.resourceType === "video"
                ? await cloudFrontM3u8Converter(converterType(data?.sourceFile))
                : data.sourceFile
                ? await getSignedUrlCloudFront(data.sourceFile)
                : null,
            originalSource: data?.sourceFile
              ? await getSignedUrlCloudFront(data.sourceFile)
              : null,
            downloadSource:
              data?.sourceFile && data.resourceType === "video"
                ? await cloudFrontM3u8Converter(
                    replaceDirectoryInPath(data?.sourceFile)
                  )
                : data.sourceFile
                ? await getSignedUrlCloudFront(data.sourceFile)
                : null, //TODO - only for download
          });
        }
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allTopic,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR:  get syllabus content by topic id
const getSyllabusContentByTopicId = async (req, res) => {
  try {
    let result = [];
    const { topicId } = req.query;

    //NOTE - convert source name
    const sources = {
      youtube: "youtube",
      upload: "video",
      gallerymanager: "video",
    };

    let sourceFiles;
    //NOTE - find all content topic wise
    const getContent = await Content.findAndCountAll({
      where: { topicId: topicId },
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
          model: Topic,
          attributes: ["id", "name"],
        },
      ],
    });
    if (!getContent)
      return res
        .status(400)
        .send({ status: 400, message: msg.CONTENT_NOT_FOUND });

    for (let allContents of getContent.rows) {
      //NOTE - source file
      let originalSource;
      let downloadSource;
      if (allContents?.source !== "youtube") {
        originalSource =
          allContents?.sourceFile !== null
            ? await getSignedUrlCloudFront(allContents?.sourceFile)
            : null; //TODO - without w3u8
        sourceFiles =
          allContents?.sourceFile !== null
            ? await cloudFrontM3u8Converter(
                converterType(allContents?.sourceFile)
              )
            : null; //TODO - with w3u8
        downloadSource =
          allContents?.sourceFile !== null
            ? await cloudFrontM3u8Converter(
                replaceDirectoryInPath(allContents?.sourceFile)
              )
            : null; //TODO - only for download
      } else {
        sourceFiles =
          allContents?.sourceFile && allContents?.sourceFile
            ? await getYouTubeVideoId(allContents?.sourceFile)
            : null;
      }
      const thumbnails =
        allContents.tag === "Help Resource" &&
        allContents.thumbnailFile === null
          ? await getSignedUrlCloudFront(
              HelpResourcedefaultImages.HelpResource[0].image
            )
          : allContents.tag === "Learning Content" &&
            allContents?.thumbnailFile !== null
          ? await getSignedUrlCloudFront(allContents?.thumbnailFile)
          : null;

      //NOTE - checking bookmark status
      let bookmarks;
      if (allContents !== null) {
        try {
          bookmarks = await Bookmark.findOne({
            where: {
              typeId: allContents?.id,
              bookmarkType: "video",
              userId: req.user.id,
            },
            attributes: ["bookmark"],
          });
        } catch (err) {
          bookmarks = bookmarks;
        }
      }

      //NOTE - final push
      result.push({
        id: allContents.id,
        topicId: allContents.topicId,
        topic: allContents?.topic?.name,
        chapterId: allContents?.chapter?.id,
        chapterName: allContents?.chapter?.name,
        subjectId: allContents?.subject?.id,
        subject: allContents?.subject?.name,
        tag: allContents.tag,
        source: sources[allContents.source],
        sourceFile: sourceFiles ? sourceFiles : null,
        resourceType: allContents.resourceType ? allContents.resourceType : "",
        thumbnailFile: thumbnails ? thumbnails : null,
        //resourceFile: response ? response : null,
        bookmark:
          bookmarks && bookmarks?.bookmark ? bookmarks?.bookmark : false,
        originalSource:
          allContents?.sourceFile && allContents?.sourceFile !== null
            ? originalSource
            : null,
        downloadSource:
          allContents?.sourceFile && allContents?.sourceFile !== null
            ? downloadSource
            : null,
      });
    }

    //NOTE - final return
    return res.send({
      msg: msg.FOUND_DATA,
      count: getContent.count,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get content by chapterId or subjectId
const resumeLearning = async (req, res) => {
  try {
    let allTopic = [];
    const { subjectId, chapterId } = req.query;

    //NOTE - id from token
    const token = req.user.id;

    //NOTE - find user details
    const user_details = await UserDetails.findOne({
      where: { id: token, type: "Student" },
      include: {
        model: StudentDetails,
        attributes: ["courseId", "boardId", "classId", "batchTypeId"],
      },
    });

    if (!user_details)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    //NOTE - FILTER IN SUBJECT
    let subjectParams;
    //NOTE - subject filter
    if (subjectId) {
      //NOTE - check subject details
      const checkSubject = await Subject.findOne({
        where: { id: subjectId },
      });

      //NOTE - if isAllsubject is true
      if (checkSubject?.isAllSubject === 1) {
        //NOTE - if isAllsubject is true and user is Free user
        if (["Free"].includes(user_details.subscriptionType)) {
          const allSubjects = await Subject.findAll({
            where: {
              batchTypeId: user_details.student.batchTypeId,
              isAllSubject: 0,
            },
            include: {
              model: Chapter,
              as: "chapters",
              order: [["createdAt", "ASC"]],
              limit: 1,
            },
          });

          const chapterIds = allSubjects.map(
            (subject) => subject.chapters[0].id
          );

          subjectParams = {
            chapterId: {
              [Sequelize.Op.in]: chapterIds,
            },
          };
        } else {
          //NOTE - if isAllsubject is true and user is premium user
          subjectParams = undefined;
        }
      } else {
        //NOTE - if isAllsubject is false
        subjectParams = {
          subjectId: subjectId,
        };
      }
    }

    //NOTE - chapter filter
    const chapterParams = chapterId ? { chapterId } : undefined;

    // Find recent activity within the date range
    const getActivity = await recentActivityDetails.findAll({
      where: {
        userId: token,
        status: "ongoing",
      },
      attributes: [
        "videoId",
        [Sequelize.fn("MAX", Sequelize.col("createdAt")), "createdAt"],
        [Sequelize.fn("MAX", Sequelize.col("id")), "id"],
        [Sequelize.fn("MAX", Sequelize.col("videoStart")), "videoStart"],
        [Sequelize.fn("MAX", Sequelize.col("videoEnd")), "videoEnd"],
        [Sequelize.fn("MAX", Sequelize.col("userId")), "userId"],
        [Sequelize.fn("MAX", Sequelize.col("subjectId")), "subjectId"],
        [Sequelize.fn("MAX", Sequelize.col("videoEnd")), "videoEnd"],
        [Sequelize.fn("MAX", Sequelize.col("videoEnd")), "videoEnd"],
      ],
      group: ["videoId"],
      order: [["createdAt", "DESC"]],
    });
    //NOTE - if activity not found
    if (!getActivity) {
      return res
        .status(200)
        .send({ status: 200, message: msg.NO_ACTIVITY, data: [] });
    }

    for (let data of getActivity) {
      //NOTE  get content
      const array = await Content.findOne({
        where: {
          id: data.videoId,
          courseId: user_details.student?.courseId,
          boardId: user_details.student?.boardId,
          classId: user_details.student?.classId,
          batchTypeId: user_details.student?.batchTypeId,
          ...subjectParams,
          ...chapterParams,
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          { model: Subject, attributes: ["id", "name"] },
          { model: Chapter, attributes: ["id", "name"] },
          { model: Topic, attributes: ["id", "name"] },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (array !== null) {
        //NOTE - get bookmark
        const bookmarks = await Bookmark.findOne({
          where: {
            typeId: array?.id && array?.id ? array?.id : null,
            bookmarkType: "video",
            userId: token,
          },
          attributes: ["bookmark"],
          order: [["createdAt", "DESC"]],
        });

        //NOTE - final push
        allTopic.push({
          id: array?.topicId, //topic id
          name: array?.topic?.name,
          subjectId: array?.subjectId,
          subject: array?.subject?.name,
          chapterId: array?.chapterId,
          chapterName: array?.chapter?.name,
          tag: "Resume Learning",
          videoId: array?.id,
          thumbnail: array
            ? await getSignedUrlCloudFront(array?.dataValues?.thumbnailFile)
            : null,
          bookmark:
            bookmarks?.bookmark && bookmarks?.bookmark
              ? bookmarks?.bookmark
              : false,
          //startTime: data?.videoStart === null ? data?.videoEnd : data?.videoStart,
          startTime: data?.videoEnd,
        });
      }
    }

    //NOTE - final return
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allTopic,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get content by chapterId or subjectId
const test = async (req, res) => {
  try {
    //NOTE - get all content
    const filenames = await Content.findAll({
      where: { resourceType: "pdf" },
      attributes: ["id", "sourceFile"],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: filenames,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  addSyllabus,
  getSyllabusByTopicId,
  getAllSyllabus,
  getSyllabusById,
  getAllSyllabusByChapterId,
  addSyllabusContent,
  getAllSyllabusContent,
  updateSyllabusContentById,
  getLearningContentById, //TODO - use in web and mobile (Learning content)
  getSyllabusContentByTopicId,
  getSyllabusContentById,
  resumeLearning, //TODO - use in web and mobile (Resume Learning),
  test,
};
