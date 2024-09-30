const KJUR = require("jsrsasign");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Op } = require("sequelize");
const moment = require("moment-timezone");
const db = require("../../models/index");
const { dateconverter } = require("../../helpers/dateConverter");
const eventAttendMap = db.event_attend_map;
function generateTokenForZoom(sdkSecret, meetingNumber, appKey, role) {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    sdkKey: sdkSecret,
    mn: meetingNumber,
    role: role,
    iat: iat,
    exp: exp,
    appKey: appKey,
    tokenExp: iat + 60 * 60 * 2,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const signature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);

  return signature;
}

//NOTE- fromTime to toTime
const toTime = (timeString, duration) => {
  // Split the time string into its components
  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  // Create a new Date object and set the hours, minutes, and seconds
  const time_obj = new Date();
  time_obj.setHours(hours);
  time_obj.setMinutes(minutes);
  time_obj.setSeconds(seconds);

  // Add the duration to the Date object
  time_obj.setMinutes(time_obj.getMinutes() + duration);

  // Format the Date object as a time string in 24-hour format
  const new_time_str = time_obj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return new_time_str;
};

//NOTE - Generate dynamic OTP
function generate_otp() {
  let digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let OTP = digits[Math.floor(Math.random() * 10)];
  for (let i = 0; i < 9; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

//

//NOTE - generate token using zoom key and secret
const generateZoomToken = async (ZOOM_API_KEY, ZOOM_API_SECRET) => {
  const config = {
    production: {
      APIKey: ZOOM_API_KEY,
      APISecret: ZOOM_API_SECRET,
    },
  };

  const payload = {
    iss: config.production.APIKey,
    exp: new Date().getTime() + 5000,
  };

  const token = jwt.sign(payload, config.production.APISecret);
  return token;
};

//NOTE - create ZOOM MEETING
const createZoomMeeting = async (accessToken) => {
  try {
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: "Zoom Meeting",
        type: 2,
        password: generate_otp(),
        //duration: 60,
        settings: {
          // add settings object to the request payload
          host_video: true,
          participant_video: false,
          mute_upon_entry: true,
          auto_recording: "none",
          allow_recording: "host",
          waiting_room: false,
          join_before_host: false,
          mute_upon_entry: true,
          host_in_meeting: true, // Only host has permission to start the meeting
          participant_rename: false, // Participants cannot rename themselves
          chat: "host_only", // Chat restricted to host only
          allow_live_streaming: false, // Disable live streaming for participants
          watermark: false, // Disable watermark for participants
          use_pmi: false, // Do not use personal meeting ID
          enforce_login: true, // Participants must log in to join the meeting
          enforce_login_domains: "", // List of domains that participants must belong to
          autoConnectAudio: true, // Automatically connect to audio
          muteAudio: true, // Mute participant's audio
          noVideo: true, // Disable participant's video
          noChat: true, // Disable chat for participants
          noDrivingMode: true, // Disable driving mode for participants
          noInvite: true, // Disable the invite function for participants
          noParticipantID: true, // Disable showing the participant ID
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      const { id, password } = response.data;
      return { id, password };
    } else {
      // console.error("Failed to create Zoom meeting:", response.data);
      //throw new Error("Failed to create Zoom meeting");
      return false;
    }
  } catch (err) {
    //console.error("Error creating Zoom meeting:", err);
    //throw err;
    return false;
  }
};

const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const getDateParams = (category) => {
  const today = new Date();

  let dateParams = {};

  if (category === "yesterday") {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startOfYesterday = new Date(yesterday);
    startOfYesterday.setUTCHours(0, 0, 0, 0);

    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setUTCHours(23, 59, 59, 999);

    dateParams = {
      attemptBy: {
        [Op.between]: [startOfYesterday, endOfYesterday],
      },
    };
  } else if (category === "today") {
    let startOfToday = new Date(today);
    startOfToday.setUTCHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setUTCHours(23, 59, 59, 999);

    dateParams = {
      attemptBy: {
        [Op.between]: [startOfToday.toISOString(), endOfToday.toISOString()],
      },
    };
  } else if (category === "tomorrow") {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const startOfTomorrow = new Date(tomorrow);
    startOfTomorrow.setUTCHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setUTCHours(23, 59, 59, 999);

    dateParams = {
      attemptBy: {
        [Op.between]: [
          startOfTomorrow.toISOString(),
          endOfTomorrow.toISOString(),
        ],
      },
    };
  } else if (category === "all") {
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setMinutes(today.getMinutes());
    startOfToday.setSeconds(today.getSeconds());

    const endOfSixDays = new Date(today);
    endOfSixDays.setDate(today.getDate() + 6);
    endOfSixDays.setHours(23, 59, 59, 999);

    dateParams = {
      attemptBy: {
        [Op.between]: [startOfToday.toISOString(), endOfSixDays.toISOString()],
      },
    };
  }

  return dateParams;
};

const dateFilter = (date) => {
  let val = {};
  const startOfToday = new Date(date);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(date);
  endOfToday.setHours(23, 59, 59, 999);

  val = {
    attemptBy: {
      [Op.between]: [startOfToday.toISOString(), endOfToday.toISOString()],
    },
  };
  return val;
};

const extractTimeFromDateTime = (timeString, time, attemptBy) => {
  var timeArray = time.split(":");
  var hours = parseInt(timeArray[0]);
  var minutes = parseInt(timeArray[1]);

  // convert hours and minutes into total minutes
  var totalMinutes = hours * 60 + minutes;

  var timeObj = new Date(attemptBy.split("T")[0] + "T" + timeString + "Z");

  // add  minutes to Date object
  timeObj.setMinutes(timeObj.getMinutes() + totalMinutes);

  const dateObject = new Date(timeObj);

  //NOTE - convert 2023-04-12T11:30:00.000Z this into 11:30:0
  const hoursS = dateObject.getUTCHours();
  const minutesS = dateObject.getUTCMinutes();
  const seconds = dateObject.getUTCSeconds();

  // format time components into a string
  var StringS = hoursS + ":" + minutesS + ":" + seconds + 0;

  return StringS; // output: "11:30:00"
};

const convertIntoMin = (time) => {
  var timeArray = time.split(":");
  var hours = parseInt(timeArray[0]);
  var minutes = parseInt(timeArray[1]);

  // convert hours and minutes into total minutes
  var totalMinutes = hours * 60 + minutes;

  // var timeObj = new Date(attemptBy.split("T")[0] + "T" + timeString + "Z");

  // // add  minutes to Date object
  // timeObj.setMinutes(timeObj.getMinutes() + totalMinutes);

  // const dateObject = new Date(timeObj);

  return totalMinutes; // output: "11:30:00"
};

function convertTime(time) {
  const parts = time.split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(parts[2], 10);

  const decimalTime = hours + minutes / 60 + seconds / 3600;
  const convertedSeconds = Math.round(decimalTime * 3600);

  const convertedHours = Math.floor(convertedSeconds / 3600);
  const remainingSeconds = convertedSeconds % 3600;
  const convertedMinutes = Math.floor(remainingSeconds / 60);

  return `${convertedHours.toString().padStart(2, "0")}:${convertedMinutes
    .toString()
    .padStart(2, "0")}:${(remainingSeconds % 60).toString().padStart(2, "0")}`;
}

//NOTE - FORMATE TIME LIKE 00:90:00 into 00:90:00
function formatTime(minutes) {
  let hours = Math.floor(minutes / 60);
  let remainingMinutes = minutes % 60;
  let hoursFormatted = (hours % 24).toString().padStart(2, "0");
  let minutesFormatted = remainingMinutes.toString().padStart(2, "0");
  let formattedTime =
    hoursFormatted + ":" + minutesFormatted.padStart(2, "0") + ":00";
  return formattedTime;
}

const addTimeIntoDate = (time) => {
  let datetime = moment.tz(time, "UTC");
  datetime.add(10, "hours");
  let result = datetime.format("YYYY-MM-DDTHH:mm:ss");
  return result;
};

const recordSessionToken = (ZOOM_API_KEY, ZOOM_API_SECRET) => {
  const payload = {
    iss: ZOOM_API_KEY,
    exp: Date.now() + 60000, // Token expires after 1 minute
  };
  const token = jwt.sign(payload, ZOOM_API_SECRET);
  return token;
};

// const startDate = moment().subtract(10, 'days').startOf('day').toDate(); // Start of 10th day before today
// const endDate = moment().endOf('day').toDate(); // End of today

const eventStatus = async (token, event, attemptBy) => {
  const currentDateTime = new Date(); // Get the current date and time
  const eventAttendDetail = await eventAttendMap.findOne({
    where: {
      studentId: token,
      eventId: event,
      date: {
        [Op.eq]: attemptBy,
      },
    },
    attributes: ["id"],
  });
  let status;
  if (!eventAttendDetail) {
    if (attemptBy < currentDateTime) {
      status = "#E60B0B"; //missed  (red)
    } else {
      status = "#F26B35"; //pending (yellow)
    }
  } else {
    // Data found
    status = "#098A4E"; //completed (green)
  }

  return status;
};

//NOTE - capture lead and create activity for student Feedback
const createActivity = async (
  apiKey,
  clientSecret,
  host,
  ID,
  studentId,
  teacherId,
  course,
  board,
  classes
) => {
  try {
    //NOTE - current data
    const originalDate = await dateconverter();
    const leadData = {
      RelatedProspectId: ID,
      ActivityEvent: 212,
      ActivityNote: "Mentorship sessionBooked Activity",
      ProcessFilesAsync: true,
      ActivityDateTime: originalDate,
      Fields: [
        {
          SchemaName: "mx_Custom_1",
          Value: studentId,
        },
        {
          SchemaName: "mx_Custom_2",
          Value: teacherId,
        },
        {
          SchemaName: "mx_Custom_3",
          Value: originalDate,
        },
        {
          SchemaName: "mx_Custom_5",
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

//NOTE - capture lead and create activity for student Feedback
const createActivityMentorship = async (
  apiKey,
  clientSecret,
  host,
  ID,
  studentId,
  teacherId,
  course,
  board,
  classes
) => {
  try {
    //NOTE - current data
    const originalDate = await dateconverter();
    const leadData = {
      RelatedProspectId: ID,
      ActivityEvent: 219,
      ActivityNote: "Mentorship session attend Activity",
      ProcessFilesAsync: true,
      ActivityDateTime: originalDate,
      Fields: [
        {
          SchemaName: "mx_Custom_1",
          Value: studentId,
        },
        {
          SchemaName: "mx_Custom_2",
          Value: teacherId,
        },
        {
          SchemaName: "mx_Custom_3",
          Value: course,
        },
        {
          SchemaName: "mx_Custom_5",
          Value: board,
        },
        {
          SchemaName: "mx_Custom_6",
          Value: classes,
        },
        {
          SchemaName: "mx_Custom_7",
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

//NOTE - capture lead and create activity for student Feedback
const createActivityForExpiryDate = async (
  apiKey,
  clientSecret,
  host,
  ID,
  student,
  course,
  board,
  classes,
  validityDate
) => {
  try {
    //NOTE - current data
    const originalDate = await dateconverter();
    const leadData = {
      RelatedProspectId: ID,
      ActivityEvent: 220,
      ActivityNote: "Product expiry Activity",
      ProcessFilesAsync: true,
      ActivityDateTime: originalDate,
      Fields: [
        {
          SchemaName: "mx_Custom_1",
          Value: student,
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
          SchemaName: "mx_Custom_4",
          Value: classes,
        },
        {
          SchemaName: "mx_Custom_5",
          Value: validityDate,
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

const Attemptbydateconverter = async (dates) => {
  const date = new Date(dates);
  const inputTimestamp = date.toISOString();
  const outputTimestamp = inputTimestamp.slice(0, 19).replace("T", " ");
  return outputTimestamp;
};

//NOTE - capture lead and create activity for live class attend
const createActivityLiveClass = async (
  apiKey,
  clientSecret,
  host,
  ID,
  studentId,
  student,
  teacherId,
  attemptBy,
  course,
  board,
  classes
) => {
  try {
    //NOTE - current data
    const originalDate = await dateconverter();
    const attemptByConvt = await Attemptbydateconverter(attemptBy);
    const leadData = {
      RelatedProspectId: ID,
      ActivityEvent: 217,
      ActivityNote: "Live session attend Activity",
      ProcessFilesAsync: true,
      ActivityDateTime: originalDate,
      Fields: [
        {
          SchemaName: "mx_Custom_1",
          Value: attemptByConvt,
        },
        {
          SchemaName: "mx_Custom_2",
          Value: student,
        },
        {
          SchemaName: "mx_Custom_3",
          Value: course,
        },
        {
          SchemaName: "mx_Custom_4",
          Value: board,
        },
        {
          SchemaName: "mx_Custom_5",
          Value: classes,
        },
        {
          SchemaName: "mx_Custom_6",
          Value: studentId,
        },
        {
          SchemaName: "mx_Custom_7",
          Value: teacherId,
        },
        {
          SchemaName: "mx_Custom_8",
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

//NOTE - capture lead and create activity for live class missed
const createActivityForMissedLiveclass = async (
  apiKey,
  clientSecret,
  host,
  ID,
  studentId,
  student,
  teacherId,
  missDate,
  course,
  board,
  classes
) => {
  try {
    //NOTE - current data
    const originalDate = await dateconverter();
    const attemptByConvt = await Attemptbydateconverter(missDate);
    const leadData = {
      RelatedProspectId: ID,
      ActivityEvent: 223,
      ActivityNote: "Live session missed Activity",
      ProcessFilesAsync: true,
      ActivityDateTime: originalDate,
      Fields: [
        {
          SchemaName: "mx_Custom_1",
          Value: studentId,
        },
        {
          SchemaName: "mx_Custom_2",
          Value: student,
        },
        {
          SchemaName: "mx_Custom_3",
          Value: teacherId,
        },
        {
          SchemaName: "mx_Custom_4",
          Value: attemptByConvt,
        },
        {
          SchemaName: "mx_Custom_5",
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
        {
          SchemaName: "mx_Custom_8",
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

const dateStatus = (status) => {
  let dates;
  if (status) {
    // //NOTE - Get the current datetime
    const now = moment().toDate();
    const currentDate = moment(now).add(5, 'hours').add(30, 'minutes').toDate();
    //NOTE - Set the date range for student event
    const backDate = moment().subtract("days").startOf("day").toDate(); //back date
    backDate.setUTCHours(0, 0, 0, 0);
    const upcomingDate = moment().add(1, "days").endOf("day").toDate();  //upcoming dates
    upcomingDate.setUTCHours(0, 0, 0, 0);
    const endOfYesterday = new Date(backDate);
    endOfYesterday.setUTCHours(23, 59, 59, 999);
    const startOfTomorrow = new Date(upcomingDate);
    startOfTomorrow.setUTCHours(0, 0, 0, 0);
    const todayStart = new Date(currentDate);
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayEnd = new Date(currentDate);
    todayEnd.setUTCHours(23, 59, 59, 999);

    //NOTE - filter based on status
    if (status == "upcoming") {
      dates = {
        attemptBy: {
          [Op.gt]: startOfTomorrow,
        }
      }
    }
    else if (status == "past") {
      dates = {
        attemptBy: {
          [Op.lt]: endOfYesterday,
        }
      }
    }
    else if (status == "ongoing") {
      dates = {
        attemptBy: {
          [Op.between]: [todayStart, todayEnd],
        },
      }
    }
    else if (status == "all") {
      dates = undefined;
    }
  }

  return dates;
}

module.exports = {
  generateTokenForZoom,
  toTime,
  generateZoomToken,
  createZoomMeeting,
  generate_otp,
  daysInMonth,
  getDateParams,
  extractTimeFromDateTime,
  convertIntoMin,
  convertTime,
  formatTime,
  dateFilter,
  addTimeIntoDate,
  recordSessionToken,
  eventStatus,
  createActivity,
  createActivityMentorship,
  createActivityForExpiryDate,
  createActivityLiveClass,
  Attemptbydateconverter,
  createActivityForMissedLiveclass,
  dateStatus
};
