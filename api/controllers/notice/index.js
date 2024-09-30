const db = require("../../models/index");
const msg = require("../../constants/Messages");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const getSignedUrl = require("../../helpers/getSignedUrl");
const { getSignedUrlCloudFront } = require("../../helpers/cloudFront");
const { Sequelize, Op } = require("sequelize");
const { getFcmToken, removeHtmlTags } = require("./service");
const { getMessaging } = require("firebase-admin/messaging");
const { config } = require("../../config/db.config");
const firebase = require("firebase-admin/app");
const Notice = db.notice;
const batchType = db.batchTypes;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;
const User = db.users;
const student_notice_map = db.student_notice_map;
const Student = db.student;
const PageBackLink = db.pageBackLink;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const DeviceToken = db.user_device_token;
const RolePermission = db.permissionRole;

firebase.initializeApp({
  credential: firebase.cert({
    projectId: config.FIREBASE_PROJECT_ID,
    clientEmail: config.FIREBASE_CLIENT_EMAIL,
    privateKey: config.FIREBASE_PRIVATE_KEY,
  }),
});

//ANCHOR : send notice to student
const sendNotice = async (req, res) => {
  try {
    const {
      courseId,
      boardId,
      classId,
      batchTypeId,
      image,
      title,
      backLinkId,
      otherLink,
      description,
      student,
    } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    //NOTE - if student not come
    if (student.length === 0)
      return res.status(409).send({
        status: 409,
        message: msg.STUDENT_NOT_SELECTED,
      });

    let payload = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      title: title,
      description: description,
      backLinkId: backLinkId,
      otherLink: otherLink,
      createdById: token,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(
        image,
        msg.NOTICE_FOLDER_CREATED,
        title
      );

      payload = { ...payload, image: uploadImage.Key };
    }
    //NOTE - Create notice
    const newNotice = new Notice(payload);
    const createdNotice = await newNotice.save();

    //NOTE - NOTICE SEND TO STUDENT
    for (let data of student) {
      await student_notice_map.create({
        noticeId: createdNotice.id,
        studentId: data,
      });

      const checkDeviceToken = await DeviceToken.findOne({
        where: { userId: data },
      });

      if (checkDeviceToken) {
        //NOTE: Get the device tokens for each platform
        const webToken = await getFcmToken(data, "Web");
        const androidToken = await getFcmToken(data, "Android");
        const iosToken = await getFcmToken(data, "Ios");

        //NOTE: Create a separate message for each platform

        if (webToken !== null) {
          //TODO - send message to web platform
          const webMessage = {
            notification: {
              title: newNotice.title,
              body: await removeHtmlTags(newNotice.description),
              image: await getSignedUrl(newNotice.image),
            },

            token: webToken,
          };
          //NOTE - send message to web  on notification send
          getMessaging()
            .send(webMessage)
            .then(async (response) => {
              console.log("Successfully sent message:", response);
            })
            .catch((error) => {
              console.log("Error sending message:", error);
            });
        }

        if (androidToken !== null) {
          const linkUrl = 'https://www.youtube.com/watch?v=CcjZ2x72iF0';
          //TODO - send message to android platform
          const androidMessage = {
            notification: {
              title: newNotice.title,
              // body: await removeHtmlTags(newNotice.description),
              body: `${await removeHtmlTags(newNotice.description)}\n\nClick to learn more: ${linkUrl}`,

              image: await getSignedUrl(newNotice.image),
            },
            token: androidToken,
          };
          console.log("androidMessage",androidMessage);
          //NOTE - send message to android on notification send
          getMessaging()
            .send(androidMessage)
            .then(async (response) => {
              console.log("Successfully sent message:", response);
            })
            .catch((error) => {
              console.log("Error sending message:", error);
            });
        }

        if (iosToken !== null) {
          //TODO - send message to IOS platform
          const iosMessage = {
            notification: {
              title: newNotice.title,
              body: await removeHtmlTags(newNotice.description),
            },
            token: iosToken,
          };
          //NOTE - send message to ios device on notification send
          getMessaging()
            .send(iosMessage)
            .then(async (response) => {
              console.log("Successfully sent message:", response);
            })
            .catch((error) => {
              console.log("Error sending message:", error);
            });
        }
      }
    }
    return res.status(200).send({
      status: 200,
      message: msg.NOTICE_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all Notice
const getAllNotice = async (req, res) => {
  try {
    const { page, limit, classes, search } = req.query;

    //NOTE -if pagination
    const query = {
      offset: Number((page || 1) - 1) * Number(limit || 20),
      limit: Number(limit || 20),
    };

    //NOTE -filter based of class id
    const cls = classes ? { id: classes } : undefined;

    //NOTE -filter based of title
    const val = search
      ? { title: { [Op.like]: "%" + search + "%" } }
      : undefined;

    //NOTE - If login by a teacher or mentor
    let params;
    if (
      req.user &&
      ["teacher", "mentor"].includes(req.user.role.toLowerCase())
    ) {
      //NOTE - Get staff details from token
      const teachersSubject = await TeacherSubjectMap.findAll({
        where: { teacherId: req.user.id },
        attributes: ["classId", "batchTypeId"],
      });
      //NOTE - push all staff class Ids
      const classIds = teachersSubject.map((item) => item.classId);

      //NOTE - push all staff batchIds
      const batchIds = teachersSubject.map((item) => item.batchTypeId);

      if (batchIds.every((id) => id === null)) {
        params = {
          classId: {
            [Sequelize.Op.in]: classIds,
          },
        };
      } else {
        params = {
          batchTypeId: {
            [Sequelize.Op.in]: batchIds,
          },
        };
      }
    }

    //NOTE - get all notice details
    const { rows, count } = await Notice.findAndCountAll({
      ...query,
      where: {
        ...val,
        ...params,
      },
      include: [
        { model: Course, attributes: ["id", "name"] },
        { model: Boards, attributes: ["id", "name"] },
        { model: Class, attributes: ["id", "name"], where: cls },
        { model: batchType, attributes: ["name"] },
        { model: PageBackLink, attributes: ["backLink"] },
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
        .send({ status: 200, message: msg.NOTICE_NOT_FOUND, data: [] });

    const result = await Promise.all(
      rows.map(async (allNotice) => {
        const imagePromise = getSignedUrl(allNotice.dataValues.image);
        const userDetailsPromise = student_notice_map.findOne({
          where: { noticeId: allNotice.id },
          include: {
            model: User,
            attributes: ["id", "name"],
          },
        });

        const [image, userDetails] = await Promise.all([
          imagePromise,
          userDetailsPromise,
        ]);

        return {
          id: allNotice.id,
          image: image,
          title: allNotice.title,
          description: allNotice.description,
          backLink: allNotice.backLink,
          courseId: allNotice.course?.id,
          course: allNotice.course?.name,
          boardId: allNotice.board?.id,
          board: allNotice.board?.name,
          classId: allNotice.class?.id,
          class: allNotice.class?.name,
          batchType: allNotice.batchType?.name,
          user: userDetails?.user?.name,
          backLinkId: allNotice.backLinkId,
          backLink: allNotice.pageBackLink
            ? allNotice.pageBackLink?.backLink
            : null,
          otherLink: allNotice.otherLink,
          createdByName: allNotice.creator ? allNotice.creator?.name : null,
          createdByRole: allNotice.creator
            ? allNotice.creator?.permission_role?.role
            : null,
          updateByName: allNotice.updater ? allNotice.updater?.name : null,
          updateByRole: allNotice.updater
            ? allNotice.updater?.permission_role.role
            : null,
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

//ANCHOR : get notice by id
const getNoticeById = async (req, res) => {
  try {
    const getNotice = await Notice.findOne({
      where: { id: req.params.id },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
        { model: batchType, attributes: ["name"] },
        { model: PageBackLink, attributes: ["backLink"] },
      ],
    });

    if (!getNotice)
      return res
        .status(400)
        .send({ status: 400, message: msg.NOTICE_NOT_FOUND });

    try {
      getNotice.image = await getSignedUrl(getNotice.dataValues.image);
    } catch (err) {
      getNotice.image = null;
    }

    const userDetails = await student_notice_map.findOne({
      where: { noticeId: getNotice.id },
      include: {
        model: User,
        attributes: ["name"],
      },
    });

    let final = {
      id: getNotice.id,
      image: getNotice.image,
      title: getNotice.title,
      description: getNotice.description,
      backLinkId: getNotice.backLinkId,
      backLink: getNotice.pageBackLink
        ? getNotice.pageBackLink?.backLink
        : null,
      otherLink: getNotice.otherLink,
      course: getNotice.course?.name,
      board: getNotice.board?.name,
      class: getNotice.class?.name,
      batchType: getNotice.batchType?.name,
      user: userDetails.user?.name,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: final,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get student based on course,board,class
const getStudentByClassId = async (req, res) => {
  try {
    let final = [];
    const { courseId, boardId, classId, batchTypeId } = req.body;
    const getStudent = await Student.findAll({
      where: {
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
      },
    });
    if (!getStudent)
      return res
        .status(400)
        .send({ status: 400, message: msg.STUDENT_NOT_FOUND });

    for (let data of getStudent) {
      const getUser = await User.findOne({
        where: { typeId: data.id },
        attributes: ["id", "name", "studentType", "phone"],
      });

      if (getUser !== null) {
        final.push(getUser);
      }
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

//ANCHOR : get all Notice by student Id
const getAllNoticeByStudentId = async (req, res) => {
  try {
    let getAllNotice = [];

    //NOTE - ID FROM TOKEN
    const userId = req.user.id;

    const UserDetails = await User.findOne({
      where: { id: userId, type: "Student" },
    });
    if (!UserDetails)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    const getStudent_notice_map = await student_notice_map.findAll({
      where: {
        studentId: UserDetails.id,
      },
      include: {
        model: User,
        attributes: ["name"],
      },
    });

    for (let data of getStudent_notice_map) {
      const getNotice = await Notice.findOne({
        include: [
          {
            model: PageBackLink,
            attributes: ["backLink", "webBackLink"],
          },
        ],
        where: {
          id: data.noticeId,
        },

        order: [["createdAt", "DESC"]],
      });

      getAllNotice.push({
        id: getNotice?.id,
        studentId: data.studentId,
        student: data.user?.name,
        title: getNotice?.title,
        image: getNotice?.image
          ? await getSignedUrlCloudFront(getNotice?.image)
          : null,
        description: getNotice?.description,
        backLink:
          getNotice !== null && getNotice?.pageBackLink
            ? getNotice?.pageBackLink?.backLink
            : null,
        otherLink: getNotice !== null ? getNotice.otherLink : null,
        webBackLink:
          getNotice !== null && getNotice?.pageBackLink
            ? getNotice?.pageBackLink?.webBackLink
            : null,
        createdAt: data?.createdAt,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getAllNotice,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR :delete Notice
const deleteNoticeById = async (req, res) => {
  try {
    const getNotice = await Notice.findOne({
      where: { id: req.params.id },
    });
    if (!getNotice)
      return res
        .status(400)
        .send({ status: 400, message: msg.NOTICE_NOT_FOUND });

    //NOTE - delete notic from student_notice_map
    await student_notice_map.destroy({
      where: {
        noticeId: req.params.id,
      },
    });

    //NOTE - delete notic from notic table
    await Notice.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({ status: 200, message: msg.NOTICE_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get top 5 Notice of student
const getStudentLatestNotice = async (req, res) => {
  try {
    let getAllNotice = [];

    //NOTE - ID FROM TOKEN
    const userId = req.user.id;

    //NOTE - finding user
    const UserDetails = await User.findOne({
      where: { id: userId, type: "Student" },
    });
    if (!UserDetails)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    //NOTE - find user top 5 notice
    const getStudent_notice_map = await student_notice_map.findAll({
      where: {
        studentId: UserDetails.id,
      },
      include: {
        model: User,
        attributes: ["name"],
      },
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    for (let data of getStudent_notice_map) {
      const getNotice = await Notice.findOne({
        include: [
          {
            model: PageBackLink,
            attributes: ["backLink", "webBackLink"],
          },
        ],
        where: {
          id: data.noticeId,
        },

        order: [["createdAt", "DESC"]],
      });

      getAllNotice.push({
        id: getNotice?.id,
        studentId: data.studentId,
        student: data.user?.name,
        title: getNotice?.title,
        image: getNotice?.image
          ? await getSignedUrlCloudFront(getNotice?.image)
          : null,
        description: getNotice?.description,
        backLinkId: getNotice?.backLinkId ? getNotice?.backLinkId : null,
        backLink:
          getNotice !== null && getNotice?.pageBackLink
            ? getNotice?.pageBackLink?.backLink
            : null,
        otherLink: getNotice !== null ? getNotice.otherLink : null,
        webBackLink:
          getNotice !== null && getNotice?.pageBackLink
            ? getNotice?.pageBackLink?.webBackLink
            : null,
        createdAt: data?.createdAt,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getAllNotice,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  sendNotice,
  getNoticeById,
  getAllNotice,
  deleteNoticeById, //TODO - only use for backend testing
  getStudentByClassId, //TODO - Repeat Api
  getAllNoticeByStudentId,
  getStudentLatestNotice,
};
