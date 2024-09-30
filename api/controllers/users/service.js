const axios = require("axios");
const db = require("../../models/index");
const { config } = require("../../config/db.config");
const { defaultImages } = require("../../helpers/studentDefaultImages");
const { dateconverter } = require("../../helpers/dateConverter");
const Admin = db.admin;
const Users = db.users;
const OTP = db.otp;
const StudentDetails = db.student;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;

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
const updateExistingStatus = async (otp, id, type) => {
  let expiry_time = getDates(10, "M");
  let existingOtp = await OTP.findOne({
    where: {
      id: otp.id,
      phone: otp.phone,
      email: otp.email,
      status: 1,
      type: type ? type : null, //TODO - Type should only for admin
    },
  });

  if (existingOtp) {
    await OTP.update(
      { otp: generate_otp(), expiryTime: expiry_time, userId: id, verified: 0 },
      { where: { id: existingOtp.id }, returning: true, plain: true }
    );
    let response = await OTP.findOne({ where: { id: existingOtp.id } });
    return response.otp;
  }
};

//NOTE - Generate Otp
const generateOTP = async (phone, email, type) => {
  let expiry_time = getDates(10, "M");
  let foundUser;
  let foundAsInactiveUser;
  let status = true;

  let foundOTP;

  //NOTE - if phone and type is coming for admin
  if (phone && type) {
    foundUser = await Admin.findOne({ where: { phone } });
    foundOTP = await OTP.findOne({ where: { phone, status: 1, type } });
    //NOTE - if email and type is coming for admin
  } else if (email && type) {
    foundUser = await Admin.findOne({ where: { email, status: 1 } });
    foundOTP = await OTP.findOne({ where: { email, status: 1, type } });
    //NOTE - if phone is coming for user
  } else if (phone) {
    foundUser = await Users.findOne({ where: { phone, status: 1 } });
    foundOTP = await OTP.findOne({ where: { phone, status: 1, type: null } });
    if (!foundUser) {
      foundAsInactiveUser = await Users.findOne({
        where: { phone, status: 0 },
      });
    }
  }
  //NOTE - if user is not active
  if (foundAsInactiveUser) {
    status = false;
    return { status };
  }

  //NOTE - if user  active or new user is coming send otp
  const user_id = foundUser ? foundUser.id : null;
  if (foundOTP) {
    const _updateOtp = await updateExistingStatus(foundOTP, user_id, type);
    return { otp: _updateOtp, status };
  } else {
    const createOtp = await OTP.create({
      userId: user_id,
      otp: generate_otp(),
      phone,
      email,
      type,
      status: 1,
      expiryTime: expiry_time,
      verified: 0,
    });

    return { otp: createOtp.otp, status };
  }
};

//NOTE - Verify OTP
const verifyOTP = async (credentials) => {
  //TODO - Type should only for admin
  const { phone, email, type, otp } = credentials;
  let user_id;
  let status = false;
  let foundUser;
  //NOTE Checking Db for OTP
  let foundlinkedOtp;

  if (phone && otp && type === undefined) {
    foundUser = await Users.findAndCountAll({
      where: { phone: phone, type: "Student", status: 1 },
    });
    foundlinkedOtp = await OTP.findOne({
      where: {
        phone: phone,
        otp: otp,
        status: 1,
        type: null,
      },
    });
  } else if (phone && type && otp) {
    foundUser = await Admin.findOne({ where: { phone: phone } });
    foundlinkedOtp = await OTP.findOne({
      where: {
        phone: phone,
        otp: otp,
        status: 1,
        type: type,
      },
    });
  } else if (email && type && otp) {
    foundUser = await Admin.findOne({ where: { email: email } });
    foundlinkedOtp = await OTP.findOne({
      where: {
        email: email,
        otp: otp,
        status: 1,
        type: type,
      },
    });
  }

  if (foundUser && foundUser.count === 1) {
    user_id = foundUser.rows[0] ? foundUser.rows[0].id : null;
  } else if (foundUser && type) {
    user_id = foundUser ? foundUser.id : null;
  }

  if (foundlinkedOtp) {
    //NOTE: Update Verification Status  Once the User Verifies With that Particular OTP
    if (foundUser && foundUser && type) {
      await OTP.update(
        { verified: 1, userId: user_id },
        { where: { id: foundlinkedOtp.id } }
      );
    } else if (foundUser && foundUser.count === 1) {
      await OTP.update(
        { verified: 1, userId: user_id },
        { where: { id: foundlinkedOtp.id } }
      );
    }
    if (foundUser && foundUser.count > 1) {
      await OTP.update(
        { verified: 0, userId: null },
        { where: { id: foundlinkedOtp.id } }
      );
      status = true;
      return [foundUser.rows, status];
    } else if (foundUser && type) {
      status = true;
      return [foundUser, status];
    } else if (foundUser === null) {
      status = true;
      return [null, status];
    } else {
      status = true;
      return [foundUser.count, status];
    }
  } else if (!foundlinkedOtp) {
    return [foundUser, status];
  } else {
    return [1, status];
  }
};

