const path = require("path");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { config } = require("../../config/db.config");
const { Op, Sequelize } = require("sequelize");
const { generateVedaOrderId, convertDayIntoDate } = require("../order/service");
const {
  encryptValue,
  decryptValue,
  generateSubMerchantId,
  generateOrderNumber,
} = require("./service");
const { createActivity } = require("./service");
const { retriveLeads } = require("../../helpers/leadsquard");
const { captureLead } = require("../users/service");
const { userDetails } = require("../../helpers/userdetails");
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const UserData = db.users;
const StudentDetails = db.student;
const orderDetails = db.orders;
const packageDetails = db.packages;
const subscriptionDetails = db.subscription;
const ICICPayemntDetails = db.icic_payment_details;
const studentPlanMap = db.student_plan_map;
const studentSubscriptionMap = db.student_subscription_map;
const Setting = db.setting;

//TODO - payment verification only for testing
const PaymentVerification = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      paymentDate,
    } = req.body;
    const secret = config.RAZORPAY_SECRET;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isAuthentic = generated_signature === razorpay_signature;
    const orderInfo = await orderDetails.findOne({
      where: { orderId: razorpay_order_id, userId: userId },
    });

    if (isAuthentic) {
      // Database comes here
      await paymentDetails.create({
        userId: orderInfo.userId,
        orderId: razorpay_order_id,
        packageId: orderInfo.packageId,
        subscriptionId: orderInfo.subscriptionId,
        paymentId: razorpay_payment_id,
        amount: orderInfo.amount,
        paymentDate: new Date(),
      });

      await orderDetails.update(
        {
          userId: orderInfo.userId,
          orderId: orderInfo.razorpay_order_id,
          packageId: orderInfo.packageId,
          subscriptionId: orderInfo.subscriptionId,
          paymentId: orderInfo.razorpay_payment_id,
          amount: orderInfo.amount,
          paymentStatus: "success",
          purchaseDate: new Date(),
        },
        { where: { orderId: razorpay_order_id, userId: orderInfo.userId } }
      );
      return res.status(200).send({
        status: 200,
        message: msg.PAYMENT_VERIFIED,
      });
    } else {
      return res.status(409).send({
        status: 409,
        message: msg.PAYMENT_NOT_VERIFIED,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get All payment Details
const getAllPaymentList = async (req, res) => {
  try {
    const { page, limit, status } = req.query;

    //NOTE - add pagination
    const query = {
      offset: Number((page || 1) - 1) * Number(limit || 20),
      limit: Number(limit || 20),
    };

    //NOTE - filter based on paymentStatus
    const statusParams = status
      ? { paymentStatus: { [Op.like]: "%" + status + "%" } }
      : undefined;

    let staffParams = null;
    if (
      req.user?.role &&
      ["teacher", "mentor"].includes(req.user.role.toLowerCase())
    ) {
      //NOTE - get staff details
      const getAdmin = await AdminUser.findOne({ where: { id: req.user.id } });
      //NOTE - get staff class and batch details
      const teachersSubject = await TeacherSubjectMap.findAll({
        where: { teacherId: getAdmin.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      //NOTE - get all class details
      const classesIds = teachersSubject.map((item) => item.dataValues.classId);
      //NOTE - get all batch details
      const batchIds = teachersSubject.map(
        (item) => item.dataValues.batchTypeId
      );

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

    //NOTE - Get all orderList from order table
    const { count, rows } = await orderDetails.findAndCountAll({
      ...query,
      where: { ...statusParams, ...staffParams },
      attributes: ["id", "orderId", "amount", "paymentStatus", "purchaseDate"],
      include: [
        { model: packageDetails, attributes: ["id", "name"] },
        { model: subscriptionDetails, attributes: ["id", "title"] },
        { model: UserData, attributes: ["id", "name", "phone"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    //NOTE - Final data push
    const result = rows.map((paymnet) => ({
      id: paymnet.id,
      orderId: paymnet.orderId,
      packageName: paymnet.package?.name,
      subscriptionTitle: paymnet.subscription?.title,
      userName: paymnet.user?.name,
      phone: paymnet.user?.phone,
      amount: paymnet?.amount,
      status: paymnet?.paymentStatus,
      paymentDate: paymnet?.purchaseDate,
    }));
    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Get All payment Details
const getPaymentDetailsById = async (req, res) => {
  try {
    const result = [];
    const { id } = req.params;
    const paymentId = id;
    //NOTE - Get all orderlist from order table
    const payment = await paymentDetails.findAndCountAll({
      where: { id: paymentId },
      attributes: [
        "id",
        "userId",
        "transactionId",
        "amount",
        "status",
        "paymentDate",
      ],
      include: [
        {
          model: packageDetails,
          attributes: ["id", "name"],
        },
        {
          model: subscriptionDetails,
          attributes: ["id", "title"],
        },
        {
          model: orderDetails,
          attributes: ["id"],
        },
      ],
    });

    //NOTE - Final data push
    for (const pay of payment.rows) {
      result.push({
        id: pay.id,
        orderId: pay.order.id,
        packageName: pay.package?.name,
        subscriptionTitle: pay.subscription.title,
        amount: pay.amount,
        status: pay.status,
        paymentDate: pay.paymentDate,
        transactionId: pay.transactionId,
      });
    }
    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

const initiatePayment = async (req, res) => {
  try {
    const { packageId, subscriptionId, amount, type } = req.body;
    let subscriptionDays;
    let result;
    //NOTE - get user id  from token
    const userId = req.user.id;

    //NOTE - get user details
    const userDetails = await UserData.findOne({
      where: { id: userId },
    });

    if (!["Package", "Mentor"].includes(type)) {
      return res.send({
        status: 400,
        message: msg.TYPE_NOT_VALID,
      });
    }

    if (["Package"].includes(type)) {
      //NOTE - get subscription data
      const subscriptionData = await subscriptionDetails.findOne({
        where: { id: subscriptionId, packageId: packageId },
      });

      //NOTE - get subscription days count
      subscriptionDays = subscriptionData.days;
    }

    //NOTE - generate order Id for paymnet
    const order_id = await generateOrderNumber(userId);

    //NOTE - push all details in order table
    await orderDetails.create({
      phone: userDetails.phone,
      packageId: packageId || null,
      subscriptionId: subscriptionId || null,
      userId: userId,
      vedaOrderId: await generateVedaOrderId(),
      orderId: order_id,
      amount: String(amount),
      validity: ["Package"].includes(type)
        ? await convertDayIntoDate(subscriptionDays)
        : null,
      paymentMode: 9,
      type: type,
    });

    //NOTE - encrypt referenceNumber
    const pgReferenceNumber = await encryptValue(
      order_id,
      config.PG_SECRET_KEY
    );

    //NOTE - generate subMerchant Id for paymne

    if (Number(amount) === 0) {
      const token = jwt.sign({}, config.SECRET_KEY);
      //NOTE - if amount is coming as 0
      result = `https://vedaacademy.org.in/payment-details/confirmation?ref_id=${pgReferenceNumber}&token=${token}`;
    } else {
      const subMerchantId = await generateSubMerchantId();

      //NOTE - encrypt return
      const pgReturnUrl = await encryptValue(
        config.PG_RENTURN_URL,
        config.PG_SECRET_KEY
      );

      //NOTE - encrypt subMerchantId
      const pgSubMerchantIds = await encryptValue(
        subMerchantId,
        config.PG_SECRET_KEY
      );

      //NOTE - encrypt amount
      const pgPayAmount = await encryptValue(
        String(amount),
        config.PG_SECRET_KEY
      );

      //NOTE - encrypt paymentMode
      const pgPaymentMode = await encryptValue(
        config.PG_PAYMENT_MODE,
        config.PG_SECRET_KEY
      );

      //NOTE - create mandatoryFields
      const mandatoryFields = `${order_id}|${subMerchantId}|${String(amount)}|${userDetails.phone
        }`;

      //NOTE - encrypt mandatoryFields
      const pgMandatoryFields = await encryptValue(
        mandatoryFields,
        config.PG_SECRET_KEY
      );
      //NOTE - create encrypted url for payment
      result = `https://eazypay.icicibank.com/EazyPG?merchantid=${config.PG_MERCHANT_ID}&mandatory fields=${pgMandatoryFields}&optional fields=&returnurl=${pgReturnUrl}&Reference No=${pgReferenceNumber}&submerchantid=${pgSubMerchantIds}&transaction amount=${pgPayAmount}&paymode=${pgPaymentMode}`;
    }

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

const paymentConfirmation = async (req, res) => {
  try {
    //NOTE - payload for ICIC paymnet details
    //try {
    const payload = {
      responseCode: req.body["Response Code"],
      uniqueRefNumber: req.body["Unique Ref Number"],
      serviceTaxAmount: req.body["Service Tax Amount"],
      processingFeeAmount: req.body["Processing Fee Amount"],
      totalAmount: req.body["Total Amount"],
      transctionAmount: req.body["Transction Amount"],
      interchnageValue: req.body["Interchnage Value"],
      tdr: req.body["TDR"],
      paymentMode: req.body["Payment Mode"],
      subMerchantId: req.body["SubMerchantId"],
      referenceNo: req.body["ReferenceNo"],
      icicId: req.body["ID"],
      rs: req.body["RS"],
      tps: req.body["TPS"],
      mandatoryFields: req.body["mandatory fields"],
      optionalFields: req.body["optional fields"],
      rsv: req.body["RSV"],
    };

    //NOTE - push all details in icic bank paymnet details table
    await ICICPayemntDetails.create(payload);

    //NOTE: decrypt Reference no
    const decryptedReference = await decryptValue(
      req.body["ReferenceNo"],
      config.PG_SECRET_KEY
    );

    //NOTE - find order details
    const getOrder = await orderDetails.findOne({
      where: { orderId: decryptedReference },
      include: [
        {
          model: subscriptionDetails,
          attributes: ["id", "title"],
        },
      ],
    });

    //NOTE - update order table paymentStatus
    await orderDetails.update(
      {
        paymentMode: Number(req.body["Payment Mode"]),
        paymentStatus: ["E000"].includes(payload.responseCode)
          ? "Success"
          : "Failed",
      },
      { where: { id: getOrder.id } }
    );

    //TODO - post activity for payment
    //NOTE - get user details
    const userDetail = await userDetails(getOrder.userId);

    //NOTE - retrive Lead
    let retriveData;
    retriveData = await retriveLeads(
      config.LEADSQUARD_API_KEY,
      config.LEADSQUARD_CLIENT_SECRET,
      config.LEADSQUARD_HOST,
      userDetail.phone
    );

    if (retriveData.length < 1) {
      //NOTE - lead capture
      await captureLead(
        config.LEADSQUARD_API_KEY,
        config.LEADSQUARD_CLIENT_SECRET,
        config.LEADSQUARD_HOST,
        userDetail.name,
        userDetail.student.course.name,
        userDetail.student.board.name,
        userDetail.student.class.name,
        userDetail.phone
      );
    }

    // //NOTE - if lead capture for user
    if (retriveData.length < 1) {
      retriveData = await retriveLeads(
        config.LEADSQUARD_API_KEY,
        config.LEADSQUARD_CLIENT_SECRET,
        config.LEADSQUARD_HOST,
        userDetail.phone
      );
    }

    const status = ["E000"].includes(payload.responseCode)
      ? "Success"
      : "Failed";

    //NOTE - create activity for user
    await createActivity(
      config.LEADSQUARD_API_KEY,
      config.LEADSQUARD_CLIENT_SECRET,  
      config.LEADSQUARD_HOST,
      retriveData[0].ProspectID,
      getOrder.userId,
      getOrder.orderId,
      status,
      userDetail.student.course.name,
      userDetail.student.board.name,
      userDetail.student.class.name
    );

    if (["E000"].includes(payload.responseCode))
      if (["Package"].includes(getOrder.type)) {
        //NOTE - user subscription type update in user table
        await UserData.update(
          {
            subscriptionType: "Premium",
          },
          { where: { id: getOrder.userId } }
        );

        //NOTE - user subscription type update in user plane map table
        await studentPlanMap.update(
          {
            subscriptionType: "Premium",
            month: getOrder.subscription?.month,
            validityDay: Math.floor(getOrder.subscription?.month * 30), //TODO: Assuming each month has 30 days
            validityDate: new Date(
              Date.now() +
              Math.floor(getOrder.subscription?.month * 30) *
              24 *
              60 *
              60 *
              1000
            )
              .toISOString()
              .substring(0, 10), //TODO: calculate the date based on the todays date and month given by the admin
            entryType: "Purchase",
          },
          { where: { userId: getOrder.userId } }
        );

        //NOTE - CHECKING mentorship allocation details
        const settingData = await Setting.findOne({
          where: {
            type: "mentor",
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          attributes: ["sessionAllocated"],
        });

        //NOTE - checking mentorship of user
        const mentorshipAllocation = await studentSubscriptionMap.findOne({
          where: { studentId: getOrder.userId },
        });

        //NOTE -  if menotship not avaliable of user
        if (!mentorshipAllocation || mentorshipAllocation === null) {
          //NOTE - subscription student map
          await studentSubscriptionMap.create({
            studentId: getOrder.userId,
            sessionUsed: 0,
            sessionAvailable: 0,
            sessionAllocated: settingData.sessionAllocated,
          });
        }
        //NOTE - if mentorship found of user then update allocation count
        if (mentorshipAllocation) {
          await studentSubscriptionMap.update(
            {
              sessionAllocated: (mentorshipAllocation.sessionAllocated +=
                settingData.sessionAllocated),
            },
            { where: { studentId: getOrder.userId } }
          );
        }
      }

    //NOTE - encrypted
    const encryptedReferenceNo = await encryptValue(
      payload.referenceNo,
      config.PG_SECRET_KEY
    );
    //NOTE - generate token
    const token = jwt.sign(
      { referenceNo: payload.referenceNo },
      config.SECRET_KEY
    );

    // NOTE:  Use EJS to render the HTML page with the retrieved users
    const htmlFileForPaymnet = await ejs.renderFile(
      path.join(__dirname, "paymnet.ejs"),
      {
        encryptedReferenceNo,
        token,
      }
    );

    //NOTE:  Return the rendered HTML page in the response
    return res.send(htmlFileForPaymnet);
    //}
    //  catch (err) {
    //   return res.status(400).send({ status: 400, message: "Something went wrong" });
    // }
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const { ref_id } = req.body;

    //NOTE: decrypt Reference no
    const decryptedReference = await decryptValue(ref_id, config.PG_SECRET_KEY);

    //NOTE - check order
    const order = await orderDetails.findOne({
      where: {
        orderId: decryptedReference,
      },
      attributes: ["type", "userId", "purchaseDate", "orderId", "amount"],
    });

    let paymnetResult;
    if (["Mentor"].includes(order.type)) {
      //NOTE - CHECKING mentorship allocation details
      const settingData = await Setting.findOne({
        where: {
          type: "mentor",
        },
        attributes: ["sessionAllocated"],
      });

      //NOTE - checking mentorship of user
      const mentorshipAllocation = await studentSubscriptionMap.findOne({
        where: { studentId: order.userId },
      });

      //NOTE -  if menotship not avaliable of user
      if (!mentorshipAllocation || mentorshipAllocation === null) {
        //NOTE - subscription student map
        await studentSubscriptionMap.create({
          studentId: order.userId,
          sessionUsed: 0,
          sessionAvailable: 0,
          sessionAllocated: settingData.sessionAllocated,
        });
      }
      //NOTE - if mentorship found of user then update allocation count
      if (mentorshipAllocation) {
        await studentSubscriptionMap.update(
          {
            sessionAllocated: (mentorshipAllocation.sessionAllocated +=
              settingData.sessionAllocated),
          },
          { where: { studentId: order.userId } }
        );
      }
      //NOTE - push result
      paymnetResult = {
        order_id: order.orderId,
        date_of_purchase: order.purchaseDate,
        total_amount: order.amount,
        payment_status: "success",
        message: "Payment Successfully",
      };
    } else {
      //NOTE - find payment details
      const findPaymentDeatails = await ICICPayemntDetails.findOne({
        where: { referenceNo: decryptedReference },
      });
      if (!findPaymentDeatails)
        return res
          .status(400)
          .send({ status: 400, message: msg.PAYMENT_NOT_FOUND });

      //NOTE - push result
      paymnetResult = {
        order_id: findPaymentDeatails.referenceNo,
        date_of_purchase: findPaymentDeatails.transctionDate,
        total_amount: findPaymentDeatails.totalAmount,
        payment_status: "success",
        message: "Payment Successfully",
        // responseCode: findPaymentDeatails.responseCode,
        // uniqueRefNumber: findPaymentDeatails.uniqueRefNumber,
        // serviceTaxAmount: findPaymentDeatails.serviceTaxAmount,
        // processingFeeAmount: findPaymentDeatails.processingFeeAmount,
        // totalAmount: findPaymentDeatails.totalAmount,
        // transctionAmount: findPaymentDeatails.transctionAmount,
        // transctionDate: findPaymentDeatails.transctionDate,
        // interchnageValue: findPaymentDeatails.interchnageValue,
        // tdr: findPaymentDeatails.tdr,
        // paymentMode: findPaymentDeatails.paymentMode,
        // subMerchantId: findPaymentDeatails.subMerchantId,
        // referenceNo: findPaymentDeatails.referenceNo,
        // icicId: findPaymentDeatails.icicId,
        // rs: findPaymentDeatails.rs,
        // tps: findPaymentDeatails.tps,
        // mandatoryFields: findPaymentDeatails.mandatoryFields,
        // optionalFields: findPaymentDeatails.optionalFields,
        // rsv: findPaymentDeatails.rsv,
      };
    }
    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: paymnetResult,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  getAllPaymentList,
  getPaymentDetailsById,
  PaymentVerification,
  initiatePayment,
  paymentConfirmation,
  getPaymentStatus,
};
