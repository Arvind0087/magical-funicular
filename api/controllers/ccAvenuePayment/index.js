const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize, Op } = require("sequelize");
const { config } = require("../../config/db.config")
const { createActivity } = require("./ccavutil");
const { retriveLeads } = require("../../helpers/leadsquard");
const { captureLead } = require("../users/service");
const { userDetails } = require("../../helpers/userdetails");
const Payment = db.payment;
const UserData = db.users;
const orderDetails = db.orders;
const subscriptionDetails = db.subscription;
const studentSubscriptionMap = db.student_subscription_map;
const studentPlanMap = db.student_plan_map;
const Setting = db.setting;
const ccav = require('./ccavutil.js'),
  crypto = require('crypto'),
  qs = require('querystring');


//NOTE - init payment
module.exports.initPayment = async (req, res) => {
  try {
    const { packageId, subscriptionId, amount, type } = req.body;
    const userId = req.user.id;

    //NOTE - get user details
    const userDetails = await UserData.findOne({
      where: { id: userId },
    });

    //NOTE - type validation
    if (!["Package", "Mentor"].includes(type)) {
      return res.send({
        status: 400,
        message: msg.TYPE_NOT_VALID,
      });
    }

    //NOTE - generate order Id for payment
    const order_id = await ccav.generateOrderNumber(userId);

    const plainText = `currency=INR&merchant_id=${config.merchantId}&order_id=${order_id}&redirect_url=${config.redirectUrl}&cancel_url=${config.cancelUrl}&amount=${amount}`;

    var md5 = crypto.createHash('md5').update(config.workingKey).digest();
    var keyBase64 = Buffer.from(md5).toString('base64');
    var ivBase64 = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ]).toString('base64');
    const encRequest = ccav.encrypt(plainText, keyBase64, ivBase64);

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
            ccav.generateVedaOrderId() && (await ccav.generateVedaOrderId()).toString()
              ? (await ccav.generateVedaOrderId()).toString()
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
      subscriptionDays = subscriptionData.days;
    }

    //NOTE - push all details in order table
    await orderDetails.create({
      phone: userDetails.phone,
      packageId: packageId || null,
      subscriptionId: subscriptionId || null,
      userId: userId,
      vedaOrderId: await ccav.generateVedaOrderId(),
      orderId: order_id,
      amount: String(amount),
      validity: ["Package"].includes(type)
        ? await ccav.convertDayIntoDate(subscriptionDays)
        : null,
      type: type,
    });

    //NOTE - when amount is zero or less then zero
    if (amount <= 0) {
      //NOTE - final response
      const requestData = {
        status_message: 'FAILED',
      };
      return res.send(requestData);
    }


    //NOTE - final response
    const requestData = {
      status: '0',
      status_message: 'SUCCESS',
      order_id: order_id,
      access_code: config.accessCode,
      redirect_url: config.redirectUrl,
      cancel_url: config.cancelUrl,
      enc_val: encRequest,
      plain: plainText,
      payment_url: config.CCAVENUE_PAYMENT_URL
    };
    return res.send(requestData);
  } catch (err) {
    console.log(err);
  }
};



//NOTE - payment verification
module.exports.paymentVerify = async (req, res) => {
  try {
    var ccavResponse = '';
    var parsedResponse = '';

    const ccavEncResponse = req.body;

    var md5 = crypto.createHash('md5').update(config.workingKey).digest();
    var keyBase64 = Buffer.from(md5).toString('base64');
    var ivBase64 = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ]).toString('base64');

    const encryption = ccavEncResponse.encResp;
    ccavResponse = ccav.decrypt(encryption, keyBase64, ivBase64);
    parsedResponse = qs.parse(ccavResponse);
    console.log('parsedResponse------->', parsedResponse);
     
    const order = parsedResponse.order_id

    //NOTE - find order details
    const getOrder = await orderDetails.findOne({
      where: { orderId: order },
      include: [
        {
          model: subscriptionDetails,
          attributes: ["id", "title", "month"],
        },
      ],
    });


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


    //NOTE - create activity for user
    const data = await createActivity(
      config.LEADSQUARD_API_KEY,
      config.LEADSQUARD_CLIENT_SECRET,  
      config.LEADSQUARD_HOST,
      retriveData[0].ProspectID,
      getOrder.userId,
      getOrder.orderId,
      parsedResponse.order_status,
      userDetail.student.course.name,
      userDetail.student.board.name,
      userDetail.student.class.name
    );

    //NOTE - if response is suceess
    let imageSrc = '';
    if (parsedResponse.order_status === 'Success') {

      //NOTE - add payment details
      await Payment.create(
        {
          userId: getOrder.userId,
          orderId: getOrder.id,
          paymentOrderId: getOrder.orderId,
          paymentMode: parsedResponse.payment_mode,
          status: parsedResponse.order_status,
          trackingId: parsedResponse.tracking_id,
          bankRefNo: parsedResponse.bank_ref_no,
          currency: parsedResponse.currency
        },
      );


      //NOTE - update order table paymentStatus
      await orderDetails.update(
        {
          paymentMode: parsedResponse.payment_mode,
          paymentStatus: "Success",
          trackingId: parsedResponse.tracking_id,
          bankRefNo: parsedResponse.bank_ref_no,
        },
        { where: { id: getOrder.id } }
      );


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


      }
      if (["Mentor"].includes(getOrder.type)) {
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
            { where: { studentId: getOrder.userId } }
          );
        }
      }

      // Use success image for successful payments
      imageSrc =
        'https://media.tenor.com/8YtBJxaqbFYAAAAM/success-successful.gif';
    } else {
      //NOTE - add payment details
      await Payment.create(
        {
          userId: getOrder.userId,
          orderId: getOrder.id,
          paymentOrderId: getOrder.orderId,
          paymentMode: parsedResponse.payment_mode ? parsedResponse.payment_mode : null,
          status: parsedResponse.order_status ? parsedResponse.order_status : null,
          trackingId: parsedResponse.tracking_id ? parsedResponse.tracking_id : null,
          bankRefNo: parsedResponse.bank_ref_no ? parsedResponse.bank_ref_no : null,
          currency: parsedResponse.currency ? parsedResponse.currency : null
        },
      );

      //NOTE - update order table paymentStatus
      await orderDetails.update(
        {
          paymentMode: parsedResponse.payment_mode ? parsedResponse.payment_mode : null,
          paymentStatus: "Failed",
          trackingId: parsedResponse.tracking_id ? parsedResponse.tracking_id : null,
          bankRefNo: parsedResponse.bank_ref_no ? parsedResponse.bank_ref_no : null,
        },
        { where: { id: getOrder.id } }
      );
      // Use fail image for other order_status values
      imageSrc = 'https://i.gifer.com/Od6b.gif';
    }

    const htmlResponse = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment Verification</title>
      </head>
      <body>
        <h1>Payment Verification Result</h1>
        <p>Order ID: ${parsedResponse.order_id}</p>
        <p>Payment Status: ${parsedResponse.order_status}</p>
        <img src="${imageSrc}" alt="${parsedResponse.order_status}" width="200" height="200">

      </body>
    </html>
  `;

    res.setHeader('Content-Type', 'text/html');

    return res.send(htmlResponse);
  } catch (error) {
    console.log(error);
  }
};
