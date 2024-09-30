const { config } = require("../config/db.config");

const getSignedUrlCloudFront = async (key) => {
  try {
    const s3info = config.CLOUD_FRONT + key;
    return s3info;
  } catch (error) {
    return null;
  }
};


const cloudFrontM3u8Converter = async (key) => {
  try {
    const s3info = config.CLOUD_FRONT_VIDEO_M3U8 + key;
    return s3info;
  } catch (error) {
    return null;
  }
};

const getYouTubeVideoId = async (url) => {
  try {
    if (url.includes("youtube.com/watch?v=")) {
      return url.split("youtube.com/watch?v=")[1].substring(0, 11);
    } else if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].substring(0, 11);
    } else if (url.includes("youtube.com/shorts/")) {
      // Extract the video ID substring from the URL
      return url.split("youtube.com/shorts/")[1].split("?")[0];
    } else {
      // NOTE: The URL doesn't contain a valid video ID.
      return null;
    }
  } catch (err) {
    // If an error occurs, return null
    return null;
  }
};


module.exports = { getSignedUrlCloudFront, getYouTubeVideoId ,cloudFrontM3u8Converter};
