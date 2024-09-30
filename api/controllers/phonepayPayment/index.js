const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize, Op } = require("sequelize");
const { config } = require("../../config/db.config")
const { userDetails } = require("../../helpers/userdetails");
const Payment = db.payment;
const UserData = db.users;
const orderDetails = db.orders;
const subscriptionDetails = db.subscription;
const studentSubscriptionMap = db.student_subscription_map;
const studentPlanMap = db.student_plan_map;
const Setting = db.setting;
const Address = db.address;
const coursePackage = db.course_package_map;
const studentCoursePackage = db.student_course_package_map;
const crypto = require("crypto");
const axios = require("axios");
const { calculateSHA256 } = require("./service");
//NOTE - api key and secret
const phonePeApiUrl = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
const saltIndex = "1";
const {
  generateOrderNumber,
  generateBookOrderNumber
} = require("./service");
const { generateVedaOrderId, convertDayIntoDate } = require("../order/service");
const { log } = require("util");


//NOTE - init payment
module.exports.initialPhonePePayment = async (req, res) => {
  try {
    const { packageId, subscriptionId, amount, type, batchTypeId } = req.body;
    const userId = req.user.id;
    // const userId = 1;

    //NOTE - get user details
    const userDetails = await UserData.findOne({
      where: { id: userId },
    });

    //NOTE - type validation
    if (!["Package", "Mentor", "coursePackage"].includes(type)) {
      return res.send({
        status: 400,
        message: msg.TYPE_NOT_VALID,
      });
    }

    //NOTE - generate order Id for payment
    const order_id = await generateOrderNumber(userId);

    //NOTE - if type mentor
    if (["Mentor"].includes(type)) {
      //NOTE - CHECKING subscription details
      const settingData = await Setting.findOne({
        where: {
          type: "mentor",
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      if (settingData.subscriptionType === "Free") {
        //NOTE - creating order for student mentorship
        const getOrderList = orderDetails.create({
          userId: userId,
          amount: settingData.amount,
          purchaseDate: new Date(),
          vedaOrderId:
            generateVedaOrderId() && (await generateVedaOrderId()).toString()
              ? (await generateVedaOrderId()).toString()
              : "Veda-0001",
          type: "Mentor"
        });

        //NOTE - check student subscription details
        const getStudentSubscriptionMap = await studentSubscriptionMap.findOne({
          where: { studentId: userId },
        });

        //NOTE - create when user has no subscription
        if (!getStudentSubscriptionMap || getStudentSubscriptionMap === null) {
          //NOTE - subscription student map
          const subscriptionMap = new studentSubscriptionMap({
            studentId: userId,
            sessionAllocated: settingData.sessionAllocated,
          });
          await subscriptionMap.save();
        }

        //NOTE - update exist subscription data
        if (getStudentSubscriptionMap) {
          await studentSubscriptionMap.update(
            {
              studentId: userId,
              sessionAllocated: (getStudentSubscriptionMap.sessionAllocated +=
                settingData.sessionAllocated),
            },
            { where: { studentId: userId } }
          );
        }
      }
    }

    //NOTE - if type Package
    let subscriptionDays;
    if (["Package"].includes(type)) {
      //NOTE - get subscription data
      const subscriptionData = await subscriptionDetails.findOne({
        where: { id: subscriptionId, packageId: packageId },
      });

      //NOTE - get subscription days count
      subscriptionDays = subscriptionData?.days;
    }

    //NOTE - if type coursePackage
    let lastDate;
    if (["coursePackage"].includes(type)) {

      //NOTE - get course package data
      const packageData = await coursePackage.findOne({
        where: { id: packageId },
      });
      // Parse the date
      let date = new Date(packageData.package_start_date);
      // add validity month
      date.setMonth(packageData.package_start_date.getMonth() + packageData.package_duration);
      lastDate = date
    }
    const token = req.header("Authorization");
    //  const payload = {
    //    merchantId: config.MERCHENT_ID,
    //    merchantTransactionId: order_id,
    //    merchantUserId: userId,
    //    amount: amount * 100,
    //  redirectUrl: config.PHONEPAY_RENTURN_URL
    //  ? `${config.PHONEPAY_RENTURN_URL}?ref_id=${order_id}&token=${token}`
    //  : undefined,    
    //    redirectMode: "REDIRECT",
    //  callbackUrl: config.PHONEPAY_RENTURN_URL
    //  ? `${config.PHONEPAY_RENTURN_URL}?ref_id=${order_id}&token=${token}`
    //  : undefined,    
    //    mobileNumber: 6205319868,
    //    paymentInstrument: {
    //      type: "PAY_PAGE",
    //    },
    //  }
    const payload = {
      "merchantId": config.MERCHENT_ID,
      "merchantTransactionId": order_id,
      "merchantUserId": userId,
      "amount": amount * 100,
      "redirectUrl": config.PHONEPAY_RENTURN_URL
        ? `${config.PHONEPAY_RENTURN_URL}?ref_id=${order_id}&token=${token}`
        : undefined,
      "redirectMode": "REDIRECT",
      "callbackUrl": config.PHONEPAY_RENTURN_URL
        ? `${config.PHONEPAY_RENTURN_URL}?ref_id=${order_id}&token=${token}`
        : undefined,
      "mobileNumber": userDetails.phone,
      "paymentInstrument": {
        "type": "PAY_PAGE"
      }
    }
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );
    const endpoint = "/pg/v1/pay";
    const checksum =
      calculateSHA256(base64Payload + endpoint + config.API_KEY_PHONEPAY) + "###" + saltIndex;

    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    };
    const response = {
      checksum,
      base64Payload,
      ref_id: order_id
    }

    // Push all details to your order table (modify this based on your database structure)
    await orderDetails.create({
      phone: userDetails.phone,
      packageId: ["Package"].includes(type) ? packageId : null,
      coursePackageId: ["coursePackage"].includes(type) ? packageId : null,
      subscriptionId: subscriptionId || null,
      userId: userId,
      vedaOrderId: (await generateVedaOrderId()).toString(),
      orderId: order_id,
      amount,
      validity: ["Package"].includes(type)
        ? await convertDayIntoDate(subscriptionDays) : ["coursePackage"].includes(type) ? lastDate
          : null,
      type: type,
      batchTypeId: batchTypeId || null,
      paymentStatus: "Pending",
      paymentDomain: "PhonePe",
    });
    //NOTE - when amount is zero or less then zero
    if (amount <= 0) {
      //NOTE - final response
      const requestData = {
        status_message: 'FAILED',
      };
      return res.send(requestData);
    }

    return res.send(response);
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};
module.exports.initialWebPhonePePayment = async (req, res) => {
  try {
    const { packageId, subscriptionId, amount, type, batchTypeId } = req.body;
    const userId = req.user.id;
    // const userId = 1;

    //NOTE - get user details
    const userDetails = await UserData.findOne({
      where: { id: userId },
    });

    //NOTE - type validation
    if (!["Package", "Mentor", "coursePackage"].includes(type)) {
      return res.send({
        status: 400,
        message: msg.TYPE_NOT_VALID,
      });
    }

    //NOTE - generate order Id for payment
    const order_id = await generateOrderNumber(userId);

    //NOTE - if type mentor
    if (["Mentor"].includes(type)) {
      //NOTE - CHECKING subscription details
      const settingData = await Setting.findOne({
        where: {
          type: "mentor",
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      if (settingData.subscriptionType === "Free") {
        //NOTE - creating order for student mentorship
        const getOrderList = orderDetails.create({
          userId: userId,
          amount: settingData.amount,
          purchaseDate: new Date(),
          vedaOrderId:
            generateVedaOrderId() && (await generateVedaOrderId()).toString()
              ? (await generateVedaOrderId()).toString()
              : "Veda-0001",
          type: "Mentor"
        });

        //NOTE - check student subscription details
        const getStudentSubscriptionMap = await studentSubscriptionMap.findOne({
          where: { studentId: userId },
        });

        //NOTE - create when user has no subscription
        if (!getStudentSubscriptionMap || getStudentSubscriptionMap === null) {
          //NOTE - subscription student map
          const subscriptionMap = new studentSubscriptionMap({
            studentId: userId,
            sessionAllocated: settingData.sessionAllocated,
          });
          await subscriptionMap.save();
        }

        //NOTE - update exist subscription data
        if (getStudentSubscriptionMap) {
          await studentSubscriptionMap.update(
            {
              studentId: userId,
              sessionAllocated: (getStudentSubscriptionMap.sessionAllocated +=
                settingData.sessionAllocated),
            },
            { where: { studentId: userId } }
          );
        }
      }
    }

    //NOTE - if type Package
    let subscriptionDays;
    if (["Package"].includes(type)) {
      //NOTE - get subscription data
      const subscriptionData = await subscriptionDetails.findOne({
        where: { id: subscriptionId, packageId: packageId },
      });

      //NOTE - get subscription days count
      subscriptionDays = subscriptionData?.days;
    }

    //NOTE - if type coursePackage
    let lastDate;
    if (["coursePackage"].includes(type)) {

      //NOTE - get course package data
      const packageData = await coursePackage.findOne({
        where: { id: packageId },
      });
      // Parse the date
      let date = new Date(packageData.package_start_date);
      // add validity month
      date.setMonth(packageData.package_start_date.getMonth() + packageData.package_duration);
      lastDate = date
    }
    const token = req.header("Authorization");
    //  const payload = {
    //    merchantId: config.MERCHENT_ID,
    //    merchantTransactionId: order_id,
    //    merchantUserId: userId,
    //    amount: amount * 100,
    //  redirectUrl: config.PHONEPAY_RENTURN_URL
    //  ? `${config.PHONEPAY_RENTURN_URL}?ref_id=${order_id}&token=${token}`
    //  : undefined,    
    //    redirectMode: "REDIRECT",
    //  callbackUrl: config.PHONEPAY_RENTURN_URL
    //  ? `${config.PHONEPAY_RENTURN_URL}?ref_id=${order_id}&token=${token}`
    //  : undefined,    
    //    mobileNumber: 6205319868,
    //    paymentInstrument: {
    //      type: "PAY_PAGE",
    //    },
    //  }
    const payload = {
      "merchantId": config.MERCHENT_ID,
      "merchantTransactionId": order_id,
      "merchantUserId": userId,
      "amount": amount * 100,
      "redirectUrl": config.PHONEPAY_RENTURN_URL_WEB
        ? `${config.PHONEPAY_RENTURN_URL_WEB}?ref_id=${order_id}&token=${token}`
        : undefined,
      "redirectMode": "REDIRECT",
      "callbackUrl": config.PHONEPAY_RENTURN_URL_WEB
        ? `${config.PHONEPAY_RENTURN_URL_WEB}?ref_id=${order_id}&token=${token}`
        : undefined,
      "mobileNumber": userDetails.phone,
      "paymentInstrument": {
        "type": "PAY_PAGE"
      }
    }
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );
    const endpoint = "/pg/v1/pay";
    const checksum =
      calculateSHA256(base64Payload + endpoint + config.API_KEY_PHONEPAY) + "###" + saltIndex;

    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    };
    const options = {
      method: 'POST',
      url: phonePeApiUrl,
      headers: headers,
      data: {
        request: base64Payload
      }
    };

    const returnData = async () => {
      try {
        const response = await axios.request(options);
        return response.data.data;
      } catch (error) {

        throw error;
      }
    };

    const responseData = await returnData()

    const response = {
      checksum,
      base64Payload,
      ref_id: order_id,
      responseData,
    }

    // Push all details to your order table (modify this based on your database structure)
    await orderDetails.create({
      phone: userDetails.phone,
      packageId: ["Package"].includes(type) ? packageId : null,
      coursePackageId: ["coursePackage"].includes(type) ? packageId : null,
      subscriptionId: subscriptionId || null,
      userId: userId,
      vedaOrderId: (await generateVedaOrderId()).toString(),
      orderId: order_id,
      amount,
      validity: ["Package"].includes(type)
        ? await convertDayIntoDate(subscriptionDays) : ["coursePackage"].includes(type) ? lastDate
          : null,
      type: type,
      batchTypeId: batchTypeId || null,
      paymentStatus: "Pending",
      paymentDomain: "PhonePe",
    });
    //NOTE - when amount is zero or less then zero
    if (amount <= 0) {
      //NOTE - final response
      const requestData = {
        status_message: 'FAILED',
      };
      return res.send(requestData);
    }

    return res.send(response);
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE - init payment for offline book purchase
module.exports.storePayment = async (req, res) => {
  try {
    const { products, address, userName, phone, email, type, totalAmount } = req.body;

    //NOTE - generate order Id for payment
    const order_id = generateBookOrderNumber();

    const payload = {
      "merchantId": config.MERCHENT_ID,
      "merchantTransactionId": order_id,
      "merchantUserId": null,
      "amount": totalAmount * 100,
      "redirectUrl": config.PHONEPAY_RENTURN_URL
        ? `${config.PHONEPAY_RENTURN_URL}?ref_id=${order_id}`
        : undefined,
      "redirectMode": "REDIRECT",
      "callbackUrl": config.PHONEPAY_RENTURN_URL
        ? `${config.PHONEPAY_RENTURN_URL}?ref_id=${order_id}`
        : undefined,
      "mobileNumber": phone,
      "paymentInstrument": {
        "type": "PAY_PAGE"
      }
    }
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );
    const endpoint = "/pg/v1/pay";
    const checksum =
      calculateSHA256(base64Payload + endpoint + config.API_KEY_PHONEPAY) + "###" + saltIndex;

    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    };
    const response = {
      checksum,
      base64Payload,
      ref_id: order_id
    }


    for (let data of products) {
      //Push all details to your order table (modify this based on your database structure)
      const orderData = await orderDetails.create({
        phone: phone,
        packageId: null,
        subscriptionId: null,
        userId: null,
        vedaOrderId: (await generateVedaOrderId()).toString(),
        orderId: order_id,
        validity: null,
        type: type,
        paymentStatus: "Pending",
        paymentDomain: "PhonePe",
        userName: userName,
        phone: phone,
        email: email,
        title: data.title,
        authorName: data.authorName,
        quantity: data.quantity,
        amount: data.amount,
        totalAmount: totalAmount
      });

      //NOTE - save address for order 
      await Address.create({
        orderId: orderData.id,
        fullAddress: address.fullAddress,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        addressType: address.addressType,
      })
    }


    //NOTE - when amount is zero or less then zero
    if (totalAmount <= 0) {
      //NOTE - final response
      const requestData = {
        status_message: 'FAILED',
      };
      return res.send(requestData);
    }

    return res.send(response);
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports.storePaymentConfirmation = async (req, res) => {

  try {
    const { merchantTransactionId } = req.body;
    const uniqueMerchantId = "M1RA7BTXRZ72";

    // Calculate the X-VERIFY header value
    const endpoint = `/pg/v1/status/${uniqueMerchantId}/${merchantTransactionId}`;
    const checksum = calculateSHA256(endpoint + config.API_KEY_PHONEPAY) + "###" + saltIndex;
    const phonePeApiUrlstatus = config.PHONEPAY_STATUS;
    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": uniqueMerchantId,
    };

    const options = {
      method: "GET",
      url: `${phonePeApiUrlstatus}/${uniqueMerchantId}/${merchantTransactionId}`,
      headers,
    };
    const response = await axios.request(options);
    const paymentStatus = response.data;
    if (paymentStatus?.success && paymentStatus?.code !== "PAYMENT_PENDING") {

      //NOTE - Get all orderdetails from order table
      const getOrder = await orderDetails.findAll({
        where: { orderId: merchantTransactionId },
        attributes: ["id", "totalAmount"],
        order: [["createdAt", "DESC"]],
      });

      for (let order of getOrder) {
        //NOTE - add payment details
        await Payment.create(
          {
            userId: null,
            orderId: order?.id,
            paymentOrderId: merchantTransactionId,
            paymentMode: "online",
            status: "success",
            paymentCurrency: "INR",
            amount: getOrder.totalAmount,
            paymentDate: new Date(),
          },
        );

        // //NOTE - update order table paymentStatus
        await orderDetails.update(
          {
            purchaseDate: new Date(),
            paymentStatus: "Success",
          },
          { where: { id: order?.id } }
        );
      }

      return res.status(200).json({
        status: "success",
        message: paymentStatus?.message,
        data: {
          "payment_status": "success",
          // Include other properties you want to send
          "merchantTransactionId": paymentStatus?.data.merchantTransactionId,
          "transactionId": paymentStatus?.data.transactionId,
          "amount": (paymentStatus?.data.totalAmount) / 100,
          "state": paymentStatus?.data.state,
        },
      });

    } else {
      return res
        .status(500)
        .json({ status: "error", message: paymentStatus?.message });
    }
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports.phonepayPaymentConfirmation = async (req, res) => {
  try {
    const { merchantTransactionId } = req.body;
    const uniqueMerchantId = "M1RA7BTXRZ72";
    const userId = req.user.id;
    //NOTE - Get all orderdetails from order table
    const getOrder = await orderDetails.findOne({
      where: { userId: userId, orderId: merchantTransactionId },
      include: [
        {
          model: subscriptionDetails,
          attributes: ["id", "title", "month"],
        },
      ],
    });
    // Calculate the X-VERIFY header value
    const endpoint = `/pg/v1/status/${uniqueMerchantId}/${merchantTransactionId}`;
    const checksum = calculateSHA256(endpoint + config.API_KEY_PHONEPAY) + "###" + saltIndex;
    const phonePeApiUrlstatus = config.PHONEPAY_STATUS;
    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": uniqueMerchantId,
    };

    const options = {
      method: "GET",
      url: `${phonePeApiUrlstatus}/${uniqueMerchantId}/${merchantTransactionId}`,
      headers,
    };
    const response = await axios.request(options);
    const paymentStatus = response.data;
    if (paymentStatus?.success && paymentStatus?.code !== "PAYMENT_PENDING") {
      //NOTE - add payment details
      await Payment.create(
        {
          userId: userId,
          orderId: getOrder?.id,
          paymentOrderId: merchantTransactionId,
          paymentMode: "online",
          status: "success",
          paymentCurrency: "INR",
          subscriptionId: getOrder.subscriptionId,
          paymentOrderId: merchantTransactionId,
          amount: getOrder.amount,
          paymentDate: new Date(),
        },
      );

      // //NOTE - update order table paymentStatus
      await orderDetails.update(
        {
          purchaseDate: new Date(),
          paymentStatus: "Success",
        },
        { where: { id: getOrder?.id } }
      );

      if (["Package"].includes(getOrder.type)) {
        //NOTE - user subscription type update in user table
        await UserData.update(
          {
            subscriptionType: "Premium",
          },
          { where: { id: getOrder?.userId } }
        );


        //   //NOTE - user subscription type update in user plane map table
        await studentPlanMap.update(
          {
            subscriptionType: "Premium",
            month: getOrder?.subscription?.month,
            validityDay: Math.floor(getOrder?.subscription?.month * 30),
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
          { where: { userId: getOrder?.userId } }
        );
      }
      if (["Mentor"].includes(getOrder?.type)) {
        //NOTE - CHECKING mentorship allocation details
        const settingData = await Setting.findOne({
          where: {
            type: "mentor",
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
            { where: { studentId: getOrder?.userId } }
          );
        }
      }
      if (["coursePackage"].includes(getOrder.type)) {
        //NOTE - user course package
        await studentCoursePackage.create(
          {
            userId: userId,
            packageId: getOrder.coursePackageId,
            batchTypeId: getOrder.batchTypeId,
            validity: getOrder.validity
          },
        );
      }

      //NOTE - final response
      return res.status(200).json({
        status: "success",
        message: paymentStatus?.message,
        data: {
          "payment_status": "success",
          // Include other properties you want to send
          "merchantTransactionId": paymentStatus?.data.merchantTransactionId,
          "transactionId": paymentStatus?.data.transactionId,
          "amount": (paymentStatus?.data.amount) / 100,
          "state": paymentStatus?.data.state,
          // "paymentInstrument": paymentStatus?.data.paymentInstrument,
        },
      });

    } else {
      return res
        .status(500)
        .json({ status: "error", message: paymentStatus?.message });
    }
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};