const db = require("../../models/index");
const msg = require("../../constants/Messages");
const _ = require("lodash");
const { Sequelize, Op } = require("sequelize");
const Chapter = db.chapter;
const Subject = db.subject;
const batchType = db.batchTypes;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;
const Syllabus = db.syllabus;
const Topic = db.topic;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const RolePermission = db.permissionRole;
const recentActivityDetails = db.recentActivity;
const NewContent = db.new_content;
const contentCourseMap = db.content_course_map;
const Bookmark = db.bookmark;

//ANCHOR add Topic
const addTopic = async (req, res) => {
  try {
    const {
      courseId,
      boardId,
      classId,
      batchTypeId,
      subjectId,
      chapterId,
      syllabus,
      name,
      // video,
      // thumbnail,
      // time,
    } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    const Topics = await Topic.findOne({
      where: {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
        subjectId: subjectId,
        chapterId: chapterId,
        name: name,
        createdById: token,
      },
    });
    if (Topics)
      return res.status(400).send({
        status: 400,
        message:
          "Topic already exist with course,board,class,batchType,subject and topicName",
      });

    const newTopic = new Topic({
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      subjectId: subjectId,
      chapterId: chapterId,
      name: name,
    });
    const createdTopic = await newTopic.save();
    for (let data of syllabus) {
      const newSyllabus = new Syllabus({
        topicId: createdTopic.id,
        video: data.video,
        time: data.time,
        name: data.name,
      });
      await newSyllabus.save();
    }

    return res.status(200).send({
      status: 200,
      message: msg.TOPIC_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR :get topic by id
const getTopicById = async (req, res) => {
  try {
    const getTopic = await Topic.findOne({
      where: {
        id: req.params.id,
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
          model: Subject,
          attributes: ["name"],
        },
        {
          model: Chapter,
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!getTopic)
      return res.status(400).send({
        status: 400,
        message: msg.TOPIC_NOT_FOUND,
      });

    //NOTE - Push final data
    let allTopics = {
      id: getTopic.id,
      name: getTopic.name,
      courseId: getTopic.courseId,
      course: getTopic.course?.name,
      boardId: getTopic.boardId,
      board: getTopic.board?.name,
      classId: getTopic.classId,
      class: getTopic.class?.name,
      batchTypeId: getTopic.batchTypeId,
      batchType: getTopic.batchType?.name,
      subjectId: getTopic.subjectId,
      subject: getTopic.subject?.name,
      chapterId: getTopic.chapterId,
      chapterName: getTopic.name,
      status: getTopic.status,
      createdAt: getTopic.createdAt,
      updatedAt: getTopic.updatedAt,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allTopics,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get chapter by all ids
const getTopicByChapterId = async (req, res) => {
  try {
    let allTopic = [];
    const { chapterId } = req.body;

    //NOTE - Find  chapter details
    const getChapter = await Chapter.findOne({
      where: {
        id: chapterId,
      },
    });

    if (!getChapter)
      return res.status(400).send({
        status: 400,
        message: msg.CHAPTER_NOT_FOUND,
      });

    //NOTE - Find all topic details
    const getTopic = await Topic.findAll({
      where: {
        courseId: getChapter.courseId,
        boardId: getChapter.boardId,
        classId: getChapter.classId,
        batchTypeId: getChapter.batchTypeId,
        subjectId: getChapter.subjectId,
        chapterId: chapterId,
        status: 1
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
          model: Subject,
          attributes: ["name"],
        },
        {
          model: Chapter,
          attributes: ["name"],
        },
      ],
    });

    if (!getTopic)
      return res
        .status(400)
        .send({ status: 400, message: msg.TOPIC_NOT_FOUND });

    //NOTE - Push final result
    for (let data of getTopic) {
      allTopic.push({
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
        chapterName: data.name,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
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

//ANCHOR : get all topics
const getAllTopics = async (req, res) => {
  try {
    const { page, limit, classes, search, subject, chapter, status } = req.query;
    //NOTE - add pagination
    const query =
      page && limit
        ? {
          offset: Number(page - 1) * limit,
          limit: Number(limit),
        }
        : {};

    //NOTE - subject filter
    const subjectParams = subject ? { subjectId: subject } : {};

    //NOTE - chapter filter
    const chapterParams = chapter ? { chapterId: chapter } : {};

    //NOTE - check status if all then return only status 1
    const value = status === "all" ? undefined : status === "active" ? { status: 1 } : status === "inactive" ? { status: 0 } : { status: 1 };


    //NOTE Class and search filter
    const searchValue = {
      ...(classes ? { classId: classes } : {}),
      ...(search ? { name: { [Op.like]: "%" + search + "%" } } : {}),
    };

    //NOTE - If login by a teacher or mentor
    let teacherParams;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const subject_details = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
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

        //NOTE : Conditionally assign value to params based on batchIds
        teacherParams = batchIds.every((id) => id === null)
          ? {
            classId: {
              [Sequelize.Op.in]: classesIds,
            },
          }
          : {
            batchTypeId: {
              [Sequelize.Op.in]: batchIds,
            },
          };
      }

    const { rows, count } = await Topic.findAndCountAll({
      ...query,
      where: {
        ...searchValue,
        ...chapterParams,
        ...subjectParams,
        ...teacherParams,
        ...value
      },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
        { model: batchType, attributes: ["id", "name"] },
        { model: Subject, attributes: ["name"] },
        { model: Chapter, attributes: ["name"] },
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

    if (!rows)
      return res
        .status(200)
        .send({ status: 200, message: msg.TOPIC_NOT_FOUND, data: [] });

    const result = rows.map((allTopic) => ({
      id: allTopic.id,
      name: allTopic?.name,
      courseId: allTopic.courseId,
      course: allTopic.course?.name,
      boardId: allTopic.boardId,
      board: allTopic.board?.name,
      classId: allTopic.classId,
      class: allTopic.class?.name,
      batchTypeId: allTopic.batchTypeId,
      batchType: allTopic.batchType?.name,
      subjectId: allTopic.subjectId,
      subject: allTopic.subject?.name,
      chapterId: allTopic.chapterId,
      chapterName: allTopic.chapter?.name,
      status: allTopic.status,
      createdByName: allTopic.creator ? allTopic.creator?.name : null,
      createdByRole: allTopic.creator
        ? allTopic.creator?.permission_role?.role
        : null,
      updateByName: allTopic.updater ? allTopic.updater?.name : null,
      updateByRole: allTopic.updater
        ? allTopic.updater?.permission_role.role
        : null,
      createdAt: allTopic.createdAt,
      updatedAt: allTopic.updatedAt,
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

//ANCHOR : update topics
const updateTopicById = async (req, res) => {
  try {
    const {
      courseId,
      boardId,
      classId,
      batchTypeId,
      subjectId,
      chapterId,
      topicId,
      name,
      syllabus,
      video,
      time,
    } = req.body;

    const getTopic = await Topic.findOne({
      where: { id: topicId },
    });
    if (!getTopic)
      return res
        .status(400)
        .send({ status: 400, message: msg.TOPIC_NOT_FOUND });

    let obj1 = {
      courseId: getTopic.courseId,
      boardId: getTopic.boardId,
      classId: getTopic.classId,
      batchTypeId: getTopic.batchTypeId,
      subjectId: subjectId,
      chapterId: chapterId,
      name: getTopic.name,
    };

    let obj2 = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      subjectId: subjectId,
      chapterId: chapterId,
      name: name,
    };

    if (!_.isEqual(obj1, obj2)) {
      const topicsData = await Topic.findOne({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
          name: name,
        },
      });
      if (topicsData)
        return res.status(400).send({
          status: 400,
          message:
            "Topic already exist with course,board,class,batchType,subject and topicName.",
        });
    }

    let payload = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      subjectId: subjectId,
      chapterId: chapterId,
      name: name,
    };

    await Topic.update(payload, {
      where: { id: topicId },
    });

    for (let data of syllabus) {
      const getSyllabus = await Syllabus.findOne({
        where: { id: data.id },
      });

      if (!getSyllabus) {
        const newSyllabus = new Syllabus({
          topicId: topicId,
          video: data.video,
          time: data.time,
          name: data.name,
        });
        await newSyllabus.save();
      } else {
        await Syllabus.update(
          {
            topicId: topicId,
            video: data.video,
            time: data.time,
            name: data.name,
          },
          { where: { id: data.id } }
        );
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.TOPIC_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete topics
const deleteTopics = async (req, res) => {
  try {
    const getTopic = await Topic.findOne({
      where: { id: req.params.id },
    });
    if (!getTopic)
      return res
        .status(400)
        .send({ status: 400, message: msg.TOPIC_NOT_FOUND });

    //NOTE - get all content of topicId 
    const courseMap = await contentCourseMap.findAll({
      where: { topicId: req.params.id },
      attributes: ["contentId", "topicId"]
    });

    //NOTE - get all topicId cascading video Id
    let videoId = [];
    for (let data of courseMap) {
      videoId.push(data.contentId)
    }

    // Deleting videos from bookmarks table
    await Bookmark.destroy({
      where: {
        bookmarkType: "video",
        typeId: videoId
      }
    })

    // Deleting videosId from recentactivity
    await recentActivityDetails.destroy({
      where: {
        videoId: videoId
      }
    })

    // Deleting videos from contetncoures map
    await contentCourseMap.destroy({
      where: {
        contentId: videoId
      }
    })

    // Deleting videos from content table
    await NewContent.destroy({
      where: {
        id: videoId
      }
    })

    // Deleting topicId from topic table
    await Topic.destroy({
      where: {
        id: req.params.id
      }
    })

    return res.status(200).send({ status: 200, message: msg.TOPIC_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};


//ANCHOR : add Syllabus Topic
const addSyllabusTopic = async (req, res) => {
  try {
    const {
      courseId,
      boardId,
      classId,
      batchTypeId,
      subjectId,
      chapterId,
      name,
    } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    const Topics = await Topic.findOne({
      where: {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
        subjectId: subjectId,
        chapterId: chapterId,
        name: name,
      },
    });
    if (Topics)
      return res.status(400).send({
        status: 400,
        message: msg.TOPIC_ALREADY_EXIST,
      });

    const newTopic = await Topic.create({
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      subjectId: subjectId,
      chapterId: chapterId,
      name: name.replace(/\s+/g, " ").trim(),
      createdById: token,
    });

    return res.status(200).send({
      status: 200,
      message: msg.TOPIC_CREATED,
      data: newTopic,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: update syllabus topics
const updateSyllabusTopicById = async (req, res) => {
  try {
    const {
      courseId,
      boardId,
      classId,
      batchTypeId,
      subjectId,
      chapterId,
      topicId,
      name,
    } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    //NOTE: Find topic details
    const getTopic = await Topic.findOne({
      where: { id: topicId },
    });

    if (!getTopic)
      return res
        .status(400)
        .send({ status: 400, message: msg.TOPIC_NOT_FOUND });

    //NOTE - find data from db
    let dbObject = {
      courseId: getTopic.courseId,
      boardId: getTopic.boardId,
      classId: getTopic.classId,
      batchTypeId: getTopic.batchTypeId,
      subjectId: subjectId,
      chapterId: chapterId,
      name: getTopic.name.toLowerCase(),
    };

    //NOTE -data given by the user
    let userObject = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      subjectId: subjectId,
      chapterId: chapterId,
      name: name.toLowerCase(),
    };

    //NOTE - payload for push data
    let payload = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      subjectId: subjectId,
      chapterId: chapterId,
      name: name.replace(/\s+/g, " ").trim(),
      updatedById: token,
    };

    //NOTE - If same name is coming update it
    if (dbObject.name === userObject.name) {
      await Topic.update(payload, {
        where: { id: topicId },
      });
    } else {
      //NOTE - if different name is check topic is already exist or not
      const Topics = await Topic.findOne({
        where: {
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
          subjectId: subjectId,
          chapterId: chapterId,
          name: name,
        },
      });
      if (Topics) {
        return res.status(400).send({
          status: 400,
          message: msg.TOPIC_ALREADY_EXIST,
        });
      } else {
        //NOTE - if topic not found update it
        await Topic.update(payload, {
          where: { id: topicId },
        });
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.TOPIC_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: update subject status
const updateTopicStatus = async (req, res) => {
  try {
    const { status, topicId } = req.body;

    //NOTE - userId from token
    const userId = req.user.id;

    const getTopic = await Topic.findOne({
      where: { id: topicId },
    });
    if (!getTopic)
      return res
        .status(400)
        .send({ status: 400, message: msg.TOPIC_NOT_FOUND });

    //NOTE - payload for push data
    let payload = {
      status: status,
      updatedById: userId,
    };

    //NOTE - update status
    await Topic.update(payload, {
      where: { id: topicId },
    });

    return res.status(200).send({
      status: 200,
      message: msg.TOPIC_STATUS_UPDATE,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};





module.exports = {
  addTopic,
  getTopicById,
  getTopicByChapterId,
  getAllTopics,
  updateTopicById,
  deleteTopics,
  addSyllabusTopic,
  updateSyllabusTopicById,
  updateTopicStatus
};
