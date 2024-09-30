import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";

export const s3uploadFile = (key, file, credentials, extension) => {
  const CREDENTIAL = {
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.access,
      secretAccessKey: credentials.secret,
    },
  };

  const parallelUploads3 = new Upload({
    client: new S3(CREDENTIAL) || new S3Client(CREDENTIAL),
    params: {
      Bucket: credentials.bucket,
      Key: key,
      Body: file,
      ContentType: extension === 'mkv' ? "video/mkv" : file.type
      // ContentType: file.type
    },
  });
  return parallelUploads3;
};
