const { Sequelize } = require("sequelize");
const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { generateVedaOrderId } = require("./service");
const { icicPaymentMode } = require("../../helpers/icicPaymnetJson");
const { getSignedUrlCloudFront } = require("../../helpers/cloudFront");
const UserDetails = db.users;
const StudentDetails = db.student;
const TeacherSubjectMap = db.teacher_subject_map;
const orderDetails = db.orders;
const packageDetails = db.packages;
const subscriptionDetails = db.subscription;
const AllCourses = db.courses;
const BoardData = db.boards;
const classData = db.class;
const studentSubscriptionMap = db.student_subscription_map;
const Setting = db.setting;

//ANCHOR - get all orderlist
const getAllOrdersList = async (req, res) => {
  try {
    const { page, limit } = req.query;

    //NOTE -if pagination
    const query = {
      offset: Number((page || 1) - 1) * Number(limit || 20),
      limit: Number(limit || 20),
    };

    let staffParams = null;
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
      const students = await StudentDetails.findAll({ where: idParams });
      //NOTE - get all students type ids
      const typeIds = students.map((item) => item.dataValues.id);

      staffParams = { userId: { [Sequelize.Op.in]: typeIds } };
    }

    //NOTE - Get all orderlist from order table
    const { count, rows } = await orderDetails.findAndCountAll({
      ...query,
      where: { ...staffParams },
      attributes: [
        "orderId",
        "purchaseDate",
        "amount",
        "paymentMode",
        "validity",
      ],
      include: [
        { model: packageDetails, attributes: ["id", "name"] },
        { model: subscriptionDetails, attributes: ["id", "title"] },
        { model: UserDetails, attributes: ["name", "phone"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    //NOTE - Final data push
    const result = rows.map((ord) => {
      const paymentMode = ord?.paymentMode;
      const selectedPaymentMode =
        paymentMode !== undefined && paymentMode !== null
          ? icicPaymentMode[paymentMode]?.paymentMode
          : null;

      return {
        id: ord.id,
        orderId: ord?.orderId,
        userName: ord?.user?.name,
        phone: ord?.user?.phone,
        packageName: ord.package?.name,
        subscriptionTitle: ord?.subscription?.title,
        purchaseDate: ord?.purchaseDate,
        amount: ord?.amount,
        paymentMode: selectedPaymentMode,
        validity: ord?.validity,
        autoRenewal: null,
        invoice: null,
      };
    });

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

//ANCHOR - Get order details by id
const getOrderDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    //NOTE - Get all orderdetails from order table
    const orderData = await orderDetails.findOne({
      where: { id: id },
      attributes: [
        "id",
        "purchaseDate",
        "amount",
        "paymentMode",
        "validity",
        "autoRenewal",
        "invoice",
        "usertype",
        "userId",
      ],
      include: [
        { model: packageDetails, attributes: ["id", "name"] },
        { model: subscriptionDetails, attributes: ["id", "title"] },
        { model: BoardData, attributes: ["id", "name"] },
        { model: classData, attributes: ["id", "name"] },
      ],
    });

    //NOTE - final result
    const result = {
      id: orderData.id,
      packageName: orderData.package?.name,
      subscriptionTitle: orderData.subscription.title,
      boardName: orderData.board?.name,
      className: orderData.class?.name,
      purchaseDate: orderData.purchaseDate,
      amount: orderData.amount,
      paymentMode: orderData.paymentMode,
      validity: orderData.validity,
      packageStatus: orderData.packageStatus,
      autoRenewal: orderData.autoRenewal,
      invoice: orderData.invoice,
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

//ANCHOR - Get order details student by id
const getOrderDetailsByStudentId = async (req, res) => {
  try {
    const { userId, orderId } = req.query;

    //NOTE - Get all orderdetails from order table
    const orderData = await orderDetails.findOne({
      where: { userId: userId, orderId: orderId },
      include: [
        { model: packageDetails, attributes: ["id", "name"] },
        { model: subscriptionDetails, attributes: ["id", "title"] },
      ],
    });

    const User = await UserDetails.findOne({
      where: { type: "Student", id: userId },
      include: {
        model: StudentDetails,
        include: [
          { model: AllCourses, attributes: ["id", "name"] },
          { model: BoardData, attributes: ["id", "name"] },
          { model: classData, attributes: ["id", "name"] },
        ],
      },
    });
    if (!User)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    //NOTE - final data
    const result = {
      id: orderData.id,
      packageName: orderData.package?.name,
      subscriptionTitle: orderData.subscription?.title,
      courseName: User.student.course?.name,
      boardName: User.student.board?.name,
      className: User.student.class?.name,
      amount: orderData.amount,
      paymentMode: orderData.paymentMode,
      validity: orderData.validity,
      packageStatus: orderData.packageStatus,
      autoRenewal: orderData.autoRenewal,
      invoice: orderData.invoice,
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

//ANCHOR - Get order details student by id
const getStudentAllOrderById = async (req, res) => {
  try {
    //NOTE - get user details from token
    const userId = req.user.id;

    //NOTE - get all user details and order details
    const [userDetails, orders] = await Promise.all([
      //NOTE - get user details
      UserDetails.findOne({
        where: { id: userId, type: "Student" },
        include: {
          model: StudentDetails,
          include: [
            { model: AllCourses, attributes: ["id", "name"] },
            { model: BoardData, attributes: ["id", "name"] },
            { model: classData, attributes: ["id", "name"] },
          ],
        },
      }),

      //NOTE - get order details
      orderDetails.findAll({
        where: {
          userId: userId,
        },
        include: [
          {
            model: packageDetails,
            attributes: ["id", "name"],
            include: { model: AllCourses, attributes: ["image"] },
          },
          { model: subscriptionDetails, attributes: ["id", "title"] },
        ],
        order: [["createdAt", "DESC"]],
      }),
    ]);

    //NOTE - push final data

    const result = await Promise.all(
      orders.map(async (ord) => {
        const avatar = ord.package?.course?.image
          ? await getSignedUrlCloudFront(ord.package?.course?.image)
          : null;

        return {
          id: ord.id,
          orderId: ord.orderId,
          image: avatar,
          packageName: ord.package?.name ?? null,
          title: ord.subscription?.title ?? "Mentorship",
          userName: userDetails?.name,
          boardName: userDetails.student?.board?.name,
          className: userDetails.student?.class?.name,
          purchaseDate: ord.purchaseDate,
          amount: ord.amount,
          paymentMode: icicPaymentMode.find(
            (data) => data.id === ord?.paymentMode
          )?.paymentMode,
          validity: ord?.validity,
          packageStatus: ord?.packageStatus,
          status: ord?.paymentStatus,
          autoRenewal: null,
          invoice: null,
        };
      })
    );

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//TODO - only for testing
const mentorAllocation = async (req, res) => {
  try {
    const { studentId } = req.body;
    const token = req.user.id;
    
    //NOTE - CHECKING subscription details
    const settingData = await Setting.findOne({
      where: {
        type: "mentor",
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    let getOrderList;
    if (settingData.subscriptionType === "Free") {
      //NOTE - creating order for student mentorship

      const orderList = new orderDetails({
        userId: token,
        amount: settingData.amount,
        purchaseDate: new Date(),
        vedaOrderId:
          generateVedaOrderId() && (await generateVedaOrderId()).toString()
            ? (await generateVedaOrderId()).toString()
            : "Veda-0001",
      });

      getOrderList = await orderList.save();

      const getStudentSubscriptionMap = await studentSubscriptionMap.findOne({
        where: { studentId: token },
      });

      if (!getStudentSubscriptionMap || getStudentSubscriptionMap === null) {
        //NOTE - subscription student map
        const subscriptionMap = new studentSubscriptionMap({
          studentId: token,
          sessionAllocated: settingData.sessionAllocated,
        });
        const getSubscription = await subscriptionMap.save();
      }
      if (getStudentSubscriptionMap) {
        await studentSubscriptionMap.update(
          {
            studentId: token,
            sessionAllocated: (getStudentSubscriptionMap.sessionAllocated +=
              settingData.sessionAllocated),
          },
          { where: { studentId: token } }
        );
      }
    }

    if (getOrderList) {
      return res.status(200).send({
        status: 200,
        message: msg.MENTORSHIP_SESSION_ALLOCATED,
      });
    } else {
      return res.status(400).send({
        status: 400,
        message: msg.TRY_AGAIN,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//TODO - only for testing
const getAllowedSessionByUserId = async (req, res) => {
  try {
    const { userId } = req.query;

    const getStudentSubscriptionMap = await studentSubscriptionMap.findOne({
      where: { studentId: userId },
    });
    if (!getStudentSubscriptionMap) {
      //NOTE - find user
      const foundUser = await UserDetails.findOne({
        where: { id: userId },
        attributes: ["name"],
      });

      let final = {
        studentId: userId,
        name: foundUser.name,
        sessionAllocated: 0,
        sessionUsed: 0,
        sessionAvailable: 0,
      };
      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: final,
      });
    }

    let left =
      getStudentSubscriptionMap.sessionAllocated -
      getStudentSubscriptionMap.sessionUsed;

    //NOTE - find user
    const foundUser = await UserDetails.findOne({
      where: { id: userId },
      attributes: ["name"],
    });

    let final = {
      id: getStudentSubscriptionMap.id,
      studentId: getStudentSubscriptionMap.studentId,
      name: foundUser.name,
      sessionAllocated: getStudentSubscriptionMap.sessionAllocated,
      sessionUsed:
        getStudentSubscriptionMap.sessionUsed === null
          ? 0
          : getStudentSubscriptionMap.sessionUsed,
      sessionAvailable: left,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: final,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

module.exports = {
  getAllOrdersList,
  getOrderDetailsById,
  getOrderDetailsByStudentId, // not use
  getStudentAllOrderById, //TODO - Use in web and app
  mentorAllocation,
  getAllowedSessionByUserId,
};
