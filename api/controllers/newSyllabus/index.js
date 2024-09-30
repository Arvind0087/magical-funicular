const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize, Op } = require("sequelize");
const { converterType } = require("../../helpers/service");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const {
  getSignedUrlCloudFront,
  getYouTubeVideoId,
  cloudFrontM3u8Converter,
} = require("../../helpers/cloudFront");
const { replaceDirectoryInPath, contentCourses } = require("./service");
const {
  HelpResourcedefaultImages,
} = require("../../helpers/studentDefaultImages");
const Topic = db.topic;
const Subject = db.subject;
const batchType = db.batchTypes;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;
const Chapter = db.chapter;
const Bookmark = db.bookmark;
const UserDetails = db.users;
const StudentDetails = db.student;
const RolePermission = db.permissionRole;
const AdminUser = db.admin;
const recentActivityDetails = db.recentActivity;
const TeacherSubjectMap = db.teacher_subject_map;
const NewContent = db.new_content;
const contentCourseMap = db.content_course_map;
const create_error = db.error;
const studentPackages = db.student_course_package_map;
const { checkIfArraysMatch } = require("../../helpers/matchArrayOfIds");

//ANCHOR : add addSyllabus
const addNewContent = async (req, res) => {
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
      ORDERSEQ
    } = req.body;

    //NOTE - creator id form decode token
    const userId = req.user.id;

    if (batchTypeId && batchTypeId !== "all") {
      //NOTE - match batch
      const batches = await batchType.findAll({
        attributes: ["id", "classId"],
        where: {
          courseId: courseId,
          boardId: boardId,
          id: {
            [Sequelize.Op.in]: batchTypeId,
          },
        },
      });
      const allClassForBatch = batches.map((batch) => batch.classId);
      const arraysMatchBatch = await checkIfArraysMatch(
        allClassForBatch,
        classId
      ); //TODO - check batch

      if (arraysMatchBatch === false) {
        return res.status(400).send({
          status: 400,
          message: msg.SELECT_ATLEAST_BATCHTYPE,
        });
      }
    }
    if (subjectId && subjectId !== "all") {
      //NOTE - match subject
      const subjects = await Subject.findAll({
        attributes: ["id", "batchTypeId"],
        where: {
          courseId: courseId,
          boardId: boardId,
          id: {
            [Sequelize.Op.in]: subjectId,
          },
        },
      });

      const allBatchesForSubject = subjects.map((subj) => subj.batchTypeId);
      const arraysMatchSubject = await checkIfArraysMatch(
        allBatchesForSubject,
        batchTypeId
      ); //TODO - check batch
      if (arraysMatchSubject === false) {
        return res.status(400).send({
          status: 400,
          message: msg.SELECT_ATLEAST_SUBJECTS,
        });
      }
    }
    if (chapterId && chapterId !== "all") {
      //NOTE - match chapter
      const chapter = await Chapter.findAll({
        attributes: ["id", "subjectId"],
        where: {
          courseId: courseId,
          boardId: boardId,
          id: {
            [Sequelize.Op.in]: chapterId,
          },
        },
      });

      const allSubjectForChapter = chapter.map((subj) => subj.subjectId);
      const arraysMatchChpater = await checkIfArraysMatch(
        allSubjectForChapter,
        subjectId
      ); //TODO - check batch
      if (arraysMatchChpater === false) {
        return res.status(400).send({
          status: 400,
          message: msg.SELECT_ATLEAST_CHAPTER,
        });
      }
    }
    if (topicId && topicId !== "all") {
      //NOTE - match topic
      const topics = await Topic.findAll({
        attributes: ["id", "chapterId"],
        where: {
          courseId: courseId,
          boardId: boardId,
          id: {
            [Sequelize.Op.in]: topicId,
          },
        },
      });
      const allChapterForTopic = topics.map((topic) => topic.chapterId);
      const arraysMatchTopic = await checkIfArraysMatch(
        allChapterForTopic,
        chapterId
      ); //TODO - check batch
      if (arraysMatchTopic === false) {
        return res.status(400).send({
          status: 400,
          message: msg.SELECT_ATLEAST_TOPIC,
        });
      }
    }
    //NOTE - payload for new content
    let payload = {
      resourceType: tag === "Help Resource" ? resourceType : null,
      tag: tag,
      source: source,
      createdById: userId,
    };

    //NOTE - upload image
    if (source) {
      //NOTE - FOR YOUTUBE AND VIMEO
      payload = { ...payload, sourceFile: sourceFile };
    }

    //NOTE - upload thumbnail
    if (thumbnailFile && thumbnailFile.includes("base64")) {
      //NOTE - FOR THUMBNAIL upload
      const uploadS3Thumbnail = await uploadFileS3(
        thumbnailFile,
        msg.SYLLABUS_CONTENT_THUMBNAIL_URL
      );
      payload = {
        ...payload,
        thumbnailFile: uploadS3Thumbnail.Key,
      };
    }

    const final = new NewContent(payload);
    const finalContetn = await final.save();

    if (classId === "all") {
      //NOTE - find topic based on course and board
      const topics = await Topic.findAll({
        where: {
          courseId: courseId,
          boardId: boardId,
        },
      });
      for (let data of topics) {
        //NOTE - create contetn for course map
        await contentCourseMap.create({
          contentId: finalContetn.id,
          courseId: data.courseId,
          boardId: data.boardId,
          classId: data.classId,
          batchTypeId: data.batchTypeId,
          subjectId: data.subjectId,
          chapterId: data.chapterId,
          topicId: data.id,
          createdById: userId,
        });
      }
    }
    if (batchTypeId === "all") {
      //NOTE - find topic based on course and board
      const topics = await Topic.findAll({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: {
            [Sequelize.Op.in]: classId,
          },
        },
      });
      for (let data of topics) {
        //NOTE - create contetn for course map
        await contentCourseMap.create({
          contentId: finalContetn.id,
          courseId: data.courseId,
          boardId: data.boardId,
          classId: data.classId,
          batchTypeId: data.batchTypeId,
          subjectId: data.subjectId,
          chapterId: data.chapterId,
          topicId: data.id,
          createdById: userId,
        });
      }
    }
    if (subjectId === "all") {
      //NOTE - find subject based on course and board
      const topics = await Topic.findAll({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: {
            [Sequelize.Op.in]: classId,
          },
          batchTypeId: {
            [Sequelize.Op.in]: batchTypeId,
          },
        },
      });
      for (let data of topics) {
        //NOTE - create contetn for course map
        await contentCourseMap.create({
          contentId: finalContetn.id,
          courseId: data.courseId,
          boardId: data.boardId,
          classId: data.classId,
          batchTypeId: data.batchTypeId,
          subjectId: data.subjectId,
          chapterId: data.chapterId,
          topicId: data.id,
          createdById: userId,
        });
      }
    }
    if (chapterId === "all") {
      //NOTE - find subject based on course and board
      const topics = await Topic.findAll({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: {
            [Sequelize.Op.in]: classId,
          },
          batchTypeId: {
            [Sequelize.Op.in]: batchTypeId,
          },
          subjectId: {
            [Sequelize.Op.in]: subjectId,
          },
        },
      });
      for (let data of topics) {
        //NOTE - create contetn for course map
        await contentCourseMap.create({
          contentId: finalContetn.id,
          courseId: data.courseId,
          boardId: data.boardId,
          classId: data.classId,
          batchTypeId: data.batchTypeId,
          subjectId: data.subjectId,
          chapterId: data.chapterId,
          topicId: data.id,
          createdById: userId,
        });
      }
    }
    if (topicId === "all") {
      //NOTE - find subject based on course and board
      const topics = await Topic.findAll({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: {
            [Sequelize.Op.in]: classId,
          },
          batchTypeId: {
            [Sequelize.Op.in]: batchTypeId,
          },
          subjectId: {
            [Sequelize.Op.in]: subjectId,
          },
          chapterId: {
            [Sequelize.Op.in]: chapterId,
          },
        },
      });
      for (let data of topics) {
        //NOTE - create contetn for course map
        await contentCourseMap.create({
          contentId: finalContetn.id,
          courseId: data.courseId,
          boardId: data.boardId,
          classId: data.classId,
          batchTypeId: data.batchTypeId,
          subjectId: data.subjectId,
          chapterId: data.chapterId,
          topicId: data.id,
          createdById: userId,
        });
      }
    }
    if (
      classId !== "all" &&
      batchTypeId !== "all" &&
      subjectId !== "all" &&
      chapterId !== "all" &&
      topicId !== "all"
    ) {
      //NOTE - find topic based on course and board
      const finaLTopic = await Topic.findAll({
        where: {
          courseId: courseId,
          boardId: boardId,
          id: {
            [Sequelize.Op.in]: topicId,
          },
        },
      });
      for (let data of finaLTopic) {
        //NOTE - create contetn for course map
        await contentCourseMap.create({
          contentId: finalContetn.id,
          courseId: data.courseId,
          boardId: data.boardId,
          classId: data.classId,
          batchTypeId: data.batchTypeId,
          subjectId: data.subjectId,
          chapterId: data.chapterId,
          topicId: data.id,
          createdById: userId,
        });
      }
    }
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
const getAllContent = async (req, res) => {
  try {
    const { page, limit, search, classes, subject, chapter } = req.query;
    let getAllContent = [];
    //NOTE - add pagination
    const query =
      page && limit
        ? {
          offset: Number(page - 1) * limit,
          limit: Number(limit),
        }
        : {};

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

    //NOTE - get all content from content course map table
    const getContent = await contentCourseMap.findAndCountAll({
      attributes: [
        ["contentId", "contentId"],
        [
          Sequelize.fn("MAX", Sequelize.col("content_course_map.createdAt")),
          "latestCreatedAt",
        ],
      ],
      include: [
        {
          model: NewContent,
          attributes: ["tag"],
        },
      ],
      where: { ...query.where, ...sub, ...cls, ...chap, ...params }, //TODO - filter based on subject, class ,cahpter and if login with teacher .Filter based on teachers batch type
      group: ["contentId"],
      offset: query.offset || 0,
      limit: query.limit || 10,
      order: [[Sequelize.literal("latestCreatedAt"), "DESC"]],
    });
    if (!getContent)
      return res
        .status(400)
        .send({ status: 400, message: msg.SYLLABUS_NOT_FOUND });

    //NOTE - get all content from content table
    for (let data of getContent.rows) {
      let classeArray = [];
      let batchArray = [];
      let subjectArray = [];
      let chapterArray = [];
      let topicArray = [];
      //NOTE - get all content videos
      const getSyllabusContent = await contentCourseMap.findAll({
        where: { contentId: data.contentId },
        include: [
          {
            model: NewContent,
            attributes: [
              "id",
              "source",
              "sourceFile",
              "thumbnailFile",
              "resourceType",
              "tag",
              "ORDERSEQ"
            ],
          },
          { model: Course, attributes: ["id", "name"] },
          { model: Boards, attributes: ["id", "name"] },
          { model: Class, attributes: ["id", "name"] },
          { model: batchType, attributes: ["id", "name"] },
          { model: Subject, attributes: ["id", "name"] },
          { model: Chapter, attributes: ["id", "name"] },
          { model: Topic, attributes: ["id", "name"] },
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

      for (const values of getSyllabusContent) {
        //NOTE - push class details
        classeArray.push({
          classId: values?.class?.id,
          name: values?.class?.name,
        });

        //NOTE - push batch details
        batchArray.push({
          batchId: values?.batchType?.id,
          name: values?.batchType?.name,
        });

        //NOTE - push Subject details
        subjectArray.push({
          subjectId: values?.subject?.id,
          name: values?.subject?.name,
        });

        //NOTE - push Subject details
        chapterArray.push({
          chapterId: values?.chapter?.id,
          name: values?.chapter?.name,
        });

        //NOTE - push Subject details
        topicArray.push({
          topicId: values?.topic?.id,
          name: values?.topic?.name,
        });
      }

      //NOTE - Get unique class
      const classkey = "classId";
      const uniqueClasses = [
        ...new Map(classeArray.map((item) => [item[classkey], item])).values(),
      ];

      //NOTE - Get unique batch
      const batchkey = "batchId";
      const uniqueBatch = [
        ...new Map(batchArray.map((item) => [item[batchkey], item])).values(),
      ];

      //NOTE - Get unique subject
      const subjectkey = "subjectId";
      const uniqueSubject = [
        ...new Map(
          subjectArray.map((item) => [item[subjectkey], item])
        ).values(),
      ];

      //NOTE - Get unique chapter
      const chapterkey = "chapterId";
      const uniqueChapter = [
        ...new Map(
          chapterArray.map((item) => [item[chapterkey], item])
        ).values(),
      ];
      //NOTE - Get unique topic
      const topickey = "topicId";
      const uniqueTopic = [
        ...new Map(topicArray.map((item) => [item[topickey], item])).values(),
      ];

      //NOTE - push all final data
      getAllContent.push({
        id: getSyllabusContent[0]?.contentId,
        courseId: getSyllabusContent[0]?.courseId,
        course: getSyllabusContent[0]?.course?.name,
        boardId: getSyllabusContent[0]?.boardId,
        board: getSyllabusContent[0]?.board?.name,
        class: uniqueClasses,
        batchType: uniqueBatch,
        subject: uniqueSubject,
        chapter: uniqueChapter,
        topic: uniqueTopic,
        tag: getSyllabusContent[0]?.new_content?.tag,
        source: getSyllabusContent[0]?.new_content?.source,
        resourceType: getSyllabusContent[0]?.new_content?.resourceType
          ? getSyllabusContent[0]?.new_content?.resourceType
          : null,
        sourceFiles: getSyllabusContent[0]?.new_content?.sourceFile
          ? await getSignedUrlCloudFront(
            getSyllabusContent[0]?.new_content?.sourceFile
          )
          : null,
        thumbnailFile: getSyllabusContent[0]?.new_content?.thumbnailFile
          ? await getSignedUrlCloudFront(
            getSyllabusContent[0]?.new_content?.thumbnailFile
          )
          : null,
        createdByName: getSyllabusContent[0].creator
          ? getSyllabusContent[0].creator?.name
          : null,
        createdByRole: getSyllabusContent[0].creator
          ? getSyllabusContent[0].creator?.permission_role?.role
          : null,
        updateByName: getSyllabusContent[0].updater
          ? getSyllabusContent[0].updater?.name
          : null,
        updateByRole: getSyllabusContent[0].updater
          ? getSyllabusContent[0].updater?.permission_role.role
          : null,
        createdAt: getSyllabusContent[0].createdAt,
        ORDERSEQ: getSyllabusContent[0]?.ORDERSEQ === 0 ? "N/A" : getSyllabusContent[0]?.ORDERSEQ
      });
    }

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getContent.count.length,
      data: getAllContent,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get all syllabus content by Id
const getContecntById = async (req, res) => {
  try {
    //NOTE - get all content videos
    const getSyllabusContent = await contentCourseMap.findAll({
      where: { contentId: req.params.id },
      include: [
        {
          model: NewContent,
          attributes: [
            "id",
            "source",
            "sourceFile",
            "thumbnailFile",
            "resourceType",
            "tag",
            "ORDERSEQ"
          ],
        },
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
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!getSyllabusContent)
      return res
        .status(400)
        .send({ status: 400, message: msg.SYLLABUS_NOT_FOUND });

    //NOTE - class array
    const classes = [];
    getSyllabusContent.forEach((item) => {
      const classInfo = {
        classId: item?.class?.id,
        class: item?.class?.name,
      };
      classes.push(classInfo);
    });

    //NOTE - batch array
    const batch = [];
    getSyllabusContent.forEach((item) => {
      const batchInfo = {
        batchTypeId: item?.batchType?.id,
        batchType: item?.batchType?.name,
      };
      batch.push(batchInfo);
    });

    //NOTE - subject array
    const subject = [];
    getSyllabusContent.forEach((item) => {
      const subjectInfo = {
        subjectId: item?.subject?.id,
        subject: item?.subject?.name,
      };
      subject.push(subjectInfo);
    });

    //NOTE - chapter array
    const chpater = [];
    getSyllabusContent.forEach((item) => {
      const chapterInfo = {
        chapterId: item?.chapter?.id,
        chapter: item?.chapter?.name,
      };
      chpater.push(chapterInfo);
    });

    //NOTE - topic array
    const topic = [];
    getSyllabusContent.forEach((item) => {
      const topicInfo = {
        topicId: item?.topicId,
        topic: item?.topic?.name,
      };
      topic.push(topicInfo);
    });

    //NOTE - Get unique class
    const classkey = "classId";
    const uniqueClasses = [
      ...new Map(classes.map((item) => [item[classkey], item])).values(),
    ];

    //NOTE - Get unique batch
    const batchkey = "batchId";
    const uniqueBatch = [
      ...new Map(batch.map((item) => [item[batchkey], item])).values(),
    ];

    //NOTE - Get unique subject
    const subjectkey = "subjectId";
    const uniqueSubject = [
      ...new Map(subject.map((item) => [item[subjectkey], item])).values(),
    ];

    //NOTE - Get unique chapter
    const chapterkey = "chapterId";
    const uniqueChapter = [
      ...new Map(chpater.map((item) => [item[chapterkey], item])).values(),
    ];
    //NOTE - Get unique topic
    const topickey = "topicId";
    const uniqueTopic = [
      ...new Map(topic.map((item) => [item[topickey], item])).values(),
    ];

    //NOTE - final result
    let result = {
      contentId: getSyllabusContent[0]?.contentId,
      tag: getSyllabusContent[0]?.new_content?.tag,
      source: getSyllabusContent[0]?.new_content?.source,
      resourceType: getSyllabusContent[0]?.new_content?.resourceType
        ? getSyllabusContent[0]?.new_content?.resourceType
        : null,
      sourceFiles: getSyllabusContent[0]?.new_content?.sourceFile
        ? await getSignedUrlCloudFront(
          getSyllabusContent[0]?.new_content?.sourceFile
        )
        : null,
      thumbnailFile: getSyllabusContent[0]?.new_content?.thumbnailFile
        ? await getSignedUrlCloudFront(
          getSyllabusContent[0]?.new_content?.thumbnailFile
        )
        : null,
      courseId: getSyllabusContent[0]?.course?.id,
      course: getSyllabusContent[0]?.course?.name,
      boardId: getSyllabusContent[0]?.board?.id,
      board: getSyllabusContent[0]?.board?.name,
      classes: uniqueClasses,
      batch: uniqueBatch,
      subject: uniqueSubject,
      chpater: uniqueChapter,
      topic: uniqueTopic,
      ORDERSEQ: getSyllabusContent[0]?.ORDERSEQ === 0 ? "N/A" : getSyllabusContent[0]?.ORDERSEQ
    };

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get Subject by all class ids
const getSubjectByMultipleClassBatch = async (req, res) => {
  try {
    const { courseId, boardId, classId, batchTypeId } = req.body;
    let getAllSubject = [];

    const getSubject = await Subject.findAll({
      attributes: [
        "id",
        "name",
        "courseId",
        "boardId",
        "classId",
        "batchTypeId",
      ],
      where: {
        courseId: courseId,
        boardId: boardId,
        batchTypeId: {
          [Sequelize.Op.in]: batchTypeId,
        },
        status: 1,
      },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
        { model: batchType, attributes: ["name"] },
      ],
    });
    getAllSubject.push(getSubject);
    var result = getAllSubject.reduce((r, e) => (r.push(...e), r), []);

    let final = [];
    for (let data of result) {
      final.push({
        id: data.id,
        name: data.name,
        courseId: data.courseId,
        course: data.course?.name,
        boardId: data.boardId,
        board: data.board?.name,
        classId: data.classId,
        class: data.class?.name,
        batchTypeId: data.batchTypeId,
        batchType: data.batchType?.name,
      });
    }
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: final,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get chapter by all ids
const getChapterByMultipleSubject = async (req, res) => {
  try {
    const { courseId, boardId, classId, batchTypeId, subjectId } = req.body;
    let getAllChapter = [];
    const getChpater = await Chapter.findAll({
      where: {
        courseId: courseId,
        boardId: boardId,
        subjectId: {
          [Sequelize.Op.in]: subjectId,
        },
        status: 1,
      },
      attributes: [
        "id",
        "name",
        "courseId",
        "boardId",
        "classId",
        "batchTypeId",
        "subjectId",
      ],
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
        { model: batchType, attributes: ["name"] },
        { model: Subject, attributes: ["name"] },
      ],
    });
    getAllChapter.push(getChpater);

    //NOTE - unique
    var result = getAllChapter.reduce((r, e) => (r.push(...e), r), []);

    let final = [];
    for (let data of result) {
      final.push({
        id: data.id,
        name: data.name,
        courseId: data.courseId,
        course: data.course?.name,
        boardId: data.boardId,
        board: data.board?.name,
        classId: data.classId,
        class: data.class?.name,
        batchTypeId: data.batchTypeId,
        batchType: data.batchType?.name,
        subjectId: data.subjectId,
        subject: data.subject?.name,
      });
    }

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: final,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get topic by all ids
const getTopicByMultipleChapter = async (req, res) => {
  try {
    const { courseId, boardId, classId, batchTypeId, subjectId, chapterId } =
      req.body;
    let getAlltopic = [];
    const getTopic = await Topic.findAll({
      attributes: [
        "id",
        "name",
        "courseId",
        "boardId",
        "classId",
        "batchTypeId",
        "subjectId",
        "chapterId",
      ],
      where: {
        courseId: courseId,
        boardId: boardId,
        // classId: {
        //     [Sequelize.Op.in]: classId,
        // },
        // batchTypeId: {
        //     [Sequelize.Op.in]: batchTypeId,
        // },
        // subjectId: {
        //     [Sequelize.Op.in]: subjectId,
        // },
        chapterId: {
          [Sequelize.Op.in]: chapterId,
        },
        status: 1,
      },

      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
        { model: batchType, attributes: ["name"] },
        { model: Subject, attributes: ["name"] },
        { model: Chapter, attributes: ["name"] },
      ],
    });
    getAlltopic.push(getTopic);
    //NOTE - unique
    var result = getAlltopic.reduce((r, e) => (r.push(...e), r), []);
    let final = [];
    for (let data of result) {
      final.push({
        id: data.id,
        name: data.name,
        courseId: data.courseId,
        course: data.course?.name,
        boardId: data.boardId,
        board: data.board?.name,
        classId: data.classId,
        class: data.class?.name,
        batchTypeId: data.batchTypeId,
        batchType: data.batchType?.name,
        subjectId: data.subjectId,
        subject: data.subject?.name,
        chapterId: data.chapterId,
        chapter: data.chapter?.name,
      });
    }
    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: final,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: update syllabus content
const updateContentById = async (req, res) => {
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
      Id
    } = req.body;

    //NOTE - creator id form decode token
    const userId = req.user.id;

    //NOTE - checking content
    const getContent = await NewContent.findOne({
      where: { id: Id },
    });
    if (!getContent) {
      return res
        .status(400)
        .send({ status: 400, message: msg.CONTENT_NOT_FOUND });
    }

    //NOTE - finding shorts on shorts course map
    const updateMap = await contentCourseMap.findAll({
      attributes: ["createdById"],
      where: { contentId: Id },
    });
    if (!updateMap) {
      return res
        .status(200)
        .send({ status: 200, message: msg.CONTENT_NOT_FOUND });
    }

    //NOTE - content created by id
    const contentCreatedById = updateMap[0]?.createdById;

    //NOTE - validation
    if (batchTypeId && batchTypeId !== "all") {
      //NOTE - match batch
      const batches = await batchType.findAll({
        attributes: ["id", "classId"],
        where: {
          courseId: courseId,
          boardId: boardId,
          id: {
            [Sequelize.Op.in]: batchTypeId,
          },
        },
      });
      const allClassForBatch = batches.map((batch) => batch.classId);
      const arraysMatchBatch = await checkIfArraysMatch(
        allClassForBatch,
        classId
      ); //TODO - check batch

      if (arraysMatchBatch === false) {
        return res.status(400).send({
          status: 400,
          message: msg.SELECT_ATLEAST_BATCHTYPE,
        });
      }
    }
    if (subjectId && subjectId !== "all") {
      //NOTE - match subject
      const subjects = await Subject.findAll({
        attributes: ["id", "batchTypeId"],
        where: {
          courseId: courseId,
          boardId: boardId,
          id: {
            [Sequelize.Op.in]: subjectId,
          },
        },
      });

      const allBatchesForSubject = subjects.map((subj) => subj.batchTypeId);
      const arraysMatchSubject = await checkIfArraysMatch(
        allBatchesForSubject,
        batchTypeId
      ); //TODO - check batch
      if (arraysMatchSubject === false) {
        return res.status(400).send({
          status: 400,
          message: msg.SELECT_ATLEAST_SUBJECTS,
        });
      }
    }
    if (chapterId && chapterId !== "all") {
      //NOTE - match chapter
      const chapter = await Chapter.findAll({
        attributes: ["id", "subjectId"],
        where: {
          courseId: courseId,
          boardId: boardId,
          id: {
            [Sequelize.Op.in]: chapterId,
          },
        },
      });

      const allSubjectForChapter = chapter.map((subj) => subj.subjectId);
      const arraysMatchChpater = await checkIfArraysMatch(
        allSubjectForChapter,
        subjectId
      ); //TODO - check batch
      if (arraysMatchChpater === false) {
        return res.status(400).send({
          status: 400,
          message: msg.SELECT_ATLEAST_CHAPTER,
        });
      }
    }
    if (topicId && topicId !== "all") {
      //NOTE - match topic
      const topics = await Topic.findAll({
        attributes: ["id", "chapterId"],
        where: {
          courseId: courseId,
          boardId: boardId,
          id: {
            [Sequelize.Op.in]: topicId,
          },
        },
      });
      const allChapterForTopic = topics.map((topic) => topic.chapterId);
      const arraysMatchTopic = await checkIfArraysMatch(
        allChapterForTopic,
        chapterId
      ); //TODO - check batch
      if (arraysMatchTopic === false) {
        return res.status(400).send({
          status: 400,
          message: msg.SELECT_ATLEAST_TOPIC,
        });
      }
    }

    //NOTE - payload for new content
    let payload = {
      resourceType: tag === "Help Resource" ? resourceType : null,
      tag: tag,
      source: source,
      updatedById: userId
    };

    //thumbnailFile upload
    if (
      thumbnailFile &&
      thumbnailFile.includes("base64") &&
      !thumbnailFile.includes("cloudfront")
    ) {
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

    //NOTE - update contetn data
    await NewContent.update(payload, {
      where: { id: Id },
    });

    //NOTE - delete content form coursecontent map
    await contentCourseMap.destroy({
      where: {
        contentId: Id,
      },
    });

    // //NOTE - create when any value is all
    if (classId === "all") {
      //NOTE - find class based on course and board
      const topics = await Topic.findAll({
        where: {
          courseId: courseId,
          boardId: boardId,
        },
      });
      for (let data of topics) {
        //NOTE - create contetn for course map
        await contentCourseMap.create({
          contentId: Id,
          courseId: data.courseId,
          boardId: data.boardId,
          classId: data.classId,
          batchTypeId: data.batchTypeId,
          subjectId: data.subjectId,
          chapterId: data.chapterId,
          topicId: data.id,
          createdById: contentCreatedById,
          updatedById: userId,
        });
      }
    }
    if (batchTypeId === "all") {
      //NOTE - find topic based on course and board
      const topics = await Topic.findAll({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: {
            [Sequelize.Op.in]: classId,
          },
        },
      });
      for (let data of topics) {
        //NOTE - create contetn for course map
        await contentCourseMap.create({
          contentId: Id,
          courseId: data.courseId,
          boardId: data.boardId,
          classId: data.classId,
          batchTypeId: data.batchTypeId,
          subjectId: data.subjectId,
          chapterId: data.chapterId,
          topicId: data.id,
          createdById: contentCreatedById,
          updatedById: userId,
        });
      }
    }
    if (subjectId === "all") {
      //NOTE - find subject based on course and board
      const topics = await Topic.findAll({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: {
            [Sequelize.Op.in]: classId,
          },
          batchTypeId: {
            [Sequelize.Op.in]: batchTypeId,
          },
        },
      });
      for (let data of topics) {
        //NOTE - create contetn for course map
        await contentCourseMap.create({
          contentId: Id,
          courseId: data.courseId,
          boardId: data.boardId,
          classId: data.classId,
          batchTypeId: data.batchTypeId,
          subjectId: data.subjectId,
          chapterId: data.chapterId,
          topicId: data.id,
          createdById: contentCreatedById,
          updatedById: userId,
        });
      }
    }
    if (chapterId === "all") {
      //NOTE - find subject based on course and board
      const topics = await Topic.findAll({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: {
            [Sequelize.Op.in]: classId,
          },
          batchTypeId: {
            [Sequelize.Op.in]: batchTypeId,
          },
          subjectId: {
            [Sequelize.Op.in]: subjectId,
          },
        },
      });
      for (let data of topics) {
        //NOTE - create contetn for course map
        await contentCourseMap.create({
          contentId: Id,
          courseId: data.courseId,
          boardId: data.boardId,
          classId: data.classId,
          batchTypeId: data.batchTypeId,
          subjectId: data.subjectId,
          chapterId: data.chapterId,
          topicId: data.id,
          createdById: contentCreatedById,
          updatedById: userId,
        });
      }
    }
    if (topicId === "all") {
      //NOTE - find subject based on course and board
      const topics = await Topic.findAll({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: {
            [Sequelize.Op.in]: classId,
          },
          batchTypeId: {
            [Sequelize.Op.in]: batchTypeId,
          },
          subjectId: {
            [Sequelize.Op.in]: subjectId,
          },
          chapterId: {
            [Sequelize.Op.in]: chapterId,
          },
        },
      });
      for (let data of topics) {
        //NOTE - create contetn for course map
        await contentCourseMap.create({
          contentId: Id,
          courseId: data.courseId,
          boardId: data.boardId,
          classId: data.classId,
          batchTypeId: data.batchTypeId,
          subjectId: data.subjectId,
          chapterId: data.chapterId,
          topicId: data.id,
          createdById: contentCreatedById,
          updatedById: userId,
        });
      }
    }
    if (
      classId !== "all" &&
      batchTypeId !== "all" &&
      subjectId !== "all" &&
      chapterId !== "all" &&
      topicId !== "all"
    ) {
      //NOTE - find topic based on course and board
      const finaLTopic = await Topic.findAll({
        where: {
          courseId: courseId,
          boardId: boardId,
          id: {
            [Sequelize.Op.in]: topicId,
          },
        },
      });
      for (let data of finaLTopic) {
        //NOTE - create contetn for course map
        await contentCourseMap.create({
          contentId: Id,
          courseId: data.courseId,
          boardId: data.boardId,
          classId: data.classId,
          batchTypeId: data.batchTypeId,
          subjectId: data.subjectId,
          chapterId: data.chapterId,
          topicId: data.id,
          createdById: contentCreatedById,
          updatedById: userId,
        });
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.CONTENT_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//ANCHOR: get content by chapterId or subjectId
const getLearnContentById = async (req, res) => {
  try {
    const { subjectId, chapterId, category } = req.body;

    let allTopic = [];
    //NOTE - user id from token
    const userId = req.user.id;

    //NOTE - find user details
    const user_details = await UserDetails.findOne({
      where: { id: userId, type: "Student" },
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

    //NOTE - get chapter
    const getChapter = await Chapter.findOne({
      where: {
        subjectId: subjectId,
      },
      order: [["createdAt", "ASC"]],
    });
    //NOTE - user package check
    const packages = await studentPackages.findOne({
      where: {
        userId: userId,
        batchTypeId: getChapter.batchTypeId,
      },
    });

    //NOTE - get all content
    const array = await contentCourseMap.findAll({
      where: {
        courseId: user_details.student?.courseId,
        boardId: user_details.student?.boardId,
        classId: user_details.student?.classId,
        batchTypeId: user_details.student?.batchTypeId,
        ...subjectParams,
        ...chapterParams,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: NewContent,
          attributes: [
            "id",
            "source",
            "sourceFile",
            "thumbnailFile",
            "resourceType",
            "tag",
          ],
          where: {
            ...query,
            sourceFile: {
              [Op.not]: null, //NOTE - null sourceFIle can be neglated
            },
          },
        },
        {
          model: batchType,
          attributes: ["name"],
        },
        {
          model: Subject,
          attributes: ["name"],
        },
        {
          model: Chapter,
          attributes: ["name"],
        },
        {
          model: Topic,
          attributes: ["name"],
        },
      ],
      order: [["id", "DESC"]],
    });


    // NOTE - Get unique by topic id only tag is learning content
    const uniqueMap = new Map();
    for (const item of array) {
      if (item.new_content.tag === "Learning Content") {
        const existingItem = uniqueMap.get(item.topicId);
        if (!existingItem || item.ORDERSEQ >= existingItem.ORDERSEQ) {
          uniqueMap.set(item.topicId, item);
        }
      } else {
        uniqueMap.set(item.contentId, item);
      }
    }
    const uniqueArray = [...uniqueMap.values()].sort();

    //NOTE - Custom sorting function
    uniqueArray.sort((a, b) => {
      // If the order is 0, b comes first
      if (a.ORDERSEQ === 0) return 1;
      if (b.ORDERSEQ === 0) return -1;

      //NOTE - asending wise sort
      return a.ORDERSEQ - b.ORDERSEQ;
    });

    let count = 1;
    for (let data of uniqueArray) {
      //NOTE - category is null or undefined
      if (data !== null) {
        const bookmarks = await Bookmark.findOne({
          where: {
            typeId: data && data?.contentId ? data?.contentId : null,
            subjectId: data.subjectId,
            bookmarkType: "video",
            userId: userId,
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
          tag: data?.new_content?.tag,
          videoId: data?.contentId,
          thumbnail:
            data?.new_content?.tag === "Help Resource" &&
              data.new_content?.thumbnailFile === null
              ? await getSignedUrlCloudFront(
                HelpResourcedefaultImages.HelpResource[0].image
              )
              : data?.new_content?.tag === "Help Resource" &&
                data.new_content?.thumbnailFile !== null
                ? await getSignedUrlCloudFront(data?.new_content?.thumbnailFile) : data.new_content.tag === "Learning Content" &&
                  data?.thumbnailFile !== null
                  ? await getSignedUrlCloudFront(data?.new_content?.thumbnailFile)
                  : null,
          bookmark:
            bookmarks && bookmarks?.bookmark ? bookmarks?.bookmark : false,
          source: data.new_content?.source ? data.new_content?.source : null,
          resourceType: data.new_content?.resourceType
            ? data.new_content?.resourceType
            : "",
          sourceFile:
            data?.new_content?.sourceFile &&
              data.new_content?.resourceType === "video"
              ? await cloudFrontM3u8Converter(converterType(data?.sourceFile))
              : data?.new_content?.sourceFile
                ? await getSignedUrlCloudFront(data?.new_content?.sourceFile)
                : null,
          originalSource: data?.new_content?.sourceFile
            ? await getSignedUrlCloudFront(data?.new_content?.sourceFile)
            : null,
          downloadSource:
            data?.new_content?.sourceFile &&
              data.new_content?.resourceType === "video"
              ? await cloudFrontM3u8Converter(
                replaceDirectoryInPath(data?.new_content?.sourceFile)
              )
              : data?.new_content?.sourceFile
                ? await getSignedUrlCloudFront(data?.new_content?.sourceFile)
                : null, //TODO - only for download
          sequence: data.ORDERSEQ,
          lockStatus: packages ? false : count == 1 ? false : true
        });
      }
      count++;
    }

    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      packagePurcahsed: packages ? true : false,
      data: allTopic,
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    await create_error.create({
      status: statusCode,
      message: err.message,
      route: req.url,
      userId: 1,
      stack: JSON.stringify(err.stack),
    });
    return res
      .status(500)
      .send({ status: 500, message: "Something Went Wrong!" });
  }
};

//ANCHOR:  get syllabus content by topic id
const getSyllabContentByTopicId = async (req, res) => {
  try {
    let result = [];
    const { topicId } = req.query;

    //NOTE - id from decode token
    const userId = req.user.id;

    //NOTE - convert source name
    const sources = {
      youtube: "youtube",
      upload: "video",
      gallerymanager: "video",
    };

    //NOTE - get all content
    const getContent = await contentCourses(topicId);

    for (let allContents of getContent) {
      //NOTE - source file
      let originalSource;
      let downloadSource;
      let sourceFiles;
      if (allContents?.new_content?.source !== "youtube") {
        (originalSource =
          allContents?.new_content?.sourceFile !== null
            ? await getSignedUrlCloudFront(allContents?.new_content?.sourceFile)
            : null), //TODO - without w3u8,
          (sourceFiles =
            allContents?.new_content?.sourceFile !== null
              ? await cloudFrontM3u8Converter(
                converterType(allContents?.new_content?.sourceFile)
              )
              : null); //TODO - with w3u8
        downloadSource =
          allContents?.new_content?.sourceFile !== null
            ? await cloudFrontM3u8Converter(
              replaceDirectoryInPath(allContents?.new_content?.sourceFile)
            )
            : null; //TODO - only for download
      } else {
        originalSource =
          allContents?.new_content?.sourceFile !== null
            ? allContents?.new_content?.sourceFile
            : null,
          sourceFiles =
          allContents?.new_content?.sourceFile !== null
            ? allContents?.new_content?.sourceFile : null,
          downloadSource =
          allContents?.new_content?.sourceFile !== null
            ? allContents?.new_content?.sourceFile : null;
      }

      //NOTE - thumbnail file
      const thumbnails =
        allContents.new_content.tag === "Help Resource" &&
          allContents?.new_content?.thumbnailFile === null
          ? await getSignedUrlCloudFront(
            HelpResourcedefaultImages.HelpResource[0].image
          )
          : allContents.new_content.tag === "Learning Content" &&
            allContents?.new_content?.thumbnailFile !== null
            ? await getSignedUrlCloudFront(
              allContents?.new_content?.thumbnailFile
            )
            : null;

      //NOTE - checking bookmark status
      let bookmarks;
      if (allContents !== null) {
        try {
          bookmarks = await Bookmark.findOne({
            where: {
              typeId: allContents.contentId,
              bookmarkType: "video",
              userId: userId,
            },
            attributes: ["bookmark"],
          });
        } catch (err) {
          bookmarks = bookmarks;
        }
      }

      //NOTE - final push
      result.push({
        id: allContents.contentId,
        topicId: allContents.topicId,
        topic: allContents?.topic?.name,
        chapterId: allContents.chapterId,
        chapterName: allContents?.chapter?.name,
        subjectId: allContents.subjectId,
        subject: allContents?.subject?.name,
        tag: allContents?.new_content?.tag,
        source: sources[allContents?.new_content?.source],
        sourceFile: sourceFiles ? sourceFiles : null,
        originalSource: originalSource ? originalSource : null, //TODO - without w3u8,
        downloadSource: downloadSource ? downloadSource : null,
        resourceType: allContents?.new_content?.resourceType
          ? allContents?.new_content?.resourceType
          : "",
        thumbnailFile: thumbnails ? thumbnails : null,
        bookmark:
          bookmarks && bookmarks?.bookmark ? bookmarks?.bookmark : false,
        youtubeVideoId: allContents?.new_content?.source === "youtube"
          ? await getYouTubeVideoId(allContents?.new_content?.sourceFile)
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

//ANCHOR: get content resume learning by subject and chapter it
const resumeLearn = async (req, res) => {
  try {
    let allTopic = [];
    const { subjectId, chapterId } = req.query;

    //NOTE - id from token
    const userId = req.user.id; //test user  373

    //NOTE - find user details
    const user_details = await UserDetails.findOne({
      where: { id: userId, type: "Student" },
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
        userId: userId,
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
      group: ["videoId", "subjectId"],
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
      const array = await contentCourseMap.findOne({
        where: {
          contentId: data.videoId,
          courseId: user_details.student?.courseId,
          boardId: user_details.student?.boardId,
          classId: user_details.student?.classId,
          batchTypeId: user_details.student?.batchTypeId,
          ...subjectParams,
          ...chapterParams,
        },
        include: [
          {
            model: NewContent,
            attributes: ["thumbnailFile"],
          },
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
            typeId:
              array?.contentId && array?.contentId ? array?.contentId : null,
            bookmarkType: "video",
            userId: userId,
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
          videoId: array?.contentId,
          thumbnail: array
            ? await getSignedUrlCloudFront(array?.new_content?.thumbnailFile)
            : null,
          bookmark:
            bookmarks?.bookmark && bookmarks?.bookmark
              ? bookmarks?.bookmark
              : false,
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

//ANCHOR - delete syllabus videos
const deleteSyllabusContent = async (req, res) => {
  try {
    const getContent = await NewContent.findOne({
      where: { id: req.params.id },
    });
    if (!getContent)
      return res
        .status(400)
        .send({ status: 400, message: msg.SYLLABUS_NOT_FOUND });

    //NOTE - delete shorts data form bookmarks
    await Bookmark.destroy({
      where: {
        typeId: req.params.id,
        bookmarkType: "video",
      },
    });

    //NOTE - delete shorts data form recent activity
    await recentActivityDetails.destroy({
      where: {
        videoId: req.params.id,
      },
    });

    //NOTE - delete shorts course map form content course map
    await contentCourseMap.destroy({
      where: {
        contentId: req.params.id,
      },
    });

    //NOTE - delete data form main content table
    await NewContent.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res
      .status(200)
      .send({ status: 200, message: msg.SYLLABUS_CONTENT_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};


//ANCHOR: update syllabus content sequence number
const updateContentSequence = async (req, res) => {
  try {
    const {
      subjectId,
      chapterId,
      topicId,
      Id,
      sequence
    } = req.body;

    //NOTE - creator id form decode token
    const userId = req.user.id;

    if (sequence !== 0) {
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
      if (TopicData && TopicData.contentId !== Id) {
        return res
          .status(400)
          .send({ status: 400, message: msg.SEQUENCE_EXIST_ON_TOPIC });
      }

      //NOTE - finding sequence number already exist on this subject and chapter
      const checkingChapterData = await contentCourseMap.findOne({
        //attributes: ["ORDERSEQ"],
        where: {
          subjectId: subjectId,
          chapterId: chapterId,
          ORDERSEQ: {
            [Op.and]: [
              {
                [Op.eq]: sequence, // Check if ORDERSEQ is equal to the specified sequence
              },
              {
                [Op.not]: 0, // Exclude records where ORDERSEQ is equal to 0
              },
            ],
          },
        },
      });
      if (checkingChapterData && checkingChapterData.contentId !== Id) {
        return res
          .status(400)
          .send({ status: 400, message: msg.SEQUENCE_EXIST_ON_CHAPTER });
      }
    }

    //NOTE - update sequence number
    await contentCourseMap.update({ ORDERSEQ: sequence, updatedById: userId, updatedAt: new Date() }, {
      where: {
        subjectId: subjectId,
        chapterId: chapterId,
        topicId: topicId,
        contentId: Id
      }
    });
    //NOTE - final response
    return res.status(200).send({
      status: 200,
      message: msg.SEQUENCE_NUMBER_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};


module.exports = {
  addNewContent,
  getAllContent,
  getSubjectByMultipleClassBatch,
  getChapterByMultipleSubject,
  getTopicByMultipleChapter,
  getContecntById,
  updateContentById,
  getLearnContentById,
  getSyllabContentByTopicId,
  resumeLearn,
  deleteSyllabusContent,
  updateContentSequence
};
