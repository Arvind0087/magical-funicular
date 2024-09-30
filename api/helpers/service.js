const bcrypt = require("bcryptjs");
const atob = require("atob");
const moment = require("moment");
const _ = require("lodash");

async function getBase64ExtensionType(base64Data) {
  const regex =
    /^data:[@a-z]*([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?;base64,/;
  const result = regex.exec(base64Data);
  if (!result) {
    throw new Error("Invalid base64 data");
  }
  const mimeType = result[1] || "application/octet-stream";
  const binaryData = atob(base64Data.replace(regex, ""));
  const uint8Array = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }
  let extension;
  const blob = new Blob([uint8Array], { type: mimeType });
  extension = blob.type.split("/")[1];

  if (extension.includes("svg")) {
    extension = "svg";
  }
  return extension;
}

//NOTE : Extension type
async function getBase64ExtensionTypeTwo(base64Data) {
  let dataType = null;

  if (
    base64Data.startsWith(
      "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;"
    )
  ) {
    dataType = "docx";
  } else if (base64Data.startsWith("data:application/octet-stream;")) {
    dataType = "xlsx";
  } else if (base64Data.startsWith("data:application/pdf;")) {
    dataType = "pdf";
  } else if (base64Data.startsWith("data:application/pdf;")) {
    dataType = "pdf";
  } else {
    dataType = "docx";
  }
  
  return dataType;
}

//NOTE : content type
function getBase64ContentType(base64Data) {
  let contentType = null;

  if (base64Data) {
    const commaIndex = base64Data.indexOf(",");
    if (commaIndex !== -1) {
      const dataHeader = base64Data.substring(0, commaIndex);
      if (dataHeader.startsWith("data:")) {
        contentType = dataHeader.split(":")[1].split(";")[0];
      } else {
      }
    }
  }
  return contentType;
}

function getRandomObjects(arr, n) {
  if (n > arr.length) {
    // NOTE : If n is greater than the length of the array, return the original array
    return [...arr];
  } else {
    //NOTE:  Otherwise, proceed as before
    const copyArray = [...arr];
    const resultArray = [];
    for (let i = 0; i < n; i++) {
      const randomIndex = Math.floor(Math.random() * copyArray.length);
      const randomObject = copyArray.splice(randomIndex, 1)[0];
      resultArray.push(randomObject);
    }
    return resultArray;
  }
}

//NOTE: Convert password to haspassword
async function hashPassword(plaintextPassword, saltRounds) {
  const hashedPassword = await bcrypt.hash(plaintextPassword, saltRounds);
  return hashedPassword;
}

const generateAttemptArray = async (count) => {
  const testArray = [];
  for (let i = 1; i <= count; i++) {
    testArray.push({ name: `Attempt ${i}`, value: i });
  }
  return testArray;
};

//NOTE - convert timezone
const timezoneConverter = (date) => {
  //NOTE :  Create a moment object with the original date and time in the original time zone
  const originalMoment = moment.tz(date, "YYYY-MM-DDTHH:mm:ss", true, "UTC");

  //NOTE : Convert the moment object to the user's local time zone
  const userMoment = originalMoment.clone().tz(moment.tz.guess());

  //NOTE : Format the user's local date and time string
  return userMoment.format("YYYY-MM-DDTHH:mm:ss");
};

const converterType = (value) => {
  const new_data = _.replace(value, /^(.+?)\/(.+?)\.(.+)$/g, "$1_m3u8/$2.m3u8");
  return new_data;
};

//NOTE - add 5:30 hours in createdAt
const addTimeIntoDate = (time) => {
  let datetime = moment.tz(time, "UTC");
  datetime.add(5, "hours");
  datetime.add(30, "minutes");
  let result = datetime.format("YYYY-MM-DDTHH:mm:ss");
  console.log(result);
  return result;
};

//NOTE _ convert day into date
const convertDayIntoDate = async (day) => {
  //NOTE : Get today's date
  const today = new Date();
  //NOTE : Set the number of days to add
  const daysToAdd = day;
  //NOTE : Create a new date by adding the number of days to today's date
  const newDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return newDate;
};

//NOTE _ get days count from the month value
function getDaysCount(months) {
  const daysPerMonth = 30; //TODO: assuming each month has 30 days
  return months * daysPerMonth;
}

module.exports = {
  getBase64ExtensionType,
  getBase64ContentType,
  getRandomObjects,
  hashPassword,
  generateAttemptArray,
  timezoneConverter,
  getBase64ExtensionTypeTwo,
  converterType,
  addTimeIntoDate,
  convertDayIntoDate,
  getDaysCount,
};
