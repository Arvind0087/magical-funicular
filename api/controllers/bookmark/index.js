const db = require("../../models/index");
const msg = require("../../constants/Messages");
const getSignedUrl = require("../../helpers/getSignedUrl");
const {
  getSignedUrlCloudFront,
  getYouTubeVideoId,
} = require("../../helpers/cloudFront");
const Chapter = db.chapter;
const Subject = db.subject;
const Bookmark = db.bookmark;
const Syllabus = db.syllabus;
const User = db.users;
const Topic = db.topic;
const questionBank = db.questionBank;
const Content = db.content;
const NewContent = db.new_content;
const contentCourseMap = db.content_course_map;

//ANCHOR : add Bookmark
const addBookmark = async (req, res) => {
  try {
    const {
      subjectId,
      chapterId,
      topic,
      userId,
      typeId, //TODO - video id or question id. If revision type id will be null
      bookmarkType,
      bookmark,
      revisionId, //TODO - revision id. If question or video  revision id will be null
    } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    if (bookmark === 1) {
      //NOTE - find bookmark
      const Bookmarks = await Bookmark.findOne({
        where: {
          userId: token,
          typeId: typeId ? typeId : null,
          revisionId: revisionId ? revisionId : null,
          bookmarkType: bookmarkType ? bookmarkType : null,
          topic: topic ? topic : null,
        },
      });

      //NOTE - if type is question then getting subjectID
      let getQuestionBank;
      if (bookmarkType === "question") {
        getQuestionBank = await questionBank.findOne({
          where: { id: typeId },
          attributes: ["subjectId"],
        });
      }

      if (Bookmarks) {
        //NOTE - update bookmark
        await Bookmark.update(
          {
            subjectId:
              bookmarkType === "question"
                ? getQuestionBank?.subjectId
                : subjectId,
            chapterId: chapterId ? chapterId : null,
            topic: topic ? topic : null,
            userId: token ? token : null,
            typeId: typeId ? typeId : null,
            revisionId: revisionId ? revisionId : null,
            bookmarkType: bookmarkType ? bookmarkType : null,
            bookmark: bookmark,
          },
          {
            where: {
              userId: token,
              typeId: typeId ? typeId : null,
              revisionId: revisionId ? revisionId : null,
              bookmarkType: bookmarkType ? bookmarkType : null,
              topic: topic ? topic : null,
            },
          }
        );
      }

      if (!Bookmarks || Bookmarks === null) {
        //NOTE - create new bookmark
        await Bookmark.create({
          subjectId:
            bookmarkType === "question"
              ? getQuestionBank?.subjectId
              : subjectId,
          chapterId: chapterId,
          typeId: typeId,
          topic: topic,
          userId: token,
          revisionId: revisionId,
          bookmarkType: bookmarkType,
          bookmark: bookmark,
        });
      }

      //NOTE - FINAL BOOKMARK
      return res.status(200).send({
        status: 200,
        message: msg.BOOKMARk_CREATED,
      });
    } else {
      const getBookmarks = await Bookmark.findOne({
        where: {
          userId: token,
          typeId: typeId ? typeId : null,
          revisionId: revisionId ? revisionId : null,
          bookmarkType: bookmarkType ? bookmarkType : null,
          topic: topic ? topic : null,
        },
      });

      if (getBookmarks) {
        await Bookmark.destroy({
          where: {
            userId: token,
            typeId: typeId ? typeId : null,
            revisionId: revisionId ? revisionId : null,
            bookmarkType: bookmarkType ? bookmarkType : null,
            topic: topic ? topic : null,
          },
        });

        return res
          .status(200)
          .send({ status: 200, message: msg.BOOKMARk_DELETED });
      }
    }
  } catch (err) {
    console.log("error", err);
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//bookmarks video and question count
const countBookmark = async (req, res) => {
  try {
    const userId = req.body;

    //NOTE - id from token
    const token = req.user.id;

    const getVideo = await Bookmark.findAll({
      where: { bookmarkType: "video", userId: token },
    });

    const getQUESTION = await Bookmark.findAll({
      where: { bookmarkType: "question", userId: token },
    });

    let result = {
      videoCount: getVideo.length,
      questionCount: getQUESTION.length,
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

//NOTE - user all bookmarks
const getAllBookmark = async (req, res) => {
  try {
    let allBookmarks = [];

    const { bookmarkType, subjectId } = req.body;

    //NOTE - user id from token
    const userId = req.user.id;

    //NOTE - filter bookmark based on subject
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

    //note - GET ALL BOOKMARK
    const getBookmark = await Bookmark.findAndCountAll({
      where: { userId: userId, bookmarkType: bookmarkType, ...final },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Subject,
          attributes: ["name"],
        },
        {
          model: Chapter,
          attributes: ["name"],
        },
        {
          model: User,
          attributes: ["name"],
          where: { type: "Student" },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    //NOTE - when no bookmarks
    if (getBookmark.count === 0) {
      return res
        .status(200)
        .send({ status: 200, message: msg.BOOKMARk_NOT_FOUND, data: [] });
    }

    for (const allBookmark of getBookmark.rows) {
      //NOTE - if type video
      if (
        ["video"].includes(allBookmark.bookmarkType) &&
        allBookmark !== null
      ) {
        const sources = {
          youtube: "youtube",
          upload: "video",
          gallerymanager: "video",
        };

        const array = await Content.findOne({
          where: { id: allBookmark.typeId ? allBookmark.typeId : null },
          attributes: { exclude: ["createdAt", "updatedAt"] },

          include: [
            {
              model: Subject,
              attributes: ["id", "name"],
              //where: final,
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
        });

        let sourceFiles;
        if (array?.source !== "youtube") {
          sourceFiles = await getSignedUrlCloudFront(array?.sourceFile);
        } else {
          sourceFiles =
            array?.sourceFile && array?.sourceFile
              ? await getYouTubeVideoId(array?.sourceFile)
              : null;
        }

        //NOTE - thumbnail file
        const thumbnailFile = await getSignedUrlCloudFront(
          array?.thumbnailFile
        );

        if (array !== null) {
          //NOTE - final push
          allBookmarks.push({
            id: allBookmark?.id,
            subjectId: array?.subjectId,
            subject: array?.subject?.name,
            chapterId: array?.chapterId,
            chapter: array?.chapter?.name,
            topicId: array?.topicId,
            name: array?.topic?.name,
            tag: array?.tag,
            thumbnail: thumbnailFile,
            source: sources[array?.source],
            sourceFile: sourceFiles ? sourceFiles : null,
            videoId: array?.id,
            bookmark: allBookmark.bookmark ? allBookmark.bookmark : null,
          });
        }
      } else {
        //NOTE - type is question
        const array = await questionBank.findOne({
          where: { id: allBookmark.typeId },
          //attributes: ["subjectId", "question", "difficultyLevel"],
          include: [
            {
              model: Subject,
              attributes: ["id", "name"],
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
        });

        if (array !== null) {
          //NOTE - final push
          allBookmarks.push({
            id: allBookmark?.id,
            subjectId: array?.subjectId,
            subjectName: array?.subject?.name,
            chapterId: array?.chapterId,
            chapterName: array?.chapter?.name,
            topicId: array?.topicId,
            topic: array?.topic?.name,
            questionId: array?.id,
            question: array?.question,
            difficultyLevel: array?.difficultyLevel,
            bookmark: allBookmark.bookmark ? allBookmark.bookmark : null,
          });
        }
      }
    }

    //NOTE - return final data
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getBookmark.count,
      data: allBookmarks,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE -get bookmark by id
const getBookmarkById = async (req, res) => {
  try {
    const { userId, bookmarkId, bookmarkType } = req.body;

    const getBookmark = await Bookmark.findOne({
      where: { userId: userId, id: bookmarkId, bookmarkType: bookmarkType },
      include: [
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
        {
          model: User,
          attributes: ["name"],
          where: { type: "student" },
        },
      ],
    });

    if (!getBookmark) {
      return res
        .status(400)
        .send({ status: 400, message: msg.BOOKMARk_NOT_FOUND });
    }

    let array;
    let array1;
    let sub;
    let question;
    let level;
    if (["video"].includes(getBookmark?.bookmarkType)) {
      array1 = await Syllabus.findOne({
        where: { id: getBookmark.typeId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
    } else if (["question"].includes(getBookmark?.bookmarkType)) {
      array = await questionBank.findOne({
        where: { id: getBookmark.typeId },
        attributes: ["subjectId", "question", "difficultyLevel"],
        include: {
          model: Subject,
          attributes: ["name"],
        },
      });

      question = array && array.question ? array.question : null;
      level = array && array.difficultyLevel ? array.difficultyLevel : null;
      sub = array && array.subject.name ? array.subject.name : null;
    }

    let allBookmark = {
      id: getBookmark.id,
      subjectId: getBookmark.subjectId,
      subjectName: getBookmark.subject?.name,
      chapterId: getBookmark.chapterId,
      chapterName: getBookmark.chapter?.name,
      topicId: getBookmark.topicId,
      topicName: getBookmark.topic?.name,
      userId: getBookmark.userId,
      user: getBookmark.user?.name,
      typeId: getBookmark.typeId,
      bookmarkType: getBookmark?.bookmarkType,
      bookmark: getBookmark?.bookmark,
      question: question,
      difficultyLevel: level,
      subject: sub,
      syllabus: array1,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allBookmark,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//delete Bookmarks
const deleteBookmarks = async (req, res) => {
  try {
    const getBookmarks = await Bookmark.findOne({
      where: { id: req.params.id },
    });
    await getBookmarks.destroy();
    return res.status(200).send({ status: 200, message: msg.BOOKMARk_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE - user all bookmarks
const getAllBookmarkNew = async (req, res) => {
  try {
    let allBookmarks = [];

    const { bookmarkType, subjectId } = req.body;

    //NOTE - user id from token
    const userId = req.user.id;

    //NOTE - filter bookmark based on subject
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
    //note - GET ALL BOOKMARK
    const getBookmark = await Bookmark.findAndCountAll({
      where: { userId: userId, bookmarkType: bookmarkType, ...final },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Subject,
          attributes: ["name"],
        },
        {
          model: Chapter,
          attributes: ["name"],
        },
        {
          model: User,
          attributes: ["name"],
          where: { type: "Student" },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    //NOTE - when no bookmarks
    if (getBookmark.count === 0) {
      return res
        .status(200)
        .send({ status: 200, message: msg.BOOKMARk_NOT_FOUND, data: [] });
    }

    for (const allBookmark of getBookmark.rows) {
      //NOTE - if type video
      if (
        ["video"].includes(allBookmark.bookmarkType) &&
        allBookmark !== null
      ) {
        const sources = {
          youtube: "youtube",
          upload: "video",
          gallerymanager: "video",
        };

        //NOTE - get all content of bookmarks
        const array = await contentCourseMap.findOne({
          where: { contentId: allBookmark.typeId },
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
        });

        if (array !== null) {
          //NOTE - final push
          allBookmarks.push({
            id: allBookmark?.id,
            subjectId: array?.subjectId,
            subject: array?.subject?.name,
            chapterId: array?.chapterId,
            chapter: array?.chapter?.name,
            topicId: array?.topicId,
            name: array?.topic?.name,
            tag: array?.tag,
            thumbnail: array?.new_content?.thumbnailFile
              ? await getSignedUrlCloudFront(array?.new_content?.thumbnailFile)
              : null,
            sourceFile: array?.new_content?.sourceFile
              ? await getSignedUrlCloudFront(array?.new_content?.sourceFile)
              : null,
            source: sources[array?.new_content?.source],
            videoId: array?.contentId,
            bookmark: allBookmark.bookmark ? allBookmark.bookmark : null,
          });
        }
      } else {
        //NOTE - type is question
        const array = await questionBank.findOne({
          where: { id: allBookmark.typeId },
          //attributes: ["subjectId", "question", "difficultyLevel"],
          include: [
            {
              model: Subject,
              attributes: ["id", "name"],
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
        });

        if (array !== null) {
          //NOTE - final push
          allBookmarks.push({
            id: allBookmark?.id,
            subjectId: array?.subjectId,
            subjectName: array?.subject?.name,
            chapterId: array?.chapterId,
            chapterName: array?.chapter?.name,
            topicId: array?.topicId,
            topic: array?.topic?.name,
            questionId: array?.id,
            question: array?.question,
            difficultyLevel: array?.difficultyLevel,
            bookmark: allBookmark.bookmark ? allBookmark.bookmark : null,
          });
        }
      }
    }

    //NOTE - return final data
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getBookmark.count,
      data: allBookmarks,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  addBookmark,
  getAllBookmark,
  getBookmarkById,
  deleteBookmarks,
  countBookmark,
  getAllBookmarkNew,
};
