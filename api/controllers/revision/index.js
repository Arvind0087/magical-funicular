const db = require("../../models/index");
const msg = require("../../constants/Messages");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const getSignedUrl = require("../../helpers/getSignedUrl");
const { getSignedUrlCloudFront } = require("../../helpers/cloudFront");
const { Sequelize, Op } = require("sequelize");
const RevisionDetails = db.revisions;
const coursesData = db.courses;
const BoardData = db.boards;
const classData = db.class;
const BatchType = db.batchTypes;
const SubjectData = db.subject;
const ChapaterData = db.chapter;
const Bookmark = db.bookmark;
const User = db.users;
const StudentDetails = db.student;
const revisionTitleMap = db.revision_title_map;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const RolePermission = db.permissionRole;

//ANCHOR - Create revisions
const createNewRevision = async (req, res) => {
  try {
    const {
      courseId,
      boardId,
      classId,
      batchTypeId,
      subjectId,
      chapaterId,
      topic,
      category,
      list,
    } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    //NOTE - Create payload for revision questions
    const createNewRevision = await RevisionDetails.create({
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      subjectId: subjectId,
      chapaterId: chapaterId,
      topic: topic,
      category: category,
      createdById: id,
    });

    let revisionTitleMaps;
    for (let data of list) {
      let url;
      if (data.image && data.image.includes("base64")) {
        const uploadImage = await uploadFileS3(
          data.image,
          msg.REVISION_QUESTION_CREATED
        );
        url = uploadImage.Key;
      }
      revisionTitleMaps = await revisionTitleMap.create({
        revisionId: createNewRevision.id,
        title: data.title,
        description: data.description,
        image: url,
      });
    }

    if (revisionTitleMaps) {
      return res.status(200).send({
        status: 200,
        message: msg.REVISION_CREATED,
      });
    } else {
      return res.status(409).send({
        status: 409,
        message: msg.TRY_AGAIN,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get all revisions details
const getAllRevisions = async (req, res) => {
  try {
    const { page, limit, subject } = req.query;

    //NOTE -if pagination
    const query = {
      offset: Number((page || 1) - 1) * Number(limit || 20),
      limit: Number(limit || 20),
    };

    //NOTE -filter based on subject
    let sub = subject
      ? { [Op.or]: [{ id: subject }, { name: subject }] }
      : undefined;

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const staff = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });

        //NOTE - Get all user class Ids
        const classIds = staff.map((item) => item.classId);

        //NOTE - Get all batch Ids
        const batchIds = staff.map((item) => item.batchTypeId);

        params = batchIds.every((id) => id === null)
          ? { classId: { [Sequelize.Op.in]: classIds } }
          : { batchTypeId: { [Sequelize.Op.in]: batchIds } };
      }

    //NOTE -  get details for Revision Table
    const { count, rows } = await RevisionDetails.findAndCountAll({
      ...query,
      where: { ...params },
      include: [
        { model: coursesData, attributes: ["id", "name"] },
        { model: BoardData, attributes: ["id", "name"] },
        { model: classData, attributes: ["id", "name"] },
        { model: BatchType, attributes: ["id", "name"] },
        { model: SubjectData, attributes: ["id", "name"], where: { ...sub } },
        { model: ChapaterData, attributes: ["id", "name"] },
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
        .send({ status: 200, message: msg.NOT_FOUND, data: [] });

    //NOTE - Push final data
    const result = await Promise.all(
      rows.map(async (rev) => {
        const getRevisionTitleMap = await revisionTitleMap.findAll({
          where: { revisionId: rev.id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });

        const answerResponse = await Promise.all(
          getRevisionTitleMap.map(async (Image) => {
            const image = await getSignedUrl(Image.dataValues?.image);
            return {
              ...Image.dataValues,
              image,
            };
          })
        );

        return {
          id: rev.id,
          courseId: rev.course?.id,
          courseName: rev.course?.name,
          boardId: rev.board?.id,
          boardName: rev.board?.name,
          classId: rev.class?.id,
          className: rev.class?.name,
          batchTypeId: rev.batchType?.id,
          batchTypeName: rev.batchType?.name,
          subjectId: rev.subject?.id,
          subjectName: rev.subject?.name,
          chapaterId: rev.chapter?.id,
          chapaterName: rev.chapter?.name,
          topic: rev?.topic,
          category: rev.category,
          createdByName: rev.creator ? rev.creator?.name : null,
          createdByRole: rev.creator
            ? rev.creator?.permission_role?.role
            : null,
          updateByName: rev.updater ? rev.updater?.name : null,
          updateByRole: rev.updater ? rev.updater?.permission_role.role : null,
          list: answerResponse,
        };
      })
    );

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get revisions by id
const getRevisionsDetailsById = async (req, res) => {
  try {
    const id = req.params.id;
    //NOTE - Get revision details
    const revisios = await RevisionDetails.findOne({
      where: { id: id },
      include: [
        {
          model: coursesData,
          attributes: ["id", "name"],
        },
        {
          model: BoardData,
          attributes: ["id", "name"],
        },
        {
          model: classData,
          attributes: ["id", "name"],
        },
        {
          model: BatchType,
          attributes: ["id", "name"],
        },
        {
          model: SubjectData,
          attributes: ["id", "name"],
        },
        {
          model: ChapaterData,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!revisios) {
      return res.status(200).send({ status: false, message: msg.NOT_FOUND });
    }

    const getRevisionTitleMap = await revisionTitleMap.findAll({
      where: { revisionId: id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "revisionId"],
      },
    });

    const answerResponse = [];
    for (let Image of getRevisionTitleMap) {
      const image = await getSignedUrl(Image.dataValues?.image);
      answerResponse.push({
        ...Image.dataValues,
        image,
      });
    }

    //NOTE - Push final data
    let allRevisions = {
      id: revisios.id,
      courseId: revisios.course.id,
      courseName: revisios.course.name,
      boardId: revisios.board.id,
      boardName: revisios.board.name,
      classId: revisios.class.id,
      className: revisios.class.name,
      batchTypeId: revisios.batchType?.id,
      batchTypeName: revisios.batchType?.name,
      subjectId: revisios.subject.id,
      subjectName: revisios.subject.name,
      chapaterId: revisios.chapter.id,
      chapaterName: revisios.chapter.name,
      topic: revisios?.topic,
      category: revisios.category,
      list: answerResponse,
    };

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allRevisions,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - get revision by category
const getRevisionByCategory = async (req, res) => {
  try {
    const {
      courseId,
      boardId,
      classId,
      subjectId,
      chapaterId,
      category,
      userId,
      topic,
      bookmark,
    } = req.body;

    //NOTE - topic filter
    let val;
    if (topic) {
      val = {
        topic: topic,
      };
    }

    //NOTE - find user id from token
    const token = req.user.id;

    //NOTE - find user details
    const user = await User.findOne({
      where: {
        id: token,
        type: "Student",
      },
      include: {
        model: StudentDetails,
        attributes: ["courseId", "boardId", "classId"],
      },
    });
    if (!user)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    //NOTE - return bookmarks
    if (bookmark === true) {
      const getBookmark = await Bookmark.findAndCountAll({
        where: {
          userId: token,
          bookmarkType: category,
          subjectId: subjectId,
          ...val,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (!getBookmark) {
        return res
          .status(400)
          .send({ status: 400, message: msg.BOOKMARk_NOT_FOUND });
      }

      let response = [];
      for (const allBookmark of getBookmark.rows) {
        //NOTE - get title by revision id
        const getRevisionTitleMap = await revisionTitleMap.findOne({
          where: { id: allBookmark.revisionId },
          attributes: ["id", "revisionId", "title", "description", "image"],
        });

        //NOTE - push all data that is required
        if (getRevisionTitleMap !== null) {
          const revisionData = await RevisionDetails.findOne({
            where: { id: getRevisionTitleMap.revisionId },
          });

          //note- final list data
          let final = [];
          final.push({
            id: allBookmark?.revisionId,
            title: getRevisionTitleMap?.title,
            description: getRevisionTitleMap?.description,
            image: getRevisionTitleMap
              ? await getSignedUrlCloudFront(getRevisionTitleMap?.image)
              : null,
            bookmark: allBookmark ? allBookmark.bookmark : false,
          });
          response.push({
            topic: revisionData ? revisionData.topic : null,
            list: final,
          });
        }
      }

      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        count: getBookmark.count,
        data: response,
      });
    }

    //NOTE - find revision all data
    const revision = await RevisionDetails.findAll({
      where: {
        courseId: user.student?.courseId,
        boardId: user.student?.boardId,
        classId: user.student?.classId,
        subjectId: subjectId,
        chapaterId: chapaterId,
        category: category,
        ...val,
      },
    });
    //NOTE - checking revision
    if (!revision) {
      return res.send({
        status: 400,
        message: msg.NOT_FOUND,
      });
    }

    let response = [];
    for (data of revision) {
      //get title by revision id
      const getRevisionTitleMap = await revisionTitleMap.findAll({
        where: { revisionId: data.id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "revisionId"],
        },
      });

      //convert s3 key into secure url
      const answerResponse = [];
      for (let Image of getRevisionTitleMap) {
        const array = await Bookmark.findOne({
          where: {
            revisionId: Image.id,
            bookmarkType: category,
            userId: token,
          },
          attributes: { exclude: ["createdAt", "updatedAt"] },
        });

        //NOTE - convert image into get sign url
        const image = await getSignedUrlCloudFront(Image.dataValues?.image);

        answerResponse.push({
          ...Image.dataValues,
          image,
          bookmark: array ? array.bookmark : false,
        });
      }
      response.push({
        id: data.id,
        topic: data?.topic,
        list: answerResponse,
      });
    }

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: response,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Update revision by id
const updateRevisionById = async (req, res) => {
  try {
    // const id = req.params.id;
    const {
      courseId,
      boardId,
      classId,
      batchTypeId,
      subjectId,
      chapaterId,
      topic,
      category,
      list,
      id,
    } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    //NOTE -  get details for Revision Table
    const revisionData = await RevisionDetails.findOne({
      where: { id: id },
    });
    if (!revisionData) {
      return res.status(200).send({ status: false, message: msg.NOT_FOUND });
    }

    //NOTE - Create payload for revision questions
    let payload = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      subjectId: subjectId,
      chapaterId: chapaterId,
      topic: topic,
      category: category,
      updatedById: token,
    };

    const updateValues = await RevisionDetails.update(payload, {
      where: { id: id },
    });

    for (let data of list) {
      let url;
      if (data.image && data.image.includes("base64")) {
        const uploadImage = await uploadFileS3(
          data.image,
          msg.REVISION_QUESTION_CREATED
        );
        url = uploadImage.Key;
      }

      if (!data.id) {
        await revisionTitleMap.create({
          revisionId: id,
          title: data.title,
          description: data.description,
          image: url,
        });
      } else {
        await revisionTitleMap.update(
          {
            title: data.title,
            description: data.description,
            image: url,
          },
          {
            where: { revisionId: id, id: data.id },
          }
        );
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.REVISION_UPDATED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Delete Revision By id
const deleteRevisionDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    //NOTE -  get details for Revision Table
    const revisionData = await RevisionDetails.findOne({
      where: { id: id },
    });

    if (!revisionData) {
      return res.status(200).send({ status: false, message: msg.NOT_FOUND });
    }
    await revisionData.destroy();

    await revisionTitleMap.destroy({
      where: {
        revisionId: id,
      },
    });

    // await Bookmark.destroy({
    //   where: {
    //     revisionId: id,
    //   },
    // });

    return res.status(200).send({
      status: 200,
      message: msg.REVISION_DELETED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//get all bookmarks by type
const getAllRevisionBookmark = async (req, res) => {
  try {
    const { category, topic, subjectId } = req.query;

    //NOTE - id from decode token
    const userId = req.user.id;

    //NOTE - subject filter
    let query;
    if (subjectId) {
      //NOTE - check subject details
      const checkSubject = await SubjectData.findOne({
        where: { id: subjectId },
      });

      //NOTE - if isAllSubject is true
      if (checkSubject?.isAllSubject === 1) {
        query = undefined;
      } else {
        query = {
          subjectId: subjectId,
        };
      }
    }

    //NOTE - filter based on quick bites
    let val;
    if (topic) {
      val = {
        topic: topic,
      };
    }

    //NOTE - get all bookmarks
    const getBookmark = await Bookmark.findAndCountAll({
      where: {
        userId: userId,
        bookmarkType: category,
        ...query,
        ...val,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!getBookmark) {
      return res
        .status(400)
        .send({ status: 400, message: msg.BOOKMARk_NOT_FOUND });
    }

    let response = [];
    for (const allBookmark of getBookmark.rows) {
      //NOTE - get title by revision id
      const getRevisionTitleMap = await revisionTitleMap.findOne({
        where: { id: allBookmark.revisionId },
        attributes: ["id", "revisionId", "title", "description", "image"],
      });

      //NOTE - push all data that is required
      if (getRevisionTitleMap !== null) {
        const revisionData = await RevisionDetails.findOne({
          where: { id: getRevisionTitleMap.revisionId },
        });
        response.push({
          id: allBookmark?.revisionId,
          revisionId: getRevisionTitleMap.revisionId,
          topic: revisionData ? revisionData.topic : null,
          title: getRevisionTitleMap?.title,
          description: getRevisionTitleMap?.description,
          image: getRevisionTitleMap
            ? await getSignedUrl(getRevisionTitleMap?.image)
            : null,
          bookmark: allBookmark ? allBookmark.bookmark : false,
        });
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getBookmark.count,
      data: response,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createNewRevision,
  getAllRevisions,
  getRevisionsDetailsById,
  getRevisionByCategory,
  updateRevisionById,
  deleteRevisionDetailsById,
  getAllRevisionBookmark,
};
