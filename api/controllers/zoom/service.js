const jwt = require("jsonwebtoken");
const axios = require("axios");

//NOTE - Generate dynamic OTP
function generate_otp() {
  let digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let OTP = digits[Math.floor(Math.random() * 10)];
  for (let i = 0; i < 9; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

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

//NOTE- create ZOOM MEETING
const createZoomMeeting = async (accessToken) => {
  try {
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: "Zoom Meeting",
        type: 2,
        password: generate_otp(),
        duration: 60,
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


const promoteParticipantToHost = async (accessToken, meetingId, participantId) => {
  try {
    const response = await axios.put(
      `https://api.zoom.us/v2/meetings/${meetingId}/participants/${participantId}/status`,
      {
        action: "promote",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 204) {
      return true;
    } else {
      //console.error("Failed to promote user to host:", response.data);
      //throw new Error("Failed to promote user to host");
      return false;
    }
  } catch (err) {
    //console.error("Error promoting user to host:", err);
    //throw err;
    return false;
  }
};

module.exports = {
  generateZoomToken,
  createZoomMeeting,
  generate_otp,
  promoteParticipantToHost
};

