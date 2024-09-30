const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { getDaysCount } = require("../../helpers/service");
const { Sequelize, Op } = require("sequelize");
const packageDetails = db.packages;
const subscriptionDetails = db.subscription;
const packageClassMap = db.package_class_map;
const coursesData = db.courses;
const classData = db.class;
const BoardData = db.boards;
const batchTypesData = db.batchTypes;
const BatchDate = db.batchDate;
const AdminUser = db.admin;
const User = db.users;
const Student = db.student;
const RolePermission = db.permissionRole;
const TeacherSubjectMap = db.teacher_subject_map;

//ANCHOR - Create new packages
const createPackages = async (req, res) => {
  try {
    const { courseId, name, tag, startingPrice, list, packageType } = req.body;

    //NOTE - id from token
    const userId = req.user.id;

    //NOTE - create packages
    await packageDetails.create({
      courseId: courseId,
      name: name,
      tag: tag,
      startingPrice: startingPrice,
      list: list,
      packageType: packageType,
      createdById: userId,
    });

    return res.status(200).send({
      status: 200,
      message: msg.PACKAGE_CREATED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Create new subscription details of package
const createSubscriptionPlan = async (req, res) => {
  try {
    const { packageId, title, month } = req.body;

    //NOTE - id from token
    const userId = req.user.id;

    //NOTE - calculate days count
    const calculateDays = await getDaysCount(month);

    //NOTE - create subscription Details
    await subscriptionDetails.create({
      packageId: packageId,
      title: title,
      month: month,
      days: calculateDays,
      createdById: userId,
    });

    return res.status(200).send({
      status: 200,
      message: msg.SUBSCRIPTION_CREATED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Add multiple classes
const addMultipleClasses = async (req, res) => {
  try {
    const {
      courseId,
      packageId,
      subscriptionId,
      boardId,
      classId,
      batchTypeId,
      batchStartDateId,
      monthlyPrice,
      monthlyDiscountedPrice,
      realPrice,
    } = req.body;

    //NOTE - id from token
    const userId = req.user.id;

    //NOTE - find package details
    const getPackage = await packageDetails.findOne({
      where: { id: packageId },
    });

    //NOTE - check if package details already there or not
    const findClasses = await packageClassMap.findOne({
      where: {
        packageId: packageId,
        subscriptionId: subscriptionId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId ? batchTypeId : null,
        batchStartDateId: batchStartDateId ? batchStartDateId : null,
      },
    });
    if (findClasses) {
      return res.status(400).send({
        status: 400,
        message: msg.CLASS_EXIST,
      });
    } else {
      await packageClassMap.create({
        courseId: courseId,
        packageId: packageId,
        subscriptionId: subscriptionId,
        boardId: boardId,
        classId: classId,
        batchTypeId: ["Class"].includes(getPackage.packageType)
          ? null
          : batchTypeId,
        batchStartDateId: ["Class"].includes(getPackage.packageType)
          ? null
          : batchStartDateId,
        monthlyPrice: monthlyPrice,
        monthlyDiscountedPrice: monthlyDiscountedPrice,
        realPrice: realPrice,
        createdById: userId,
      });

      return res.status(200).send({
        status: 200,
        message: msg.MULTIPLE_CLASS_ADDED,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get products details by course id(Mobile App and web)
const getPackageDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    //NOTE - get user details from token
    const userId = req.user.id;

    const courseID = id;

    //NOTE - get user details
    const userDetails = await User.findOne({
      where: { id: userId },
      attributes: ["id"],
      include: {
        model: Student,
        attributes: ["boardId", "classId", "batchTypeId"],
      },
    });

    //NOTE - get all packages
    const packages = await packageClassMap.findAll({
      where: {
        courseId: courseID,
        boardId: userDetails.student.boardId,
        classId: userDetails.student.classId,
      },
      include: [
        { model: coursesData, attributes: ["id", "name"] },
        { model: BoardData, attributes: ["id", "name"], distinct: true },
        {
          model: packageDetails,
          attributes: [
            "id",
            "name",
            "tag",
            "startingPrice",
            "list",
            "packageType",
          ],
        },
      ],
    });

    //NOTE - get all packages based on user class and board
    const getPackage = packages.filter(
      (item) =>
        (item.package.packageType === "Batch" &&
          item.batchTypeId === userDetails.student.batchTypeId) ||
        item.package.packageType === "Class"
    );

    if (getPackage.length > 0) {
      const groupedData = getPackage.reduce((acc, current) => {
        const packageId = current.packageId;
        if (!acc[packageId]) {
          acc[packageId] = {
            packageId: packageId,
            packageName: current.package.name,
            courseId: current.courseId,
            courseName: current.course.name,
            tag: current.package.tag,
            startingPrice: current.package.startingPrice,
            list: current.package.list,
            packageType: current.package.packageType,
            boards: [],
          };
        }

        const boardExists = acc[packageId].boards.some(
          (item) => item.id === current.board.id
        );
        if (!boardExists) {
          acc[packageId].boards.push(current.board);
        }

        return acc;
      }, {});

      const finalData = Object.values(groupedData);
      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: finalData,
      });
    } else {
      return res
        .status(200)
        .send({ status: 200, message: msg.NOT_FOUND, data: [] });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get products details by idsss
const packageListById = async (req, res) => {
  try {
    const {
      courseId,
      packageId,
      boardId,
      classId,
      batchTypeId,
      batchStartDateId,
    } = req.body;
    let result = [];

    const userId = req.user.id;

    //NOTE - get user details
    const userDetails = await User.findOne({
      where: { id: userId },
      attributes: ["id"],
      include: {
        model: Student,
        attributes: ["classId", "batchTypeId", "batchStartDateId"],
      },
    });

    //NOTE - get package details
    const packageData = await packageDetails.findOne({
      where: { id: packageId },
      attributes: ["packageType"],
    });

    if (classId && batchTypeId && batchStartDateId) {
      //NOTE - get subscription details
      const findSubscription = await packageClassMap.findAll({
        where: {
          courseId: courseId,
          packageId: packageId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
          batchStartDateId: batchStartDateId,
        },
        attributes: ["monthlyPrice", "monthlyDiscountedPrice", "realPrice"],
        include: [{ model: subscriptionDetails, attributes: ["id", "title"] }],
      });

      //NOTE - push result
      result = findSubscription
        .filter((sub) => sub.subscription !== null)
        .map((sub) => ({
          id: sub.subscription.id,
          name: sub.subscription.title,
          monthlyPrice: sub.monthlyPrice,
          monthlyDiscountedPrice: sub.monthlyDiscountedPrice,
          realPrice: sub.realPrice,
        }));
    } else if (classId && batchTypeId) {
      //NOTE - get batch date details
      const findBatchDate = await packageClassMap.findAll({
        where: {
          courseId: courseId,
          packageId: packageId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
        },
        include: [{ model: BatchDate, attributes: ["id", "date"] }],
      });

      //NOTE - push result
      result = findBatchDate.map((date) => ({
        id: date.batchDate.id,
        name: date.batchDate.date,
      }));
    } else if (classId) {
      if (["Batch"].includes(packageData.packageType)) {
        //NOTE - get batch type details
        const findBatchType = await packageClassMap.findAll({
          where: {
            courseId: courseId,
            packageId: packageId,
            boardId: boardId,
            classId: classId,
            batchTypeId: userDetails.student?.batchTypeId,
          },
          distinct: true,
          include: [
            {
              model: batchTypesData,
              attributes: ["id", "name"],
              distinct: true,
            },
          ],
        });
        //NOTE - push result
        result = findBatchType.reduce((acc, batchType) => {
          if (!acc.find((item) => item.id === batchType.batchType.id)) {
            acc.push({
              id: batchType.batchType.id,
              name: batchType.batchType.name,
            });
          }
          return acc;
        }, []);
      } else {
        //NOTE - get subscription details
        const findSubscription = await packageClassMap.findAll({
          where: {
            courseId: courseId,
            packageId: packageId,
            boardId: boardId,
            classId: classId,
          },
          attributes: ["monthlyPrice", "monthlyDiscountedPrice", "realPrice"],
          include: [
            { model: subscriptionDetails, attributes: ["id", "title"] },
          ],
        });

        //NOTE - push result
        result = findSubscription
          .filter((sub) => sub.subscription !== null)
          .map((sub) => ({
            id: sub.subscription.id,
            name: sub.subscription.title,
            monthlyPrice: sub.monthlyPrice,
            monthlyDiscountedPrice: sub.monthlyDiscountedPrice,
            realPrice: sub.realPrice,
          }));
      }
    } else {
      //NOTE - get class details
      const findClass = await packageClassMap.findAll({
        where: {
          courseId: courseId,
          packageId: packageId,
          boardId: boardId,
          classId: userDetails.student?.classId,
        },
        distinct: true,
        include: [
          { model: classData, attributes: ["id", "name"], distinct: true },
        ],
      });

      const classSet = new Set(findClass.map((classes) => classes.class.id));

      //NOTE - push result
      result = Array.from(classSet).map((classId) => {
        const classData = findClass.find((item) => item.class.id === classId);
        return {
          id: classData.class.id,
          name: classData.class.name,
        };
      });
    }

    return res.status(result.length > 0 ? 200 : 400).send({
      status: result.length > 0 ? 200 : 400,
      message: result.length > 0 ? msg.FOUND_DATA : msg.NOT_FOUND,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - get all packages Details
const getAllPackages = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    //NOTE -if pagination
    const query = {
      offset: Number((page || 1) - 1) * Number(limit || 20),
      limit: Number(limit || 20),
    };

    //NOTE - filter based on package name
    const packageParams = search
      ? { name: { [Op.like]: "%" + search + "%" } }
      : undefined;

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const subject_details = await TeacherSubjectMap.findOne({
          where: { teacherId: req.user.id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        //NOTE - filter based on batchTypeId
        params = {
          courseId: subject_details.courseId,
        };
      }

    //NOTE -  Get all package details form package Table
    const { count, rows } = await packageDetails.findAndCountAll({
      ...query,
      where: { ...packageParams, ...params },
      attributes: ["id", "name", "tag", "startingPrice", "createdAt"],
      include: [
        {
          model: coursesData,
          attributes: ["name"],
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

    //NOTE - Final data push
    const result = rows.map((package) => ({
      id: package.id,
      name: package.name,
      courseName: package.course?.name,
      tag: package.tag,
      startingPrice: package.startingPrice,
      createdByName: package.creator ? package.creator?.name : null,
      createdByRole: package.creator
        ? package.creator?.permission_role?.role
        : null,
      updateByName: package.updater ? package.updater?.name : null,
      updateByRole: package.updater
        ? package.updater?.permission_role.role
        : null,
        createdAt: package?.createdAt
    }));
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

//ANCHOR - get package Details By package id
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    //NOTE -  Get all package details form package Table
    const packagesDetails = await packageDetails.findOne({
      where: { id: id },
      attributes: ["id", "name", "tag", "startingPrice", "list", "packageType"],
      include: {
        model: coursesData,
        attributes: ["id", "name"],
      },
      order: [["createdAt", "DESC"]],
    });

    //NOTE - Final data push
    const result = {
      id: packagesDetails.id,
      name: packagesDetails.name,
      courseId: packagesDetails.course?.id,
      courseName: packagesDetails.course?.name,
      tag: packagesDetails.tag,
      startingPrice: packagesDetails.startingPrice,
      list: packagesDetails.list,
      packageType: packagesDetails.packageType,
    };

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get all Subscription Details
const getAllSubscriptions = async (req, res) => {
  try {
    const { page, limit, package, title } = req.query;
    let result = [];
    //NOTE -if pagination
    const query = {
      offset: Number((page || 1) - 1) * Number(limit || 20),
      limit: Number(limit || 20),
    };

    //NOTE - filter based on package
    const packageParams = package ? { id: package } : {};

    //NOTE - filter based on subscription title
    const titleParams = title ? { title: title } : {};

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const subject_details = await TeacherSubjectMap.findOne({
          where: { teacherId: req.user.id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        //NOTE - filter based on batchTypeId
        params = {
          courseId: subject_details.courseId,
        };
      }

    //NOTE -  Get all subscription details form Subscription Table
    const { rows, count } = await subscriptionDetails.findAndCountAll({
      ...query,
      where: titleParams,
      attributes: ["id", "title", "month","createdAt"],
      include: [
        {
          model: packageDetails,
          attributes: ["name", "courseId"],
          where: { ...packageParams, ...params },
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

    //NOTE - push final response
    for (let data of rows) {
      result.push({
        id: data?.id,
        title: data.title,
        packageName: data.package?.name,
        month: data.month,
        createdByName: data.creator ? data.creator?.name : null,
        createdByRole: data.creator
          ? data.creator?.permission_role?.role
          : null,
        updateByName: data.updater ? data.updater?.name : null,
        updateByRole: data.updater ? data.updater?.permission_role.role : null,
        createdAt : data.createdAt
      });
    }

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

//ANCHOR - Get all Subscription Details
const getSubscriptionDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    //NOTE -  Get  subscription details form Subscription Table
    const subscriptionsDetails = await subscriptionDetails.findOne({
      where: { id: id },

      attributes: ["id", "title", "month", "days"],
      include: {
        model: packageDetails,
        attributes: ["id", "name"],
      },
      order: [["createdAt", "DESC"]],
    });

    //NOTE - Final data push
    const result = {
      id: subscriptionsDetails.id,
      title: subscriptionsDetails.title,
      packageId: subscriptionsDetails.package?.id,
      packageName: subscriptionsDetails.package?.name,
      month: subscriptionsDetails.month,
      days: subscriptionsDetails.days,
    };
    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get all Subscription Details
const getSubscriptionByPackageId = async (req, res) => {
  try {
    const { id } = req.params;

    let result = [];

    //NOTE -  Get  subscription details form Subscription Table
    const subscriptions = await subscriptionDetails.findAll({
      where: { packageId: id },

      attributes: ["id", "title", "month", "days"],
      include: {
        model: packageDetails,
        attributes: ["id", "name"],
      },
      order: [["createdAt", "DESC"]],
    });

    //NOTE - Final data push
    for (const sub of subscriptions) {
      result.push({
        id: sub.id,
        title: sub.title,
        packageId: sub.package?.id,
        packageName: sub.package?.name,
        month: sub.month,
        days: sub.days,
      });
    }
    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - update packages
const updatePackageById = async (req, res) => {
  try {
    const id = req.params.id;
    const { courseId, name, tag, startingPrice, list, packageType } = req.body;

    //NOTE - id from token
    const userId = req.user.id;

    //NOTE - get package details from package table
    const package = await packageDetails.findOne({
      where: { id: id },
    });

    if (!package)
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });

    //NOTE - update in packages tbale
    await packageDetails.update(
      {
        courseId: courseId,
        name: name,
        tag: tag,
        startingPrice: startingPrice,
        list: list,
        packageType: packageType,
        updatedById: userId,
      },
      { where: { id: package.id } }
    );

    //NOTE - update in packageClassMap tbale
    await packageClassMap.update(
      {
        courseId: courseId,
        updatedById: userId,
      },
      { where: { packageId: package.id } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.PACKAGE_UPDATED,
    });
  } catch {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - update Subscription
const updateSubscriptionById = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, month } = req.body;

    //NOTE - id from token
    const userId = req.user.id;

    //NOTE - get subscription details from Subscription table
    const subscription = await subscriptionDetails.findOne({
      where: { id: id },
    });

    if (!subscription)
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });

    //NOTE - update Subscription
    await subscriptionDetails.update(
      {
        title: title,
        month: month,
        days: Math.floor(month * 30), //TODO: Assuming each month has 30 days,
        updatedById: userId,
      },
      { where: { id: subscription.id } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.SUBSCRIPTION_UPDATED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - get all board and class based on the package
const getAllPackagesForBoard = async (req, res) => {
  try {
    const { page, limit, package, subscription } = req.query;

    //NOTE -if pagination
    const query = {
      offset: Number((page || 1) - 1) * Number(limit || 20),
      limit: Number(limit || 20),
    };

    //NOTE - filter based on package id and subscription id
    const filterParams = {
      ...(package && { packageId: package }),
      ...(subscription && { subscriptionId: subscription }),
    };

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const staff = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: ["classId", "batchTypeId"],
        });

        //NOTE - push all user class Ids for
        const classIds = staff.map((item) => item.classId);

        //NOTE - push all batch ids
        const batchIds = staff.map((item) => item.batchTypeId);

        //NOTE - params based on class or batch type
        params = batchIds.every((id) => id === null)
          ? { classId: { [Sequelize.Op.in]: classIds } }
          : { batchTypeId: { [Sequelize.Op.in]: batchIds } };
      }

    //NOTE - Get all class and board details
    const { count, rows } = await packageClassMap.findAndCountAll({
      ...query,
      where: { ...filterParams, ...params },
      include: [
        { model: coursesData, attributes: ["name"] },
        {
          model: packageDetails,
          attributes: ["name", "tag", "startingPrice", "list", "packageType"],
        },
        { model: subscriptionDetails, attributes: ["title", "month", "days"] },
        { model: BoardData, attributes: ["name"] },
        { model: classData, attributes: ["name"] },
        { model: batchTypesData, attributes: ["name"] },
        { model: BatchDate, attributes: ["date"] },
        {
          model: AdminUser,
          as: "creator",
          attributes: ["id", "name"],
          include: { model: RolePermission, attributes: ["role"] },
        },
        {
          model: AdminUser,
          as: "updater",
          attributes: ["id", "name"],
          include: { model: RolePermission, attributes: ["role"] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // NOTE - Push final data
    const result = rows.map((data) => ({
      id: data.id,
      packageName: data.package?.name,
      monthlyPrice: data.monthlyPrice,
      monthlyDiscountedPrice: data.monthlyDiscountedPrice,
      realPrice: data.realPrice,
      subscriptionName: data.subscription?.title,
      courseName: data.course?.name,
      boardName: data.board?.name,
      className: data.class?.name,
      batchTypeName: data.batchType?.name,
      batchStartDate: data.batchDate?.date,
      createdByName: data.creator?.name ?? null,
      createdByRole: data.creator?.permission_role?.role ?? null,
      updateByName: data.updater?.name ?? null,
      updateByRole: data.updater?.permission_role?.role ?? null,
      createdAt: data?.createdAt
    }));

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

//ANCHOR - Edit packages based on the board
const updateIndividualPackage = async (req, res) => {
  try {
    const {
      id,
      packageId,
      subscriptionId,
      boardId,
      classId,
      batchTypeId,
      batchStartDateId,
      monthlyPrice,
      monthlyDiscountedPrice,
      realPrice,
    } = req.body;

    ///NOTE - get user details from token
    const userId = req.user.id;

    //NOTE - check package details
    const checkPackage = await packageDetails.findOne({
      where: { id: packageId },
    });

    //NOTE - Update Values
    await packageClassMap.update(
      {
        boardId: boardId,
        classId: classId,
        batchTypeId: ["Class"].includes(checkPackage.packageType)
          ? null
          : batchTypeId,
        batchStartDateId: ["Class"].includes(checkPackage.packageType)
          ? null
          : batchStartDateId,
        monthlyPrice: monthlyPrice,
        monthlyDiscountedPrice: monthlyDiscountedPrice,
        realPrice: realPrice,
        updatedById: userId,
      },
      {
        where: {
          id: id,
          packageId: packageId,
          subscriptionId: subscriptionId,
        },
      }
    );

    return res.status(200).send({
      status: 200,
      message: msg.PACKAGE_UPDATED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get package class by Id
const getClassDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    //NOTE -  Get class details form package class map Table
    const mappingExist = await packageClassMap.findOne({
      where: { id: id },
      attributes: ["id", "monthlyPrice", "monthlyDiscountedPrice", "realPrice"],
      include: [
        { model: packageDetails, attributes: ["id", "name"] },
        { model: subscriptionDetails, attributes: ["id", "title", "month"] },
        { model: coursesData, attributes: ["id", "name"] },
        { model: BoardData, attributes: ["id", "name"] },
        { model: classData, attributes: ["id", "name"] },
        { model: batchTypesData, attributes: ["id", "name"] },
        { model: BatchDate, attributes: ["id", "date"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!mappingExist)
      return res.status(400).send({
        status: 400,
        message: msg.NOT_FOUND,
      });

    //NOTE - Final data push
    const result = {
      id: mappingExist.id,
      packageId: mappingExist.package?.id,
      packageName: mappingExist.package?.name,
      subscriptionId: mappingExist.subscription?.id,
      subscriptionName: mappingExist.subscription?.name,
      courseId: mappingExist.course?.id,
      courseName: mappingExist.course?.name,
      boardId: mappingExist.board?.id,
      boardName: mappingExist.board?.name,
      classId: mappingExist.class?.id,
      className: mappingExist.class?.name,
      batchTypeId: mappingExist.batchType?.id,
      batchTypeName: mappingExist.batchType?.name,
      batchStartDateId: mappingExist.batchDate?.id,
      batchDate: mappingExist.batchDate?.date,
      monthlyPrice: mappingExist.monthlyPrice,
      monthlyDiscountedPrice: mappingExist.monthlyDiscountedPrice,
      realPrice: mappingExist.realPrice,
      month: mappingExist.subscription?.month,
    };
    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - get Packages Month (Use in admin panel)
const getPackagesMonth = async (req, res) => {
  try {
    let result = [];

    //NOTE - get all package details
    const allData = await packageDetails.findAll({
      attributes: ["id", "name", "packageType"],
      include: [
        {
          model: coursesData,
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    for (const data of allData) {
      //NOTE - push final data
      result.push({
        id: data.id,
        name: data.name,
        courseId: data.course.id,
        courseName: data.course.name,
        packageType: data.packageType,
      });
    }

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

module.exports = {
  createPackages, //TODO - use in admin panel
  createSubscriptionPlan, //TODO - use in admin panel
  addMultipleClasses, //TODO - use in admin panel
  getPackageDetailsById, //TODO - use in web and mobile
  packageListById, //TODO - use in web and mobile
  getAllPackages, //TODO - use in admin panel
  getAllSubscriptions, //TODO - use in admin panel
  updatePackageById, //TODO - use in admin panel
  updateSubscriptionById, //TODO - use in admin panel
  getAllPackagesForBoard, //TODO - use in admin panel
  updateIndividualPackage, //TODO - use in admin panel
  getPackageById, //TODO - use in admin panel
  getSubscriptionDetailsById, //TODO - use in admin panel
  getSubscriptionByPackageId, //TODO - use in admin panel
  getClassDetailsById, //TODO - use in admin panel
  getPackagesMonth, //TODO - use in admin panelss
};
