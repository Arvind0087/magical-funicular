const awsS3 = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const { getBase64ExtensionType, getBase64ContentType } = require("./service");
const { config } = require("../config/db.config");

const uploadFileS3 = async (file, s3directorypath) => {
  try {
    //NOTE - S3 CONFIGRATION
    const s3 = new awsS3.S3({
      accessKeyId: config.AWS_ACCESS_KEY,
      secretAccessKey: config.AWS_SECRET_KEY,
      region: config.S3_REGION,
    });
    const contenttype = await getBase64ContentType(file);
    const extension = await getBase64ExtensionType(file);
   

    const fileS3 = file.split("base64,")[1];

    //NOTE - COMPLETE FILE NAME
    const s3path = new Date().getTime() + "-" + uuidv4() + `.${extension}`;

    //NOTE - CONFIGURE
    const params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: `${s3directorypath}/${s3path}`,
      Body: Buffer.from(fileS3, "base64"),
      ContentEncoding: "base64",
      ContentType: contenttype,
    };
    //NOTE - UPLOAD
    const s3response = await s3.upload(params).promise();
    return s3response;
  } catch (error) {
    return false;
  }
};

module.exports = uploadFileS3;
