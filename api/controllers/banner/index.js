const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize, Op } = require("sequelize");
const { Response } = require("../../helpers/response.helper");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const { getSignedUrlCloudFront } = require("../../helpers/cloudFront");
const Banner = db.banner;
const BannerCourseMap = db.banner_course_map;
const AdminUser = db.admin;
const RolePermission = db.permissionRole;
const Course = db.courses;
const Boards = db.boards;
const Class = db.class;
const Batch = db.batchTypes;
const UserDetails = db.users;
const StudentDetails = db.student;
const TeacherSubjectMap = db.teacher_subject_map;

//ANCHOR: create banner
const createBanner = async (req, res) => {
  try {
    const { image, title, backLink, batchTypeIds, type } = req.body;

    //NOTE - id from token
    const userId = req.user.id;

    let payload = {
      title: title,
      backLink: backLink,
      type: type,
      createdById: userId,
    };

    if (image && image.includes("base64")) {
      const uploadAvatar = await uploadFileS3(image, msg.BANNER_FOLDER_CREATED);
      payload = { ...payload, image: uploadAvatar.key };
    }

    const newBanner = new Banner(payload);
    const createBanner = await newBanner.save();

    for (const id of batchTypeIds) {
      //NOTE - find batch details
      const findBatch = await Batch.findOne({
        where: {
          id: id,
        },
      });

      //NOTE: Push all course board details
      await BannerCourseMap.create({
        bannerId: createBanner.id,
        courseId: findBatch.courseId,
        boardId: findBatch.boardId,
        classId: findBatch.classId,
        batchTypeId: findBatch.id,
        createdById: userId,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.BANNER_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR :get one banner
const getBannerById = async (req, res) => {
  try {
    //NOTE - get banner id from params
    const id = req.params.id;
    let classes = [];
    let batches = [];

    const bannerData = await Banner.findOne({
      where: { id: id },
    });

    //NOTE - get banner details
    const getBanner = await BannerCourseMap.findAll({
      where: { bannerId: id },
      include: [
        { model: Banner, attributes: ["image", "title", "type", "backLink"] },
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["id", "name"] },
        { model: Batch, attributes: ["id", "name"] },
      ],
    });

    if (!getBanner)
      return res
        .status(400)
        .send({ status: 400, message: msg.BANNER_NOT_FOUND });

    for (const data of getBanner) {
      //NOTE - push all class details
      classes.push({
        classId: data.class.id,
        className: data.class.name,
      });

      //NOTE - push all batch details
      batches.push({
        batchId: data.batchType.id,
        batchName: data.batchType.name,
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

    //NOTE -push banner details
    const result = {
      id: bannerData.id,
      image:
        bannerData?.image && bannerData?.image
          ? await getSignedUrlCloudFront(bannerData?.image)
          : null,
      title: bannerData?.title,
      type: bannerData?.type,
      backLink: bannerData?.backLink,
      courseId: getBanner[0].courseId,
      courseName: getBanner[0].course?.name,
      boardId: getBanner[0].boardId,
      boardName: getBanner[0].board?.name,
      class: uniqueClasses,
      batch: uniqueBatch,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return Response(res, 500, err.message);
  }
};

//ANCHOR: get all banner
const getAllBanner = async (req, res) => {
  try {
    const { page, limit, type, classes } = req.query;
    let classeArray = [];
    let batchArray = [];
    let result = [];

    //NOTE - add pagination
    const query =
      page && limit
        ? {
            offset: Number(page - 1) * limit,
            limit: Number(limit),
          }
        : {};

    //NOTE - filter by banner type
    const bannerType = type ? { type: type } : null;

    //NOTE - filter by class
    const classValue = classes ? { classId: classes } : null;

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (["teacher", "mentor", "Teacher", "Mentor"].includes(req.user?.role)) {
        //NOTE - Get  User details from token
        const getAdmin = await AdminUser.findOne({
          where: { id: req.user.id },
        });

        //NOTE - get Teacher subject details
        const teachersSubject = await TeacherSubjectMap.findAll({
          where: { teacherId: getAdmin.id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });

        //NOTE - push all user class Ids for
        const classesIds = teachersSubject.map(
          (item) => item.dataValues.classId
        );

        //NOTE - push all batch ids
        const batchIds = teachersSubject.map(
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

    const { count, rows } = await BannerCourseMap.findAndCountAll({
      attributes: [
        ["bannerId", "bannerId"],
        [
          Sequelize.fn("MAX", Sequelize.col("banner_course_map.createdAt")),
          "latestCreatedAt",
        ],
      ],
      where: { ...query.where, ...classValue, ...params },
      include: [
        {
          model: Banner,
          attributes: [],
          where: bannerType, // TODO - filter based on shorts title
        },
      ],

      group: ["bannerId"],
      offset: query.offset || 0,
      limit: query.limit || 10,
      order: [[Sequelize.literal("latestCreatedAt"), "DESC"]],
    });

    if (!rows)
      return res
        .status(200)
        .send({ status: 200, message: msg.BANNER_NOT_FOUND, data: [] });

    for (const data of rows) {
      //NOTE - get all banner from table
      const allData = await BannerCourseMap.findAll({
        where: {
          bannerId: data.bannerId,
        },
        include: [
          { model: Banner, attributes: ["id", "image", "title", "type"] },
          { model: Course, attributes: ["id", "name"] },
          { model: Boards, attributes: ["id", "name"] },
          { model: Class, attributes: ["id", "name"] },
          { model: Batch, attributes: ["id", "name"] },
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
          classId: values.class.id,
          name: values.class.name,
        });

        //NOTE - push batch details
        batchArray.push({
          batchId: values.batchType.id,
          name: values.batchType.name,
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

      //NOTE: push final result
      result.push({
        id: data.bannerId,
        image:
          allData[0].banner?.image && allData[0].banner?.image
            ? await getSignedUrlCloudFront(allData[0].banner?.image)
            : null,
        bannerId: data.bannerId,
        title: allData[0].banner?.title,
        type: allData[0].banner?.type,
        courseName: allData[0].course?.name,
        boardName: allData[0].board?.name,
        classes: uniqueClasses,
        batchType: uniqueBatch,
        createdByName: allData[0].creator ? allData[0].creator?.name : null,
        createdByRole: allData[0].creator
          ? allData[0].creator?.permission_role?.role
          : null,
        updateByName: allData[0].updater ? allData[0].updater?.name : null,
        updateByRole: allData[0].updater
          ? allData[0].updater?.permission_role.role
          : null,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count.length,
      data: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : update banner
const updateBannerById = async (req, res) => {
  try {
    const { id, image, title, backLink, type, batchTypeIds } = req.body;
    //NOTE - id from token
    const userId = req.user.id;

    const getBanner = await Banner.findOne({
      where: { id: id },
    });

    if (!getBanner)
      return res
        .status(400)
        .send({ status: 400, message: msg.BANNER_NOT_FOUND });

    const getBannerCourse = await BannerCourseMap.findAll({
      where: { bannerId: id },
    });

    if (!getBannerCourse)
      return res
        .status(400)
        .send({ status: 400, message: msg.BANNER_NOT_FOUND });

    //NOTE - banner created by id
    const bannerCreatedById = getBannerCourse[0]?.createdById;

    let payload = {
      title: title,
      backLink: backLink,
      type: type,
      updatedById: userId,
    };

    if (image && image.includes("base64")) {
      const uploadImage = await uploadFileS3(image, msg.BANNER_FOLDER_CREATED);
      payload = { ...payload, image: uploadImage.Key };
    }

    // NOTE: update in banner table
    await Banner.update(payload, {
      where: { id: getBanner.id },
    });

    await BannerCourseMap.destroy({
      where: {
        bannerId: id,
      },
    });

    for (const id of batchTypeIds) {
      //NOTE - find batch details
      const findBatch = await Batch.findOne({
        where: {
          id: id,
        },
      });

      // NOTE: Push all course board details
      await BannerCourseMap.create({
        bannerId: getBanner.id,
        courseId: findBatch.courseId,
        boardId: findBatch.boardId,
        classId: findBatch.classId,
        batchTypeId: findBatch.id,
        createdById: bannerCreatedById,
        updatedById: userId,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.BANNER_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get all banner for mobileApp and web
const getAllBannerByType = async (req, res) => {
  try {
    const { type } = req.query;

    //NOTE - id from token
    const userId = req.user.id;

    //NOTE - filter by type
    const typ = type ? { type } : undefined;

    //NOTE - GET user details
    const userData = await UserDetails.findOne({
      where: { id: userId, type: "Student" },
      attributes: ["id", "typeId"],
      include: [{ model: StudentDetails, attributes: ["batchTypeId"] }],
    });

    //NOTE - get all banner from table
    const getBanner = await BannerCourseMap.findAll({
      where: {
        batchTypeId: userData.student.batchTypeId,
      },
      include: [
        {
          model: Banner,
          attributes: ["image", "title", "type", "backLink"],
          where: typ,
        },
      ],
    });

    if (!getBanner)
      return res.status(200).send({
        status: 200,
        message: msg.NOT_FOUND,
        data: [],
      });

    //NOTE - push final result
    const result = await Promise.all(
      getBanner.map(async (data) => {
        const image = data?.banner?.image
          ? await getSignedUrlCloudFront(data.banner.image)
          : null;
    
        return {
          id: data.id,
          image,
          title: data.banner?.title,
          type: data.banner?.type,
          backLink: data.banner?.backLink,
        };
      })
    );
    
    
    //NOTE:  You can then use 'result' as needed, for example:
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
    

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getBanner,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE : delete Activity
const deleteBannerById = async (req, res) => {
  try {
    const bannerData = await Banner.findOne({
      where: { id: req.params.id },
    });

    if (!bannerData)
      return res
        .status(400)
        .send({ status: 400, message: msg.BANNER_NOT_FOUND, data: [] });

    //NOTE - Find and delete data from banner course map
    await BannerCourseMap.destroy({
      where: {
        bannerId: bannerData.id,
      },
    });

    //NOTE - Find and delete data from banner
    await Banner.destroy({
      where: {
        id: bannerData.id,
      },
    });

    return res.status(200).send({ status: 200, message: msg.BANNER_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createBanner,
  getBannerById,
  getAllBanner,
  updateBannerById,
  getAllBannerByType, //TODO - use in web and mobile
  deleteBannerById,
};
