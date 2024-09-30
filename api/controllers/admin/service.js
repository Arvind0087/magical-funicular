const db = require("../../models/index");
const Admin = db.admin;
const Users = db.users;
const OTP = db.otp;
const crypto = require("crypto");

//NOTE - check admin email and phone
const validateAdminuser = async (email, phone) => {
  var emailValue = false;
  var phoneValue = false;

  const user_exist_email = await Admin.findOne({ where: { email: email } });
  if (user_exist_email) {
    emailValue = true;
  }
  const user_exist_phone = await Admin.findOne({ where: { phone: phone } });
  if (user_exist_phone) {
    phoneValue = true;
  }
  return { emailValue, phoneValue };
};

//NOTE - Generate dynamic OTP
function generate_otp() {
  let digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let OTP = digits[Math.floor(Math.random() * 10)];
  for (let i = 0; i < 3; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

//NOTE - Convert date
function convertDate(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
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

//NOTE - Check existing OTP status
const updateExistingStatus = async (userDetails, id) => {
  let expiry_time = getDates(10, "M");
  let existingOtp = await OTP.findOne({
    where: {
      id: userDetails.id,
      phone: userDetails.phone,
      email: userDetails.email,
      status: 1,
    },
  });

  if (existingOtp) {
    await OTP.update(
      { otp: generate_otp(), expiryTime: expiry_time, userId: id },
      { where: { id: existingOtp.id }, returning: true, plain: true }
    );
    let response = await OTP.findOne({ where: { id: existingOtp.id } });
    return response.otp;
  }
};

//ANCHOR - Generate Otp
const generateOTP = async (phone, email, type) => {
  let expiry_time = getDates(10, "M");
  let foundUser;
  let foundOTP;
  if (phone && type) {
    foundUser = await Admin.findOne({
      where: { phone: phone },
    });
    foundOTP = await OTP.findOne({ where: { phone: phone, status: 1 } });
  } else if (email && type) {
    foundUser = await Admin.findOne({
      where: { email: email, status: 1 },
    });
    foundOTP = await OTP.findOne({
      where: { email: email, status: 1 },
    });
  } else if (phone) {
    foundUser = await Users.findOne({ where: { phone: phone, status: 1 } });
    foundOTP = await OTP.findOne({
      where: { phone: phone, status: 1 },
    });
  }

  const user_id = foundUser ? foundUser.id : null;

  if (foundOTP) {
    const _updateOtp = await updateExistingStatus(foundOTP, user_id);
    return _updateOtp;
  } else {
    const createOtp = await OTP.create({
      userId: user_id,
      otp: generate_otp(),
      phone: phone,
      email: email,
      type: type,
      status: 1,
      expiryTime: expiry_time,
      verified: 0,
    });
    return createOtp.otp;
  }
};

//ANCHOR - Verify OTP
const verifyOTP = async (credentials) => {
  const { phone, email, type, otp } = credentials;

  let user_id;
  let status = false;
  let foundUser;
  if (phone && type && otp) {
    foundUser = await Admin.findOne({ where: { phone: phone } });
  } else if (email && type && otp) {
    foundUser = await Admin.findOne({ where: { email: email } });
  } else if (phone && otp) {
    foundUser = await Users.findAndCountAll({ where: { phone: phone } });
    //console.log("foundUser",foundUser);
  }

  if (foundUser.count === 1) {
    user_id = foundUser.row ? foundUser.row.id : null;
  } else if (foundUser && type) {
    user_id = foundUser ? foundUser.id : null;
  }

  //NOTE Checking Db for OTP
  let foundlinkedOtp;
  if (phone && otp && type) {
    foundlinkedOtp = await OTP.findOne({
      where: {
        phone: phone,
        otp: otp,
        status: 1,
      },
    });
  } else if (email && otp && type) {
    foundlinkedOtp = await OTP.findOne({
      where: {
        email: email,
        otp: otp,
        status: 1,
      },
    });
  } else if (phone && otp) {
    foundlinkedOtp = await OTP.findOne({
      where: {
        phone: phone,
        otp: otp,
        status: 1,
      },
    });
  }

  if (foundlinkedOtp) {
    //NOTE: Update Verification Status  Once the User Verifies With that Particular OTP
    if (foundUser && type) {
      await OTP.update(
        { verified: 1, userId: user_id },
        { where: { id: foundlinkedOtp.id } }
      );
    } else if (foundUser.count === 1) {
      console.log("user_id1", user_id);
      await OTP.update(
        { verified: 1, userId: user_id },
        { where: { id: foundlinkedOtp.id } }
      );
    }
    if (foundUser.count > 1) {
      status = true;
      return [foundUser.rows, status];
    } else if (foundUser && type) {
      status = true;
      return [foundUser, status];
    } else {
      status = true;
      return [foundUser.count, status];
    }
  } else {
    return [foundUser, status];
  }
  return [1, status];
};

//ANCHOR - Validate if the email and phone is unique or not
const validateUser = async (phone, type) => {
  var phoneValue = false;
  const user_exist_phone = await Users.findAll({ where: { phone: phone } });

  if (["Primary"].includes(type)) {
    if (user_exist_phone.length) {
      phoneValue = true;
    }
  }

  return phoneValue;
};

module.exports = {
  generateOTP,
  verifyOTP,
  validateUser,
  validateAdminuser,
};
