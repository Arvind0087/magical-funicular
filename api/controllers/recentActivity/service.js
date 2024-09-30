const db = require("../../models/index");
const msg = require("../../constants/Messages");
const recentActivityDetails = db.recentActivity;
const moment = require("moment");
const { Sequelize, Op } = require("sequelize");
const _ = require("lodash");
const axios = require("axios");
const { dateconverter } = require("../../helpers/dateConverter");
const UserDetails = db.users;
const StudentDetails = db.student;
const studentSpendTimeMap = db.student_spend_time_map;
const Chapter = db.chapter;
const Subject = db.subject;
const Topic = db.topic;

exports.calculateTotalTime = (getActivitys) => {
  let FINAL = [];
  for (let data of getActivitys) {
    if (getActivitys && data.endTime !== null) {
      const start = new Date(data.start);
      const end = data.end ? new Date(data.end) : new Date();
      const startTime = data.startTime.split(":");
      const endTime = data.endTime.split(":");
      start.setHours(startTime[0], startTime[1], startTime[2] || 0);
      end.setHours(endTime[0], endTime[1], endTime[2] || 0);
      const durationInMs = end - start;
      const durationInMinutes = data.end ? durationInMs / 1000 / 60 : 0;
      FINAL.push(durationInMinutes);
    }
  }
  return FINAL.reduce((acc, val) => acc + val, 0);
};

//NOTE - graph calculation
const graphCount = async (userId, val) => {
  const user_details = await UserDetails.findOne({
    where: { id: userId, type: "Student" },
    attributes: ["createdAt"],
  });

  // get registration month
  const userRegistrationDate = moment(user_details.createdAt);
  //const registrationMonth = userRegistrationDate.format("MMM").toUpperCase();

  // get the start of the date range
  const currentDate = moment();
  let startDate;
  if (currentDate.diff(userRegistrationDate, "months") >= 5) {
    startDate = currentDate.clone().subtract(5, "months").startOf("month");
  } else {
    startDate = userRegistrationDate.startOf("month");
  }

  // initialize the learning time object with 0 values for all months
  const learningTimeByMonth = {};
  moment.monthsShort().forEach((month) => {
    learningTimeByMonth[month] = 0;
  });

  // get user spend time
  const users = await studentSpendTimeMap.findAll({
    where: {
      studentId: userId,
      createdAt: {
        [Sequelize.Op.between]: [startDate, moment().endOf("month")],
      },
    },
    attributes: ["createdAt", "status"],
  });

  let startTime = null;
  let totalTime = 0;

  //NOTE - last user data
  let lastDateData = null;
  for (let i = users.length - 1; i >= 0; i--) {
    const user = users[i];
    if (user.createdAt) {
      lastDateData = new Date(user.createdAt);
      break;
    }
  }

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (user.status === null) {
      // Record the start time if no previous start time recorded
      if (startTime === null) {
        startTime = new Date(user.createdAt);
      }
    } else if (user.status === "close" && startTime !== null) {
      // Calculate the time duration between start and end times
      const endTime = new Date(user.createdAt);
      const startMonth = moment(startTime).format("MMM");
      const endMonth = moment(endTime).format("MMM");

      if (startMonth === endMonth) {
        // The start and end months are the same
        const durationMs = endTime - startTime;
        learningTimeByMonth[startMonth] += durationMs;
      }
      // Reset the start time
      startTime = null;
    }
  }
  // Calculate the duration between the start time and the current time if there is a pending session
  if (startTime !== null) {
    const startMonth = moment(startTime).format("MMM");
    const durationMs = lastDateData - startTime;
    learningTimeByMonth[startMonth] += durationMs;
  }
  // Calculate the duration between the start time and the current time if there is a pending session
  if (startTime !== null) {
    const startMonth = moment(startTime).format("MMM");
    const durationMs = lastDateData - startTime;
    learningTimeByMonth[startMonth] += durationMs;
  }

  let lastCloseIndex = -1;

  //NOTE - last close of user data index number
  for (let i = users.length - 1; i >= 0; i--) {
    if (users[i].status === "close") {
      lastCloseIndex = i;
      break;
    }
  }

  let firstNullAfterLastClose = null;
  let lastNonNullAfterLastClose = null;

  if (lastCloseIndex !== -1) {
    const closeMonth = moment(users[lastCloseIndex].createdAt).format("MMM");

    for (let i = lastCloseIndex + 1; i < users.length; i++) {
      const user = users[i];
      if (user) {
        const userMonth = moment(user.createdAt).format("MMM");

        if (userMonth === closeMonth) {
          lastNonNullAfterLastClose = new Date(user.createdAt);
          if (!firstNullAfterLastClose) {
            firstNullAfterLastClose = lastNonNullAfterLastClose;
          }
        } else {
          // Break the loop if a different month is encountered
          break;
        }
      }
    }

    if (firstNullAfterLastClose) {
      const durationMs = lastNonNullAfterLastClose - firstNullAfterLastClose;
      totalTime += durationMs;

      // Add the learning time to the corresponding month
      const month = moment(lastNonNullAfterLastClose).format("MMM");
      learningTimeByMonth[month] += durationMs;
    }
  }

  // Create an array of objects for each month with the month name and learning time
  const monthData = [];
  let currentDateRange = moment().endOf("month");

  let final = 0;
  while (currentDateRange >= startDate) {
    const month = currentDateRange.format("MMM");
    const onlyForTotal = learningTimeByMonth[month] / 1000 / 60;
    final += onlyForTotal;
    const totalMinutes = learningTimeByMonth[month] / 1000 / 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedTime = hours + minutes / 100;
    monthData.push({
      month: month,
      learningTime: Number(formattedTime.toFixed(2)),
    });
    currentDateRange.subtract(1, "months");
  }

  //NOTE - total learn time of user
  const hours = Math.floor(final / 60);
  const minutes = final % 60;
  const totalLeartime = Number((hours + minutes / 100).toFixed(2));
  return { monthdata: monthData.reverse(), totalTime: totalLeartime };
};

