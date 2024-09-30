const db = require("../../models/index");
const msg = require("../../constants/Messages");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const getSignedUrl = require("../../helpers/getSignedUrl");
const { Sequelize, Op } = require("sequelize");
const User = db.users;
const TeacherSubjectMap = db.teacher_subject_map;
const StudentDetails = db.student;
const Admin = db.admin;
const Doubt = db.doubt;
const DoubtReply = db.doubtReply;
const Chapter = db.chapter;
const Subject = db.subject;

//ANCHOR - create Doubt
const createDoubt = async (req, res) => {
  try {
    const { studentId, subjectId, chapterId, question, image } = req.body;

    //NOTE - Find subject details
    const findSubjectDetails = await Subject.findOne({
      where: { id: subjectId },
    });

    if (!findSubjectDetails)
      return res.status(400).send({
        status: 400,
        message: msg.SUBJECT_NOT_FOUND,
      });

    //NOTE:- payload for create doubts
    let payload = {
      studentId: studentId,
      subjectId: subjectId,
      batchTypeId: findSubjectDetails.batchTypeId,
      chapterId: chapterId,
      question: question,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(
        image,
        msg.DOUBT_FOLDER_CREATED,
        question
      );
      payload = { ...payload, image: uploadImage.Key };
    }

    const newDoubt = new Doubt(payload);
    await newDoubt.save();
    return res.status(200).send({
      status: 200,
      message: msg.DOUBT_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - get Doubt By ID
const getDoubtById = async (req, res) => {
  try {
    const { type } = req.query;

    const getDoubt = await Doubt.findOne({
      where: { id: req.params.id },
      include: [
        { model: User, attributes: ["name"] },
        { model: Subject, attributes: ["name"] },
        { model: Chapter, attributes: ["name"] },
        {
          model: DoubtReply,
          as: "Answers",
          attributes: { exclude: ["updatedAt"] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!getDoubt)
      return res.status(400).send({
        status: 400,
        message: msg.DOUBT_NOT_FOUND,
      });

    getDoubt.image = await getSignedUrl(getDoubt.image);

    const response = [];
    for (const doubt of getDoubt.Answers) {
      if (!type || doubt.type === type) {
        const image = await getSignedUrl(doubt.image);
        response.push({
          ...doubt.dataValues,
          image,
        });
      }
    }

    getDoubt.Answers = response;

    const allDoubt = {
      id: getDoubt.id,
      question: getDoubt.question,
      image: getDoubt.image,
      createdAt: getDoubt.createdAt,
      user: getDoubt.user.name,
      subject: getDoubt.subject.name,
      chapter: getDoubt.chapter.name,
      answers: getDoubt.Answers,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allDoubt,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - get all Doubt
const getAllDoubt = async (req, res) => {
  try {
    const { page, limit, subjectId } = req.query;
    let staffParams = null;

    //NOTE -if pagination
    const query = {
      offset: Number((page || 1) - 1) * Number(limit || 20),
      limit: Number(limit || 20),
    };

    //NOTE -filter based of subject id
    const sub = subjectId ? { id: subjectId } : undefined;

    //NOTE - for teacher login
    if (
      req.user?.role &&
      ["teacher", "mentor"].includes(req.user.role.toLowerCase())
    ) {
      //NOTE - get staff class and batch details
      const staffDetails = await TeacherSubjectMap.findAll({
        where: { teacherId: req.user.id },
        attributes: ["classId", "batchTypeId"],
      });

      //NOTE - get all class details
      const classesIds = staffDetails.map((item) => item.classId);
      //NOTE - get all batch details
      const batchIds = staffDetails.map((item) => item.batchTypeId);

      //NOTE - params based on class or batch type
      const idParams = batchIds.every((id) => id === null)
        ? { classId: { [Sequelize.Op.in]: classesIds } }
        : { batchTypeId: { [Sequelize.Op.in]: batchIds } };

      //NOTE - get all student details
      const students = await StudentDetails.findAll({
        where: idParams,
        attributes: ["id"],
      });
      //NOTE - get all students type ids
      const typeIds = students.map((item) => item.id);

      staffParams = { studentId: { [Sequelize.Op.in]: typeIds } };
    }

    //NOTE - get all doubt
    const { count, rows } = await Doubt.findAndCountAll({
      ...query,
      where: staffParams,
      include: [
        { model: User, attributes: ["name"] },
        {
          model: Subject,
          attributes: ["id", "name"],
          where: { ...sub },
        },
        { model: Chapter, attributes: ["name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!rows)
      return res.status(200).send({
        status: 200,
        message: msg.DOUBT_NOT_FOUND,
        data: [],
      });

    //NOTE - push final response
    const result = await Promise.all(
      rows.map(async (allDoubt) => {
        const getDoubtReplyPromise = DoubtReply.findAll({
          where: { doubtId: allDoubt.id },
        });

        const imagePromise = getSignedUrl(allDoubt.dataValues.image);

        const [getDoubtReply, image] = await Promise.all([
          getDoubtReplyPromise,
          imagePromise,
        ]);

        const answerResponse = await Promise.all(
          getDoubtReply.map(async (answerImage) => {
            const image = await getSignedUrl(answerImage.dataValues?.image);

            return {
              ...answerImage.dataValues,
              image,
            };
          })
        );

        return {
          id: allDoubt.id,
          question: allDoubt.question,
          image: image,
          createdAt: allDoubt.createdAt,
          user: allDoubt.user?.name,
          subjectId: allDoubt.subject?.id,
          subject: allDoubt.subject?.name,
          chapterId: allDoubt.chapter?.id,
          chapter: allDoubt.chapter?.name,
          answers: answerResponse ? answerResponse : [],
        };
      })
    );

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

//ANCHOR - reply message
const postReply = async (req, res) => {
  try {
    const { doubtId, replyId, sender, type, answer, image } = req.body;
    let payload = {
      doubtId: doubtId,
      type: type,
      replyId: replyId,
      answer: answer,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(
        image,
        msg.DOUBT_FOLDER_CREATED,
        answer
      );
      payload = { ...payload, image: uploadImage.Key };
    }
    if (type === "student") {
      const students = await User.findOne({
        where: { id: replyId, type: "Student" },
      });
      payload = { ...payload, sender: students?.name };
    } else {
      const AdminUsers = await Admin.findOne({
        where: { id: replyId },
      });
      payload = { ...payload, sender: AdminUsers?.name };
    }
    const newDoubtReply = new DoubtReply(payload);
    await newDoubtReply.save();
    return res.status(200).send({
      status: 200,
      message: msg.DOUBT_REPLY,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - UPDATE POST REPLY BY ID
const updatePostReplyById = async (req, res) => {
  try {
    let { doubtId, replyId, sender, type, answer, image, Id } = req.body;

    const getDoubtReply = await DoubtReply.findOne({
      where: { id: Id },
    });
    if (!getDoubtReply) {
      return res
        .status(409)
        .send({ status: 409, message: "doubt reply id not found" });
    }

    let payload = {
      doubtId: doubtId,
      replyId: replyId,
      sender: sender,
      type: type,
      answer: answer,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(
        image,
        msg.DOUBT_FOLDER_CREATED,
        type
      );
      payload = { ...payload, image: uploadImage.Key };
    }

    await DoubtReply.update(payload, {
      where: { id: Id },
    });

    return res.status(200).send({
      status: 200,
      message: msg.DOUBT_REPLY_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - get Doubt By student  ID
const getDoubtByStudentId = async (req, res) => {
  try {
    const { page, limit, subjectId, chapterId, search } = req.body;

    let query = {};

    
    if (!subjectId && !chapterId && !search)
      return res.status(400).send({
        status: 400,
        message: msg.SOMETHING_WRONG,
      });

    //NOTE - if page and limit is coming
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE - if subjcet id is coming
    if (subjectId) {
      query = {
        ...query,
        subjectId: subjectId,
      };
    }

    //NOTE - if subjcet id and chapter id is coming
    if (subjectId && chapterId) {
      query = {
        subjectId: subjectId,
        chapterId: chapterId,
      };
    }

    //NOTE - if getting some value on search
    if (search !== "") {
      query = {
        ...query,
        question: {
          [Op.like]: "%" + search + "%",
        },
      };
    }

    //NOTE - find student details in user table
    const userDetails = await User.findOne({
      where: { id: req.params.id },
      include: {
        model: StudentDetails,
        attributes: ["batchTypeId"],
      },
    });

    if (!userDetails)
      return res.status(400).send({
        status: 400,
        message: msg.NOT_FOUND,
      });

    //NOTE - find all doubts
    const getDoubt = await Doubt.findAndCountAll({
      where: { batchTypeId: userDetails.student?.batchTypeId, ...query },
      include: [
        { model: User, attributes: ["name"] },
        { model: Subject, attributes: ["name"] },
        { model: Chapter, attributes: ["name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!getDoubt)
      return res.status(400).send({
        status: 400,
        message: msg.DOUBT_NOT_FOUND,
      });

    const getDoubtRepliesPromises = getDoubt.rows.map(async (allDoubt) => {
      const getDoubtReply = await DoubtReply.findAll({
        where: { doubtId: allDoubt.id },
      });

      const answerImages = await Promise.all(
        getDoubtReply.map(async (answerImage) => {
          const convertedImage = await getSignedUrl(
            answerImage.dataValues?.image
          );
          return {
            ...answerImage.dataValues,
            convertedImage,
          };
        })
      );

      return {
        id: allDoubt.id,
        question: allDoubt.question,
        image: allDoubt.dataValues.image
          ? await getSignedUrl(allDoubt.dataValues.image)
          : null,
        createdAt: allDoubt.createdAt,
        userId: allDoubt.studentId,
        user: allDoubt.user?.name,
        subjectId: allDoubt.subjectId,
        subject: allDoubt.subject?.name,
        chapterId: allDoubt.chapterId,
        chapter: allDoubt.chapter?.name,
        answers: answerImages,
      };
    });

    //NOTE:  Return the final result
    const allDoubts = await Promise.all(getDoubtRepliesPromises);

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allDoubts,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - get all student doubt
const getAllDoubtOfStudent = async (req, res) => {
  try {
    let allDoubts = [];
    let query = {};
    const answerResponse = [];

    const { page, limit } = req.body;

    //NOTE - if page and limit is coming
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE - find all doubts
    const getDoubt = await Doubt.findAndCountAll({
      where: { studentId: req.user.id, ...query },
      include: [
        {
          model: User,
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

    if (!getDoubt)
      return res.status(400).send({
        status: 400,
        message: msg.DOUBT_NOT_FOUND,
      });

    for (let allDoubt of getDoubt.rows) {
      const getDoubtReply = await DoubtReply.findAll({
        where: { doubtId: allDoubt.id },
      });

      //NOTE - push all answers of doubts
      for (let answerImage of getDoubtReply) {
        const convertedImage = await getSignedUrl(
          answerImage.dataValues?.image
        );
        answerResponse.push({
          ...answerImage.dataValues,
          convertedImage,
        });
      }

      //NOTE - push the final result
      allDoubts.push({
        id: allDoubt.id,
        question: allDoubt.question,
        image: allDoubt.dataValues.image
          ? await getSignedUrl(allDoubt.dataValues.image)
          : null, //TODO : convert s3 key to actual url with security
        createdAt: allDoubt.createdAt,
        userId: allDoubt.studentId,
        user: allDoubt.user?.name,
        subjectId: allDoubt.subjectId,
        subject: allDoubt.subject?.name,
        chapterId: allDoubt.chapterId,
        chapter: allDoubt.chapter?.name,
        answers: answerResponse,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getDoubt.count,
      data: allDoubts,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createDoubt,
  postReply,
  getAllDoubt,
  getDoubtById,
  updatePostReplyById,
  getDoubtByStudentId, //TODO - get doubt on search
  getAllDoubtOfStudent, //TODO -  get all doubt based on student id
};
