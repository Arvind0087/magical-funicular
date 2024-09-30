const axios = require("axios");
const { dateconverter } = require("../../helpers/dateConverter");

function addTestAttemptTimes(time1, time2) {
  const [hours1, minutes1, seconds1] = time1.split(":").map(Number); // Convert time1 to an array of hours, minutes, and seconds
  const [hours2, minutes2, seconds2] = time2.split(":").map(Number); // Convert time2 to an array of hours, minutes, and seconds

  const totalSeconds = seconds1 + seconds2; // Add the seconds
  const totalMinutes = minutes1 + minutes2 + Math.floor(totalSeconds / 60); // Add the minutes and any "carry-over" from seconds
  const totalHours = hours1 + hours2 + Math.floor(totalMinutes / 60); // Add the hours and any "carry-over" from minutes

  const resultSeconds = totalSeconds % 60; // Calculate the remaining seconds
  const resultMinutes = totalMinutes % 60; // Calculate the remaining minutes
  const resultHours = totalHours; // The total hours are already calculated

  const result = `${String(resultHours).padStart(2, "0")}:${String(
    resultMinutes
  ).padStart(2, "0")}:${String(resultSeconds).padStart(2, "0")}`; // Combine the result into a string in the format "HH:mm:ss"

  return result;
}

//NOTE - capture lead and create activity for No. of Attempt test
const createActivity = async (
  apiKey,
  clientSecret,
  host,
  ID,
  studentId,
  testId,
  scholarshipId,
  quizId,
  questionId,
  answer,
  attemptCount,
  startDate,
  status,
  startId,
  course,
  board,
  classes
) => {
  try {
    //NOTE - current data
    const originalDate = await dateconverter();
    const leadData = {
      RelatedProspectId: ID,
      ActivityEvent: 206,
      ActivityNote: "Test Attempt Activity",
      ProcessFilesAsync: true,
      ActivityDateTime: originalDate,
      Fields: [
        {
          SchemaName: "mx_Custom_1",
          Value: studentId,
        },
        {
          SchemaName: "mx_Custom_2",
          Value: testId,
        },
        {
          SchemaName: "mx_Custom_3",
          Value: scholarshipId,
        },
        {
          SchemaName: "mx_Custom_4",
          Value: questionId,
        },
        {
          SchemaName: "mx_Custom_5",
          Value: answer,
        },
        {
          SchemaName: "mx_Custom_6",
          Value: attemptCount,
        },
        {
          SchemaName: "mx_Custom_7",
          Value: startDate,
        },
        {
          SchemaName: "mx_Custom_17",
          Value: status,
        },

        {
          SchemaName: "mx_Custom_8",
          Value: startId,
        },
        {
          SchemaName: "mx_Custom_9",
          Value: course,
        },
        {
          SchemaName: "mx_Custom_10",
          Value: board,
        },
        {
          SchemaName: "mx_Custom_11",
          Value: classes,
        },
        {
          SchemaName: "mx_Custom_13",
          Value: originalDate,
        },
        {
          SchemaName: "mx_Custom_14",
          Value: quizId,
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

//NOTE - capture lead and create activity for No. of Attempt test
const createActivityForQuiz = async (
  apiKey,
  clientSecret,
  host,
  ID,
  quizId,
  student,
  questionId,
  answer,
  time,
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
      ActivityEvent: 210,
      ActivityNote: "Quiz Attempt Activity",
      ProcessFilesAsync: true,
      ActivityDateTime: originalDate,
      Fields: [
        {
          SchemaName: "mx_Custom_1",
          Value: quizId,
        },
        {
          SchemaName: "mx_Custom_2",
          Value: student,
        },
        {
          SchemaName: "mx_Custom_3",
          Value: questionId,
        },
        {
          SchemaName: "mx_Custom_4",
          Value: answer,
        },
        {
          SchemaName: "mx_Custom_5",
          Value: time,
        },
        {
          SchemaName: "mx_Custom_6",
          Value: status,
        },
        {
          SchemaName: "mx_Custom_7",
          Value: course,
        },
        {
          SchemaName: "mx_Custom_8",
          Value: board,
        },
        {
          SchemaName: "mx_Custom_9",
          Value: classes,
        },
        {
          SchemaName: "mx_Custom_10",
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

//NOTE - capture lead and create activity for No. of Attempt test
const createActivityTest = async (
  apiKey,
  clientSecret,
  host,
  ID,
  studentId,
  scholarshipId,
  quizId,
  testId,
  assignmentId,
  attemptCount,
  course,
  board,
  classes
) => {
  try {
    //NOTE - current data
    const originalDate = await dateconverter();
    const leadData = {
      RelatedProspectId: ID,
      ActivityEvent: 208,
      ActivityNote: "Test attempt Activity",
      ProcessFilesAsync: true,
      ActivityDateTime: originalDate,
      Fields: [
        {
          SchemaName: "mx_Custom_1",
          Value: studentId,
        },
        {
          SchemaName: "mx_Custom_2",
          Value: scholarshipId,
        },
        {
          SchemaName: "mx_Custom_3",
          Value: quizId,
        },
        {
          SchemaName: "mx_Custom_4",
          Value: testId,
        },
        {
          SchemaName: "mx_Custom_5",
          Value: assignmentId,
        },
        {
          SchemaName: "mx_Custom_6",
          Value: attemptCount,
        },
        {
          SchemaName: "mx_Custom_7",
          Value: "Completed",
        },

        {
          SchemaName: "mx_Custom_8",
          Value: course,
        },
        {
          SchemaName: "mx_Custom_9",
          Value: board,
        },
        {
          SchemaName: "mx_Custom_10",
          Value: classes,
        },
        {
          SchemaName: "mx_Custom_11",
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

//NOTE - capture lead and create activity for No. of Attempt test
const createActivityQuizCompleted = async (
  apiKey,
  clientSecret,
  host,
  ID,
  student,
  quizId,
  course,
  board,
  classes
) => {
  try {
    //NOTE - current data
    const originalDate = await dateconverter();
    const leadData = {
      RelatedProspectId: ID,
      ActivityEvent: 222,
      ActivityNote: "Quiz completed Activity",
      ProcessFilesAsync: true,
      ActivityDateTime: originalDate,
      Fields: [
        {
          SchemaName: "mx_Custom_1",
          Value: student,
        },
        {
          SchemaName: "mx_Custom_2",
          Value: quizId,
        },
        {
          SchemaName: "mx_Custom_3",
          Value: "Completed",
        },
        {
          SchemaName: "mx_Custom_4",
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

module.exports = {
  addTestAttemptTimes,
  createActivity,
  createActivityTest,
  createActivityForQuiz,
  createActivityQuizCompleted,
};
