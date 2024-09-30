
const msg = require("../../constants/Messages");
const axios = require("axios");
const { config } = require("../../config/db.config");
const {
  generateZoomToken,
  createZoomMeeting,
  promoteParticipantToHost,
} = require("./service");

const key = config.ZOOM_API_KEY;
const secret = config.ZOOM_API_SECRET;

const createZoom = async (req, res) => {
  try {
    //NOTE - generate token using key and secret
    const token = await generateZoomToken(
      config.ZOOM_API_KEY,
      config.ZOOM_API_SECRET
    );
    if (!token) {
      return res.status(401).send({
        status: 401,
        message: msg.INVALID_CREDENTIAL,
      });
    }

    //NOTE : create meeting
    const generateMeeting = await createZoomMeeting(token);
    if (generateMeeting === false) {
      return res.status(401).send({
        status: 401,
        message: msg.SOMETHING_WRONG,
      });
    }

    const update = await promoteParticipantToHost(token, generateMeeting.id, 1);

    console.log(update);

    let final = {
      meetingId: generateMeeting.id,
      password: generateMeeting.password,
      ZOOM_API_KEY: config.ZOOM_API_KEY,
      ZOOM_API_SECRET: config.ZOOM_API_SECRET,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: final,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

const joinZoom = async (req, res) => {
  try {
    const token = await generateZoomToken(
      config.ZOOM_API_KEY,
      config.ZOOM_API_SECRET
    );
    if (!token) {
      return res.status(401).send({
        status: 401,
        message: msg.INVALID_CREDENTIAL,
      });
    }

    const meeting = await createZoomMeeting(token);
    //console.log("Meeting created: ", meeting);

    const signature = generateSignature(
      config.ZOOM_API_KEY,
      config.ZOOM_API_SECRET,
      meeting.id,
      1
    );

    const joinConfig = {
      apiKey: API_KEY,
      meetingNumber: meeting.id,
      userName: "ajay patel",
      password: MEETING_PASSWORD,
      leaveUrl: "https://yourwebsite.com",
      role: 1,
      signature,
    };

    const response = await axios.post(
      `https://zoom.us/api/v1/meeting/join`,
      joinConfig
    );

    console.log("Join meeting success: ", response.data);
    res.send(meeting);

    // createAndJoinMeeting();
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createZoom,
  joinZoom,
};