//NOTE - convert into 5:30 more hours
exports.convertIntoIndianZone = (data) => {
  return new Date(Date.parse(data) + 5.5 * 60 * 60 * 1000).toISOString();
};

//NOTE - spendTime calculation
const spentTimeCalculation = (users) => {
  let startTime = null;
  let totalTime = 0;

  //NOTE - last user data
  let lastDateData = null;
  for (let i = users.length - 1; i >= 0; i--) {
    const user = users[i];
    if (user.createdAt) {
      lastDateData = new Date(user.createdAt);
      break;
    }
  }

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (user.status === null) {
      // Record the start time if no previous start time recorded
      if (startTime === null) {
        startTime = new Date(user.createdAt);
      }
    } else if (user.status === "close" && startTime !== null) {
      // Calculate the time duration between start and end times
      const endTime = new Date(user.createdAt);
      const durationMs = endTime - startTime;
      totalTime += durationMs;
      // Reset the start time
      startTime = null;
    }
  }

  // Calculate the duration between the start time and the current time if there is a pending session
  if (startTime !== null) {
    ///const endTime = new Date();
    const durationMs = lastDateData - startTime;
    totalTime += durationMs;
  }

  let lastCloseIndex = -1;
  //let firstNullAfterLastClose = null;

  //NOTE - last close of user data index number
  for (let i = users.length - 1; i >= 0; i--) {
    if (users[i].status === "close") {
      lastCloseIndex = i;
      break;
    }
  }

  let firstNullAfterLastClose = null;
  let lastNonNullAfterLastClose = null;

  if (lastCloseIndex !== -1) {
    for (let i = lastCloseIndex + 1; i < users.length; i++) {
      let user = users[i];
      if (user) {
        lastNonNullAfterLastClose = new Date(user.createdAt);
        if (!firstNullAfterLastClose) {
          firstNullAfterLastClose = lastNonNullAfterLastClose;
          const durationMs =
            lastNonNullAfterLastClose - firstNullAfterLastClose;
          totalTime += durationMs;
        }
      }
    }
  }

  // Convert the total time from milliseconds to hours
  const totalHours = Math.round(totalTime / 1000 / 60);

  return totalHours;
};

//NOTE - capture lead and create activity for video watch
const createActivity = async (
  apiKey,
  clientSecret,
  host,
  ID,
  name,
  videoId,
  course,
  board,
  classes,
  subject,
  chapter,
  topic
) => {
  try {
    //NOTE - current data
    const originalDate = await dateconverter();
    const leadData = {
      RelatedProspectId: ID,
      ActivityEvent: 209,
      ActivityNote: "Pre record lectureSeen Activity",
      ProcessFilesAsync: true,
      ActivityDateTime: originalDate,
      Fields: [
        {
          SchemaName: "mx_Custom_1",
          Value: name,
        },
        {
          SchemaName: "mx_Custom_2",
          Value: videoId,
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
          Value: originalDate,
        },
        {
          SchemaName: "mx_Custom_7",
          Value: subject,
        },
        {
          SchemaName: "mx_Custom_8",
          Value: chapter,
        },
        {
          SchemaName: "mx_Custom_9",
          Value: topic,
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

//NOTE - find topic details
const topicData = async (topicId) => {
  const topics = await Topic.findOne({
    attributes: ["name"],
    where: {
      id: topicId,
    },
    include: [
      { model: Subject, attributes: ["name"] },
      { model: Chapter, attributes: ["name"] },
    ],
  });
  return topics;
};

module.exports = {
  createActivity,
  graphCount,
  spentTimeCalculation,
  topicData,
};
