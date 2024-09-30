const axios = require("axios");
const { dateconverter } = require("../../helpers/dateConverter");

//NOTE - capture lead and create activity for student Feedback
const createActivity = async (
  apiKey,
  clientSecret,
  host,
  ID,
  studentId,
  feedback,
  course,
  board,
  classes
) => {
  try {
    //NOTE - current data
    const originalDate = await dateconverter();
    console.log(originalDate);
    const leadData = {
      RelatedProspectId: ID,
      ActivityEvent: 207,
      ActivityNote: "Student Feedback Activity",
      ProcessFilesAsync: true,
      ActivityDateTime: originalDate,
      Fields: [
        {
          SchemaName: "mx_Custom_1",
          Value: studentId,
        },
        {
          SchemaName: "mx_Custom_2",
          Value: feedback,
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
  createActivity,
};
