const axios = require("axios");
const db = require("../../../models/index");
const { config } = require("../../../config/db.config");

const ParentUser = db.users;
const Otp = db.otp;

//NOTE - Generate dynamic OTP
function get_otp() {
  let digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let otp = digits[Math.floor(Math.random() * 10)];
  for (let i = 0; i < 3; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

//NOTE - get exipry time
function getDates(interval, duration) {
  const creationDate = new Date();
  let createDate, expiryDate;
  createDate = convertDate(creationDate);
  switch (duration) {
    case "D":
      creationDate.setDate(creationDate.getDate() + interval);
      break;
    case "H":
      creationDate.setHours(creationDate.getHours() + interval);
      break;
    case "M":
      creationDate.setMinutes(creationDate.getMinutes() + interval);
      break;
    case "S":
      creationDate.setSeconds(creationDate.getSeconds() + interval);
      break;
    default:
      break;
  }
  expiryDate = convertDate(creationDate);
  return expiryDate;
}

//NOTE - Convert date
function convertDate(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

//NOTE: send otp to mobile
const sendOtp = async (phone, otp) => {
  const vedaNumber = "91" + phone;
  const mes = `${otp} is your VEDA Academy -Koshish Validation OTP. Do not share this OTP with anyone /NZMtZD19uMg`;

  axios.post(
    `http://smsjust.com/sms/user/urlsms.php?apikey=${config.PINNACLE_API_KEY}&senderid=${config.PINNACLE_SENDER_ID}&message=${mes}&dltentityid=1001110956073638238&dlttempid=1007553940260189354&dest_mobileno=${vedaNumber}&msgtype=TXT&response=Y`
  );
};

//NOTE - Check existing OTP status
const updateExistingStatus = async (otpDetails, user_id) => {
  let expiry_time = getDates(10, "M");
  let existingOtp = await Otp.findOne({
    where: {
      id: otpDetails.id,
      status: 1,
    },
  });

  if (existingOtp) {
    await Otp.update(
      { otp: get_otp(), expiryTime: expiry_time, userId: user_id, verified: 0 },
      { where: { id: existingOtp.id }, returning: true, plain: true }
    );
    let response = await Otp.findOne({ where: { id: existingOtp.id } });
    return response.otp;
  }
};

//NOTE - Generate Otp
const generateOTP = async (user) => {
  let expiry_time = getDates(10, "M");

  //NOTE - check parent otp deatils
  const foundOTP = await Otp.findOne({
    where: { userId: user.id, status: 1 },
  });

  if (foundOTP) {
    const _updateOtp = await updateExistingStatus(foundOTP, user.id); //TODO - update the otp if exist

    return _updateOtp;
  } else {
    //TODO - create new otp
    const createOtp = await Otp.create({
      userId: user.id,
      otp: get_otp(),
      phone: user.phone,
      type: null,
      status: 1,
      expiryTime: expiry_time,
      verified: 0,
    });

    return createOtp.otp;
  }
};

//NOTE - Verify OTP
const verifyParentOtp = async (user, otp) => {
  let status = false;
  //NOTE Checking Db for OTP

  const foundlinkedOtp = await Otp.findOne({
    where: {
      userId: user.id,
      otp,
      phone:user.phone,
      status: 1,
    },
  });

  if (foundlinkedOtp) {
    await Otp.update(
      { verified: 1, userId: user.id, otp },
      { where: { id: foundlinkedOtp.id } }
    );

    status = true;
  }
  return status;
};

//NOTE - get time after 4hr
const getTokenExpiryTime = async () => {
  //NOTE :  Get the current date and time
  let now = new Date();

  //NOTE:  Add 10 days  to the current date and time
  let expiryTime = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

  return expiryTime;
};

module.exports = {
  generateOTP,
  sendOtp,
  verifyParentOtp,
  getTokenExpiryTime,
};
