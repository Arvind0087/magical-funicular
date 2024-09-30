const awsS3 = require("aws-sdk");
const { config } = require("../config/db.config");

const s3 = new awsS3.S3({
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_KEY,
  region: config.S3_REGION,
});

const getSignedUrl = async (key) => {
  try {
    const s3info = s3.getSignedUrl("getObject", {
      Bucket: config.S3_BUCKET_NAME,
      Key: key,
      Expires: 60,
    });
    return s3info;
  } catch (error) {
    return null;
  }
};

module.exports = getSignedUrl;