//NOTE - Validate if the email and phone is unique or not
const validateUser = async (phone, type) => {
  let phoneValue = false;
  let userCount = false;

  if (["Primary", "primary"].includes(type)) {
    const userExistPhone = await Users.findOne({ where: { phone } });
    phoneValue = !!userExistPhone;
  }

  if (["Secondary", "secondary"].includes(type)) {
    const getUserCount = await Users.count({
      where: { phone, type: "Student" },
    });
    userCount = getUserCount >= 5;
  }

  return { phoneValue, userCount };
};

//NOTE - get time after 4hr
const getTokenExpiryTime = async () => {
  //NOTE :  Get the current date and time
  let now = new Date();

  //NOTE:  Add 10 days to the current date and time
  let expiryTime = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

  return expiryTime;
};

//NOTE: send otp to mobile
const sendOtpToPhone = async (phone, otp) => {
  const vedaNumber = "91" + phone;
  const hashKey = " /KPvmKkvQzTg"
  const mes = `${otp} is your VEDA Academy -Koshish Validation OTP. Do not share this OTP with anyone${hashKey}`;

  axios.post(
    `http://smsjust.com/sms/user/urlsms.php?apikey=${config.PINNACLE_API_KEY}&senderid=${config.PINNACLE_SENDER_ID}&message=${mes}&dltentityid=1001110956073638238&dlttempid=1007884938533600917&dest_mobileno=${vedaNumber}&msgtype=TXT&response=Y`
  );
};

const getDefaultImage = (gender) => {
  const images = defaultImages[gender];
  if (images) {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex].image;
  }
};

function generateVedaIdForStudent(userId) {
  //NOTE:  Convert the user ID to a string with leading zeros
  const paddedUserId = String(userId).padStart(2, "0");

  //NOTE: Generate the final string
  const generatedString = `VEDA-${paddedUserId}`;

  return generatedString;
}

function generateVedaIdForParent(userId) {
  //NOTE:  Convert the user ID to a string with leading zeros
  const paddedUserId = String(userId).padStart(2, "0");
  //NOTE: Generate the final string
  const generatedString = `VEDAP-${paddedUserId}`;
  return generatedString;
}

//NOTE - capture lead and create activity
const captureLead = async (
  apiKey,
  clientSecret,
  host,
  name,
  course,
  board,
  classes,
  phone,
  source
) => {
  try {
    const leadData = [
      {
        Attribute: "FirstName",
        Value: name,
      },
      {
        Attribute: "mx_Course",
        Value: course,
      },
      {
        Attribute: "mx_Board",
        Value: board,
      },
      {
        Attribute: "mx_Class",
        Value: classes,
      },
      {
        Attribute: "Phone",
        Value: phone,
      },

      {
        Attribute: "Source",
        Value: source,
      },

    ];
    const response = await axios.post(
      `https://${host}/v2/LeadManagement.svc/Lead.Capture?accessKey=${apiKey}&secretKey=${clientSecret}`,
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

//NOTE - capture lead and create activity
const createActivity = async (
  apiKey,
  clientSecret,
  host,
  phone,
  ID,
  name,
  classes,
  course,
  board
) => {
  try {
    //NOTE - convet current data into format "2023-06-30 11:05:56"
    const originalDate = await dateconverter();
    const leadData = {
      RelatedProspectId: ID,
      ActivityEvent: 216,
      ActivityNote: "Login Activity",
      ProcessFilesAsync: true,
      ActivityDateTime: originalDate,
      Fields: [
        {
          SchemaName: "mx_Custom_1",
          Value: name,
        },
        {
          SchemaName: "mx_Custom_2",
          Value: course,
        },
        {
          SchemaName: "mx_Custom_3",
          Value: board,
        },
        {
          SchemaName: "mx_Custom_5",
          Value: classes,
        },
        {
          SchemaName: "mx_Custom_4",
          Value: originalDate,
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

// Make API request
const retriveLeads = async (apiKey, clientSecret, host, phone) => {
  try {
    const leadData = [
      {
        Attribute: "SearchBy",
        Value: phone,
      },
    ];
    const response = await axios.get(
      `https://${host}/v2/LeadManagement.svc/RetrieveLeadByPhoneNumber?accessKey=${apiKey}&secretKey=${clientSecret}&phone=${phone}`,
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

const studentData = async (typeId) => {
  const studentData = await StudentDetails.findOne({
    where: { id: typeId },
    include: [
      { model: Course, attributes: ["name"] },
      { model: Boards, attributes: ["name"] },
      { model: Class, attributes: ["name"] },
    ],
  });

  return studentData;
};

module.exports = {
  generateOTP,
  verifyOTP,
  validateUser,
  getTokenExpiryTime,
  sendOtpToPhone,
  getDefaultImage,
  generateVedaIdForStudent,
  generateVedaIdForParent,
  captureLead,
  retriveLeads,
  createActivity,
  studentData,
};
