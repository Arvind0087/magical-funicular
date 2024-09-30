const db = require("../../models/index");
const msg = require("../../constants/Messages");
const Topic = db.topic;
const Subject = db.subject;
const Chapter = db.chapter;

const NewContent = db.new_content;
const contentCourseMap = db.content_course_map;

exports.contentCourses = async (topicId) => {
  try {
    console.log(topicId);
    //NOTE - get all content
    const getContent = await contentCourseMap.findAll({
      where: { topicId: topicId },
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
        { model: Subject, attributes: ["id", "name"] },
        { model: Chapter, attributes: ["id", "name"] },
        { model: Topic, attributes: ["name"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!getContent)
      return res
        .status(400)
        .send({ status: 400, message: msg.CONTENT_NOT_FOUND });

    return getContent; //final return
  } catch (err) {
    console.log(err);
  }
};

//NOTE - replace path
exports.replaceDirectoryInPath = (filePath) => {
  return filePath.replace(/content-video\//, "content-video_reduced_item/");
};
