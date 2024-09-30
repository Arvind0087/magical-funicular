import { isObject } from "./isObject";

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const GenerateBase64 = async (file) => {
  let ImageBase64;
  if (isObject(file)) {
    ImageBase64 = await convertToBase64(file);
  } else {
    ImageBase64 = file;
  }
  return ImageBase64;
};
