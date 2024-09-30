
const axios = require("axios");
const { dateconverter } = require("../../helpers/dateConverter");

//NOTE - get duration from startTime and endTime
function getDuration(startTime, endTime) {
  const now = new Date(); //NOTE :  current date and time

  const startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    ...startTime.split(":")
  );
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    ...endTime.split(":")
  );

  const duration = (endDate - startDate) / 1000; // duration in seconds
  const hours = Math.floor(duration / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((duration % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(duration % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

//NOTE - capture lead and create activity
const createActivity = async (
  apiKey,
  clientSecret,
  host,
  ID,
  name,
  scholarshipId,
  stateId,
  cityId,
  course,
  board,
  classes
) => {
  try {

    //NOTE - convet current data into format "2023-06-30 11:05:56"
    const originalDate = await dateconverter();
    const leadData = {
      RelatedProspectId: ID,
      ActivityEvent: 211,
      ActivityNote: "Applied Scholarship Activity",
      ProcessFilesAsync: true,
      ActivityDateTime: originalDate,
      Fields: [
        {
          SchemaName: "mx_Custom_1",
          Value: name,
        },
        {
          SchemaName: "mx_Custom_2",
          Value: scholarshipId,
        },
        {
          SchemaName: "mx_Custom_3",
          Value: stateId,
        },
        {
          SchemaName: "mx_Custom_4",
          Value: cityId,
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

module.exports = {
  getDuration,
  createActivity,
};
