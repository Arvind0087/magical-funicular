const db = require("../../models/index");
const orderDetails = db.orders;
var crypto = require('crypto');
const axios = require("axios");
const { dateconverter } = require("../../helpers/dateConverter");
function getAlgorithm(keyBase64) {
  var key = Buffer.from(keyBase64, 'base64');
  switch (key.length) {
    case 16:
      return 'aes-128-cbc';
    case 32:
      return 'aes-256-cbc';
  }
  throw new Error('Invalid key length: ' + key.length);
}

exports.encrypt = function (plainText, keyBase64, ivBase64) {
  const key = Buffer.from(keyBase64, 'base64');
  const iv = Buffer.from(ivBase64, 'base64');

  const cipher = crypto.createCipheriv(getAlgorithm(keyBase64), key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

exports.decrypt = function (messagebase64, keyBase64, ivBase64) {
  const key = Buffer.from(keyBase64, 'base64');
  const iv = Buffer.from(ivBase64, 'base64');

  const decipher = crypto.createDecipheriv(getAlgorithm(keyBase64), key, iv);
  let decrypted = decipher.update(messagebase64, 'hex');
  decrypted += decipher.final();
  return decrypted;
};


//NOTE - generate veda orderId
exports.generateVedaOrderId = async () => {
  const lastOrder = await orderDetails.findAll({
    order: [["id", "DESC"]],
    limit: 1,
  });

  const lastOrderId = lastOrder.length ? lastOrder[0].vedaOrderId : null;
  if (lastOrderId === null) {
    return "Veda-0001";
  }

  const counter = parseInt(lastOrderId.slice(-4));
  const orderId = `${lastOrderId.slice(0, -4)}${(counter + 1)
    .toString()
    .padStart(4, "0")}`;
  return orderId;
};

//NOTE - convert day into date
exports.convertDayIntoDate = async (day) => {
  //NOTE : Get today's date
  const today = new Date();
  //NOTE : Set the number of days to add
  const daysToAdd = day;
  //NOTE : Create a new date by adding the number of days to today's date
  const newDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return newDate;
};

//NOTE - Generate order id
exports.generateOrderNumber = async (userId) => {
  const randomNumber = Math.floor(Math.random() * Math.pow(10, 8));
  const paddedUserId = userId.toString().padStart(2, "0");
  return `VEDA${randomNumber}${paddedUserId}`;
}




//NOTE - capture lead and create activity for payment tried
exports.createActivity = async (
  apiKey,
  clientSecret,
  host,
  ID,
  studentId,
  orderId,
  status,
  course,
  board,
  classes
) => {
  try {
    //NOTE - current data
    const originalDate = await dateconverter();
    const leadData = {
      RelatedProspectId: ID,
      ActivityEvent: 213,
      ActivityNote: "Payment Activity",
      ProcessFilesAsync: true,
      ActivityDateTime: originalDate,
      Fields: [
        {
          SchemaName: "mx_Custom_1",
          Value: studentId,
        },
        {
          SchemaName: "mx_Custom_2",
          Value: orderId,
        },
        {
          SchemaName: "mx_Custom_4",
          Value: status,
        },
        {
          SchemaName: "mx_Custom_5",
          Value: originalDate,
        },
        {
          SchemaName: "mx_Custom_3",
          Value: course,
        },
        {
          SchemaName: "mx_Custom_6",
          Value: board,
        },
        {
          SchemaName: "mx_Custom_7",
          Value: classes,
        },
      ],
    };

    //NOTE - post activity
    const response = await axios.post(
      `https://${host}/v2/ProspectActivity.svc/Create?accessKey=${apiKey}&secretKey=${clientSecret}`,
      leadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
