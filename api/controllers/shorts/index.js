const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Response } = require("../../helpers/response.helper");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const getSignedUrl = require("../../helpers/getSignedUrl");
const {
  getSignedUrlCloudFront,
  cloudFrontM3u8Converter,
  getYouTubeVideoId
} = require("../../helpers/cloudFront");
const { converterType } = require("../../helpers/service");
const { Sequelize, Op } = require("sequelize");
const Shorts = db.shorts;
const Course = db.courses;
const Subject = db.subject;
const batchType = db.batchTypes;
const Boards = db.boards;
const Class = db.class;
const User = db.users;
const Student = db.student;
const shorts_like_map = db.shorts_like_map;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const RolePermission = db.permissionRole;
const shortsCourseMap = db.shorts_course_map;

//ANCHOR - add Shorts
const addShorts = async (req, res) => {
  try {
    const { subjectIds, video, thumbnail, title, source } = req.body;

    //NOTE - id from tokens
    const userId = req.user.id;

    let payload = {
      title: title,
      video: video,
      source: source,
      createdById: userId,
    };

    //NOTE - image upload
    if (thumbnail && thumbnail.includes("base64")) {
      const uploadImage = await uploadFileS3(
        thumbnail,
        msg.SHORTS_FOLDER_CREATED
      );
      payload = { ...payload, thumbnail: uploadImage.Key };
    }
    console.log("come");
    const newShorts = new Shorts(payload);
    const getShorts = await newShorts.save();

    //NOTE - creating shorts for muliple batches with subjects
    for (const id of subjectIds) {
      //NOTE - find subject details
      const findSubject = await Subject.findOne({
        where: {
          id: id,
        },
      });

      //NOTE: maping shorts with course, board,subjects
      await shortsCourseMap.create({
        shortsId: getShorts.id,
        courseId: findSubject.courseId,
        boardId: findSubject.boardId,
        classId: findSubject.classId,
        batchTypeId: findSubject.batchTypeId,
        subjectId: findSubject.id,
        createdById: userId,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.SHORTS_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR -  get shorts by id
const getShortsById = async (req, res) => {
  try {
    const shortsId = req.params.id; //TODO - shorts Id
    let classes = [];
    let batches = [];
    let subjects = [];

    //NOTE - only shorts
    const getOnlyShorts = await Shorts.findOne({
      where: {
        id: shortsId,
      },
    });

    //NOTE - get all data by shortsid from course shorts map
    const getShorts = await shortsCourseMap.findAll({
      where: { shortsId: shortsId },
      include: [
        { model: Shorts, attributes: ["title", "video", "view", "thumbnail", "source"] },
        { model: Course, attributes: ["id", "name"] },
        { model: Boards, attributes: ["id", "name"] },
        { model: Class, attributes: ["id", "name"] },
        { model: batchType, attributes: ["id", "name"] },
        { model: Subject, attributes: ["id", "name"] },
      ],

      order: [["createdAt", "DESC"]],
    });

    if (!getShorts)
      return res
        .status(400)
        .send({ status: 400, message: msg.SHORTS_NOT_FOUND });

    for (let data of getShorts) {
      //NOTE - push all class details
      classes.push({
        classId: data.class.id,
        className: data.class.name,
      });

      //NOTE - push all batch details
      batches.push({
        batchTypeId: data.batchType.id,
        batchTypeName: data.batchType.name,
      });

      //NOTE - push all subject details
      subjects.push({
        subjectId: data.subject.id,
        subjectName: data.subject.name,
      });
    }

    //NOTE - Get class
    const classkey = "classId";
    const uniqueClasses = [
      ...new Map(classes.map((item) => [item[classkey], item])).values(),
    ];

    //NOTE - Get batch
    const batchkey = "batchId";
    const uniqueBatch = [
      ...new Map(batches.map((item) => [item[batchkey], item])).values(),
    ];

    //NOTE - Get subject
    const subjectkey = "subjectId";
    const uniqueSubject = [
      ...new Map(subjects.map((item) => [item[subjectkey], item])).values(),
    ];

    //NOTE - final push
    let result = {
      id: shortsId,
      courseId: getShorts[0]?.courseId,
      course: getShorts[0]?.course?.name,
      boardId: getShorts[0]?.boardId,
      board: getShorts[0]?.board?.name,
      classes: uniqueClasses,
      batch: uniqueBatch,
      subject: uniqueSubject,
      title: getOnlyShorts?.title,
      video: getShorts[0]?.short?.source === "youtube" ? getOnlyShorts?.video : await getSignedUrlCloudFront(getOnlyShorts?.video),
      thumbnail: await getSignedUrlCloudFront(getOnlyShorts?.thumbnail),
      source: getShorts[0]?.short?.source,
    };

    //NOTE - final return
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return Response(res, 500, err.message);
  }
};

//ANCHOR - get all shorts
const getAllShorts = async (req, res) => {
  try {
    const { page, limit, subjects, search, classes } = req.query;
    let result = [];

    let classeArray = [];
    let batchArray = [];
    let subjectArray = [];

    //NOTE - add pagination
    const query =
      page && limit
        ? {
          offset: Number(page - 1) * limit,
          limit: Number(limit),
        }
        : {};

    //NOTE - filter by subjectId
    const subjectParams = subjects ? { subjectId: subjects } : null;

    //NOTE - filter by title

    let titleParams = search
      ? { title: { [Op.like]: "%" + search + "%" } }
      : null;

    //NOTE - filter by  class Id
    let classParams = classes ? { classId: classes } : null;

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
        const ClassIds = subject_details.map((item) => item.dataValues.classId);
        //NOTE - push all batch ids
        const batchIds = subject_details.map(
          (item) => item.dataValues.batchTypeId
        );

        if (batchIds.every((id) => id === null)) {
          //NOTE - filter based on classId only
          params = {
            classId: {
              [Sequelize.Op.in]: ClassIds,
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

    //NOTE - get all shorts from table
    const getShorts = await shortsCourseMap.findAndCountAll({
      attributes: [
        ["shortsId", "shortsId"],
        [
          Sequelize.fn("MAX", Sequelize.col("shorts_course_map.createdAt")),
          "latestCreatedAt",
        ],
      ],
      include: [
        {
          model: Shorts,
          attributes: [],
          where: titleParams, //TODO - filter based on shorts titles
        },
      ],
      where: { ...query.where, ...subjectParams, ...classParams, ...params }, //TODO - filter based on subject, class and if login with teacher .Filter based on teachers batch type
      group: ["shortsId"],
      offset: query.offset || 0,
      limit: query.limit || 10,
      order: [[Sequelize.literal("latestCreatedAt"), "DESC"]],
    });

    if (!getShorts)
      return res
        .status(400)
        .send({ status: 400, message: msg.SHORTS_NOT_FOUND });

    for (const data of getShorts.rows) {
      //NOTE - get all data by shortsid from course shorts map
      const allData = await shortsCourseMap.findAll({
        where: { shortsId: data.shortsId },
        include: [
          {
            model: Shorts,
            attributes: ["title", "video", "view", "thumbnail", "source"],
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
      });

      for (const values of allData) {
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

      //NOTE - Get unique batch
      const subjectkey = "subjectId";
      const uniqueSubject = [
        ...new Map(
          subjectArray.map((item) => [item[subjectkey], item])
        ).values(),
      ];

      //NOTE: push final result
      result.push({
        id: data.shortsId,
        title: allData[0]?.short?.title,
        video: allData[0]?.short?.source === "youtube" ? allData[0]?.short?.video : allData[0]?.short?.video
          ? await getSignedUrlCloudFront(allData[0]?.short?.video)
          : null,
        thumbnail: allData[0]?.short?.thumbnail
          ? await getSignedUrlCloudFront(allData[0]?.short?.thumbnail)
          : null,
        courseName: allData[0]?.course?.name,
        boardName: allData[0]?.board?.name,
        class: uniqueClasses,
        batchType: uniqueBatch,
        subject: uniqueSubject,
        createdByName: allData[0].creator ? allData[0].creator?.name : null,
        createdByRole: allData[0].creator
          ? allData[0].creator?.permission_role?.role
          : null,
        updateByName: allData[0].updater ? allData[0].updater?.name : null,
        updateByRole: allData[0].updater
          ? allData[0].updater?.permission_role.role
          : null,
        createdAt: allData[0].createdAt,
        source: allData[0]?.short?.source,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getShorts.count.length,
      data: result,
    });
  } catch (err) {
    console.log(err);
    return Response(res, 500, err.message);
  }
};

//ANCHOR -  get shorts by id
const getOneShortsByStudentId = async (req, res) => {
  try {
    const { shortsId } = req.body;

    //NOTE - get student id from token
    const studentId = req.user.id;

    //NOTE - getting user details
    const userDetails = await User.findOne({
      where: {
        id: studentId,
        type: "Student",
      },
    });
    if (!userDetails)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    //NOTE - find shorts details
    const getShorts = await Shorts.findOne({
      where: {
        id: shortsId,
      },
      attributes: ["id", "title", "video", "thumbnail", "view", "source"],
    });
    if (!getShorts)
      return res
        .status(400)
        .send({ status: 400, message: msg.SHORTS_NOT_FOUND });

    //NOTE - checking user like details
    const shortsLikeMap = await shorts_like_map.findOne({
      where: { studentId: userDetails.id, shortsId: shortsId },
    });

    //NOTE - push final result
    let response = {
      id: getShorts.id,
      title: getShorts.title,
      video: getShorts.source === "youtube" ? getShorts.video : getShorts.video
        ? await getSignedUrlCloudFront(getShorts.video)
        : null,
      thumbnail: getShorts.thumbnail
        ? await getSignedUrl(getShorts.thumbnail)
        : null,
      like: shortsLikeMap?.like === true ? true : false,
      view: getShorts.view,
      source: getShorts.source,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: response,
    });
  } catch (err) {
    return Response(res, 500, err.message);
  }
};

//ANCHOR - shorts by subject id
const getShortsBySubjectId = async (req, res) => {
  try {
    let getAllShorts = [];
    const { subjectId, courseId, boardId, classId, batchTypeId } = req.body;
    const getShorts = await Shorts.findAndCountAll({
      where: {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
        subjectId: subjectId,
      },
      attributes: ["id", "title", "video"],
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
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!getShorts) {
      return res
        .status(400)
        .send({ status: 400, message: msg.SHORTS_NOT_FOUND });
    }

    for (const allShorts of getShorts.rows) {
      const video = await getSignedUrl(allShorts.dataValues.video);
      getAllShorts.push({
        id: allShorts.id,
        courseId: allShorts.courseId,
        boardId: allShorts.boardId,
        classId: allShorts.classId,
        batchTypeId: allShorts.batchTypeId,
        subjectId: getShorts.subjectId,
        title: allShorts.title,
        video: video,
        course: allShorts.course.name,
        board: allShorts.board.name,
        class: allShorts.class.name,
        batchType: allShorts.batchType.name,
        subject: allShorts.subject.name,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getShorts.count,
      data: getAllShorts,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - shorts by student id
const getShortsByStudentId = async (req, res) => {
  try {
    const { subjectId, type } = req.body;

    //NOTE - get studentId  from token
    const studentId = req.user.id;

    let getAllShorts = [];

    let query;
    if (subjectId) {
      //NOTE - check subject details
      const checkSubject = await Subject.findOne({
        where: { id: subjectId },
      });

      //NOTE - if isAllSubject is true
      if (checkSubject?.isAllSubject === 1) {
        query = undefined;
      } else {
        query = {
          id: subjectId,
        };
      }
    }

    //NOTE - TESTING REQUIRED FOR DATE FILTER
    let val;
    if (type === "new") {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() - 6 * 24 * 60 * 60 * 1000);
      val = {
        createdAt: {
          [Sequelize.Op.gte]: endDate,
          [Sequelize.Op.lte]: startDate,
        },
      };
    } else {
      val = {};
    }

    //NOTE : check user details
    const userDetails = await User.findOne({
      where: {
        id: studentId,
        type: "Student",
      },
      include: {
        model: Student,
        attributes: ["courseId", "boardId", "classId", "batchTypeId"],
      },
    });

    if (!userDetails)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    //NOTE - get all shorts details
    const getShorts = await shortsCourseMap.findAndCountAll({
      where: {
        courseId: userDetails.student?.courseId,
        boardId: userDetails.student?.boardId,
        classId: userDetails.student?.classId,
        batchTypeId: userDetails.student?.batchTypeId,
        ...val,
      },
      include: [
        {
          model: Shorts,
          attributes: ["title", "video", "view", "thumbnail", "createdAt", "source"],
        },
        {
          model: Class,
          attributes: ["name"],
        },
        {
          model: Subject,
          attributes: ["id", "name"],
          where: query, //TODO - subject filter
        },
      ],

      order: [["createdAt", "DESC"]],
    });
    if (!getShorts)
      return res
        .status(200)
        .send({ status: 200, message: msg.FOUND_DATA, data: [] });

    //NOTE - Get unique shorts 
    const shortskey = "shortsId";
    const uniqueShorts = [
      ...new Map(getShorts.rows.map((item) => [item[shortskey], item])).values(),
    ];

    for (const allShorts of uniqueShorts) {
      //NOTE - get user all like shorts
      const shortsLikeMap = await shorts_like_map.findOne({
        where: {
          studentId: studentId,
          shortsId: allShorts.shortsId,
        },
      });
      //NOTE - FINAL PUSH
      getAllShorts.push({
        id: allShorts.shortsId,
        title: allShorts?.short?.title,
        // video: await cloudFrontM3u8Converter(
        //   converterType(allShorts?.short?.video)
        // ), //TODO - with w3u8,
        // originalVideo: allShorts?.short?.video
        //   ? await getSignedUrlCloudFront(allShorts?.short?.video)
        //   : null,

        // original_resolution: await cloudFrontM3u8Converter(
        //   converterType(
        //     allShorts?.short?.video.replace(".mp4", "_original_resolution.m3u8")
        //   )
        // ),
        video: allShorts?.short?.source === "youtube" ? allShorts?.short?.video : await cloudFrontM3u8Converter(
          converterType(allShorts?.short?.video)
        ), //TODO - with w3u8,
        originalVideo: allShorts?.short?.source === "youtube" ? allShorts?.short?.video : allShorts?.short?.video
          ? await getSignedUrlCloudFront(allShorts?.short?.video)
          : null,

        original_resolution: allShorts?.short?.source === "youtube" ? await getYouTubeVideoId(allShorts?.short?.video) : await cloudFrontM3u8Converter(
          converterType(
            allShorts?.short?.video.replace(".mp4", "_original_resolution.m3u8")
          )
        ),
        thumbnail: await getSignedUrlCloudFront(allShorts?.short?.thumbnail),
        view: allShorts?.short?.view,
        like: shortsLikeMap?.like === true ? true : false,
        subjectId: allShorts?.subjectId,
        subject: allShorts?.subject?.name,
        createdAt: allShorts?.createdAt,
        source: allShorts?.short?.source
      });
    }

    //NOTE - FINAL RESULT
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getShorts.count,
      data: getAllShorts,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - update shorts
const updateShortsById = async (req, res) => {
  try {
    const { id, subjectIds, video, title, thumbnail, source } = req.body;

    //NOTE - id from tokens
    const userId = req.user.id;

    //NOTE - finding shorts
    const getOnlyShorts = await Shorts.findOne({
      where: { id: id },
    });

    if (!getOnlyShorts) {
      return res
        .status(400)
        .send({ status: 400, message: msg.SHORTS_NOT_FOUND, data: [] });
    }

    //NOTE - finding shorts on shorts course map
    const getShortsCourse = await shortsCourseMap.findAll({
      where: { shortsId: id }
    });
    if (!getShortsCourse) {
      return res
        .status(400)
        .send({ status: 400, message: msg.SHORTS_NOT_FOUND, data: [] });
    }

    //NOTE - shorts created by id
    const shortsCreatedById = getShortsCourse[0]?.createdById;

    //NOTE - all payload
    let payload = {
      title: title,
      video: video,
      source: source,
      createdById: userId,
    };

    //NOTE - thumbnail upload
    if (thumbnail && thumbnail.includes("base64")) {
      const uploadImage = await uploadFileS3(
        thumbnail,
        msg.SHORTS_FOLDER_CREATED
      );
      payload = { ...payload, thumbnail: uploadImage.Key };
    }

    // NOTE: update in shorts table
    await Shorts.update(payload, {
      where: { id: getOnlyShorts.id },
    });

    //NOTE - destroy shorts course map table
    await shortsCourseMap.destroy({
      where: {
        shortsId: id,
      },
    });

    //NOTE - creating shorts for muliple batches with subjects
    for (const id of subjectIds) {
      //NOTE - find subject details
      const findSubject = await Subject.findOne({
        where: {
          id: id,
        },
      });

      //NOTE: maping shorts with course, board,subjects
      await shortsCourseMap.create({
        shortsId: getOnlyShorts.id,
        courseId: findSubject.courseId,
        boardId: findSubject.boardId,
        classId: findSubject.classId,
        batchTypeId: findSubject.batchTypeId,
        subjectId: findSubject.id,
        createdById: shortsCreatedById,
        updatedById: userId,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.SHORTS_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - delete shorts
const deleteShort = async (req, res) => {
  try {
    const getShorts = await Shorts.findOne({
      where: { id: req.params.id },
    });
    if (!getShorts)
      return res
        .status(400)
        .send({ status: 400, message: msg.SHORTS_NOT_FOUND });

    //NOTE - delete shorts data form shorts_like_map
    await shorts_like_map.destroy({
      where: {
        shortsId: req.params.id,
      },
    });

    //NOTE - delete shorts course map form shorts
    await shortsCourseMap.destroy({
      where: {
        shortsId: req.params.id,
      },
    });

    //NOTE - delete data form shorts
    await Shorts.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).send({ status: 200, message: msg.SHORTS_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - like and dislike shorts
const likeDislikeShorts = async (req, res) => {
  try {
    const { shortsId, like } = req.body;

    //NOTE- id from decode token
    const studentId = req.user.id;

    //NOTE - if user want to like short
    if (like === 1) {
      const shortsLike = await shorts_like_map.findOne({
        where: { studentId: studentId, shortsId: shortsId },
      });
      if (shortsLike) {
        await shorts_like_map.update(
          { like: like, studentId: studentId, shortsId: shortsId },
          {
            where: { studentId: studentId, shortsId: shortsId },
          }
        );
      }
      if (!shortsLike) {
        await shorts_like_map.create({
          studentId: studentId,
          shortsId: shortsId,
          like: like,
        });
      }
      return res.status(200).send({
        status: 200,
        message: msg.LIKE_ADDED,
      });
    } else {
      //NOTE - if user want to dislike short
      const disliked = await shorts_like_map.findOne({
        where: { studentId: studentId, shortsId: shortsId },
      });
      if (!disliked) {
        return res.status(400).send({ status: 400, message: msg.ID_NOT_FOUND });
      }
      await shorts_like_map.destroy({
        where: {
          studentId: disliked.studentId,
          shortsId: disliked.shortsId,
        },
      });
      return res.status(200).send({ status: 200, message: msg.DISLIKE });
    }
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - get all user like shorts
const getAllLikeShortsByStudentId = async (req, res) => {
  try {
    let getAllShorts = [];
    const { subjectId } = req.body;

    const studentId = req.user.id;

    let final = {};
    if (subjectId) {
      //NOTE - check subject details
      const checkSubject = await Subject.findOne({
        where: { id: subjectId },
      });

      //NOTE - if isAllSubject is true
      if (checkSubject?.isAllSubject === 1) {
        final = undefined;
      } else {
        final = {
          subjectId: subjectId,
        };
      }
    }

    //NOTE - student like shorts
    const shortsLikeMap = await shorts_like_map.findAndCountAll({
      where: { studentId: studentId },
      include: [
        {
          model: Shorts,
          attributes: ["id", "title", "video", "thumbnail"],
          include: {
            model: shortsCourseMap,
            attributes: ["id", "shortsId", "subjectId"],
            as: "courseMap",
            where: final,
          },
        },
      ],
    });

    for (let data of shortsLikeMap.rows) {
      //NOTE - FINAL PUSH
      if (data.short !== null) {
        getAllShorts.push({
          id: data?.shortsId,
          title: data?.short?.title ? data?.short?.title : null,
          video: data?.short?.video
            ? await getSignedUrlCloudFront(data?.short?.video)
            : null,
          thumbnail: data?.short?.thumbnail
            ? await getSignedUrlCloudFront(data?.short?.thumbnail)
            : null,
          like: data.like,
          subjectId: subjectId,
        });
      }
    }

    //NOTE - fianl return
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getAllShorts.length,
      data: getAllShorts,
    });
  } catch (err) {
    console.log(err);
    return Response(res, 500, err.message);
  }
};

//ANCHOR: dislike
const dislike = async (req, res) => {
  try {
    const { studentId, shortsId } = req.body;
    const disliked = await shorts_like_map.findOne({
      where: { studentId: studentId, shortsId: shortsId },
    });
    if (!disliked) {
      return res
        .status(400)
        .send({ status: 400, message: msg.ID_NOT_FOUND, data: [] });
    }
    await shorts_like_map.destroy({
      where: {
        studentId: studentId,
        shortsId: shortsId,
      },
    });

    return res.status(200).send({ status: 200, message: msg.DISLIKE });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR -  get previousShorts by student id and shorts id
const getPreviousShorts = async (req, res) => {
  try {
    const { shortsId, studentId } = req.query;

    const UserDetails = await User.findOne({
      where: { id: studentId, type: "Student" },
    });
    if (!UserDetails) {
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });
    }
    const studentDetails = await Student.findOne({
      where: { id: UserDetails.typeId },
    });

    const getShorts = await Shorts.findOne({
      where: {
        courseId: studentDetails.courseId,
        boardId: studentDetails.boardId,
        classId: studentDetails.classId,
        batchTypeId: studentDetails.batchTypeId,
        id: {
          [Sequelize.Op.lt]: shortsId,
        },
      },
      order: [["id", "DESC"]],
    });
    if (!getShorts) {
      return res
        .status(400)
        .send({ status: 400, message: msg.SHORTS_NOT_FOUND });
    }

    getShorts.video = await getSignedUrl(getShorts.video);
    getShorts.thumbnail = await getSignedUrl(getShorts.thumbnail);

    const shortsLikeMap = await shorts_like_map.findOne({
      where: { studentId: studentDetails.id, shortsId: shortsId },
    });

    let getAllShorts = {
      id: getShorts.id,
      title: getShorts.title,
      video: getShorts.video,
      thumbnail: getShorts.thumbnail,
      like: shortsLikeMap ? shortsLikeMap.like : false,
      view: getShorts.view,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getAllShorts ? getAllShorts : [],
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR -  get NextShorts by student id and shorts id
const getNextShorts = async (req, res) => {
  try {
    const { shortsId, studentId } = req.query;

    const userDetails = await User.findOne({
      where: { id: studentId, type: "Student" },
      include: {
        model: Student,
        attributes: ["courseId", "boardId", "classId", "batchTypeId"],
      },
    });
    if (!userDetails)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    const getShorts = await Shorts.findOne({
      where: {
        courseId: userDetails.student?.courseId,
        boardId: userDetails.student?.boardId,
        classId: userDetails.student?.classId,
        batchTypeId: userDetails.student?.batchTypeId,
        id: {
          [Sequelize.Op.gt]: shortsId,
        },
      },
      order: [["id", "ASC"]],
    });

    if (!getShorts)
      return res
        .status(400)
        .send({ status: 400, message: msg.SHORTS_NOT_FOUND });

    getShorts.video = await getSignedUrl(getShorts.video);
    getShorts.thumbnail = await getSignedUrl(getShorts.thumbnail);

    const shortsLikeMap = await shorts_like_map.findOne({
      where: { studentId: userDetails.id, shortsId: shortsId },
    });

    let getAllShorts = {
      id: getShorts.id,
      title: getShorts.title,
      video: getShorts.video,
      thumbnail: getShorts.thumbnail,
      like: shortsLikeMap ? shortsLikeMap.like : false,
      view: getShorts.view,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getAllShorts ? getAllShorts : [],
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR -  get previousShorts by student id and shorts id
const getPreviousShortsMobileApp = async (req, res) => {
  try {
    const { shortsId, studentId } = req.query;
    let getAllShorts = [];

    const UserDetails = await User.findOne({
      where: { id: studentId, type: "Student" },
      include: {
        model: Student,
        attributes: ["courseId", "boardId", "classId", "batchTypeId"],
      },
    });
    if (!UserDetails) {
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });
    }

    const getShorts = await Shorts.findAll({
      where: {
        courseId: UserDetails.student?.courseId,
        boardId: UserDetails.student?.boardId,
        classId: UserDetails.student?.classId,
        batchTypeId: UserDetails.student?.batchTypeId,
        id: {
          [Sequelize.Op.lt]: shortsId,
        },
      },
      order: [["id", "DESC"]],
    });
    if (!getShorts) {
      return res
        .status(400)
        .send({ status: 400, message: msg.SHORTS_NOT_FOUND });
    }

    for (let data of getShorts) {
      video = await getSignedUrl(data.video);
      thumbnail = await getSignedUrl(data.thumbnail);

      const shortsLikeMap = await shorts_like_map.findOne({
        where: { studentId: UserDetails.id, shortsId: shortsId },
      });

      getAllShorts.push({
        id: data.id,
        title: data.title,
        video: video,
        thumbnail: thumbnail,
        like: shortsLikeMap ? shortsLikeMap.like : false,
        view: data.view,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getAllShorts ? getAllShorts : [],
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR -  get NextShorts by student id and shorts id
const getNextShortsMobileApp = async (req, res) => {
  try {
    const { shortsId, studentId } = req.query;

    const UserDetails = await User.findOne({
      where: { id: studentId, type: "Student" },
    });
    if (!UserDetails) {
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });
    }
    const studentDetails = await Student.findOne({
      where: { id: UserDetails.typeId },
    });

    const getShorts = await Shorts.findAll({
      where: {
        courseId: studentDetails.courseId,
        boardId: studentDetails.boardId,
        classId: studentDetails.classId,
        batchTypeId: studentDetails.batchTypeId,
        id: {
          [Sequelize.Op.gt]: shortsId,
        },
      },
      order: [["id", "ASC"]],
    });
    if (!getShorts) {
      return res
        .status(400)
        .send({ status: 400, message: msg.SHORTS_NOT_FOUND });
    }

    let getAllShorts = [];
    for (let data of getShorts) {
      video = await getSignedUrl(data.video);
      thumbnail = await getSignedUrl(data.thumbnail);

      const shortsLikeMap = await shorts_like_map.findOne({
        where: { studentId: studentDetails.id, shortsId: shortsId },
      });

      getAllShorts.push({
        id: data.id,
        title: data.title,
        video: video,
        thumbnail: thumbnail,
        like: shortsLikeMap ? shortsLikeMap.like : false,
        view: data.view,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getAllShorts ? getAllShorts : [],
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  addShorts,
  getAllShorts,
  getShortsById,
  getShortsBySubjectId,
  deleteShort,
  updateShortsById,
  getShortsByStudentId,
  getAllLikeShortsByStudentId,
  dislike,
  getOneShortsByStudentId, //TODO - use in web
  getPreviousShorts,
  getNextShorts,
  likeDislikeShorts,
  getPreviousShortsMobileApp,
  getNextShortsMobileApp,
};
