const crypto = require("crypto");
const axios = require("axios");
const { dateconverter } = require("../../helpers/dateConverter");

//NOTE - encrypted value
function encryptValue(plainText, key, outputEncoding = "base64") {
  const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
  return Buffer.concat([cipher.update(plainText), cipher.final()]).toString(
    outputEncoding
  );
}

//NOTE - decrypted value
const decryptValue = async (cipherText, key, outputEncoding = "utf8") => {
  const decipher = crypto.createDecipheriv("aes-128-ecb", key, null);
  const decrypted = Buffer.concat([
    decipher.update(cipherText, "base64"),
    decipher.final(),
  ]);
  const value = decrypted.toString(outputEncoding);
  return value;
};

//NOTE - Generate Sub MerchantId
function generateSubMerchantId() {
  const randomNumber = Math.floor(Math.random() * Math.pow(10, 10));
  return randomNumber.toString().padStart(10, "0");
}

//NOTE - Generate order id
function generateOrderNumber(userId) {
  const randomNumber = Math.floor(Math.random() * Math.pow(10, 8));
  const paddedUserId = userId.toString().padStart(2, "0");
  return `VEDA${randomNumber}${paddedUserId}`;
}

//NOTE - capture lead and create activity for payment tried
const createActivity = async (
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

module.exports = {
  encryptValue,
  decryptValue,
  generateSubMerchantId,
  generateOrderNumber,
  createActivity,
};
