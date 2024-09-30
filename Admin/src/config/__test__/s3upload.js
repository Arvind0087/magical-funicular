// import { s3BUCKET } from "config/aws";
// import { uploadFile } from "react-s3";
// window.Buffer = window.Buffer || require("buffer").Buffer;

// const params = {
    //   ACL: "public-read",
    //   Body: formik.values.sourceFile[0],
    //   Bucket: process.env.REACT_APP_S3_BUCKET,
    //   Key: key,
    // };
    // console.log(key);

    // s3BUCKET
    //   .putObject(params)
    //   .on("httpUploadProgress", (ev) => {
    //     setProgress(Math.round((ev.loaded / ev.total) * 100));
    //     console.log(Math.round((ev.loaded / ev.total) * 100));
    //     console.log(ev);
    //   })
    //   .send((err, data) => {
    //     if (err) console.log(err);
    //   });

    // const config = {
    //   bucketName: process.env.REACT_APP_S3_BUCKET,
    //   region: process.env.REACT_APP_REGION,
    //   accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    //   secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
    // };

    // uploadFile(formik.values.sourceFile[0], config)
    //   .then((data) => console.log(data))
    //   .catch((err) => console.error(err));