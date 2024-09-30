import crypto from "crypto-js";
import { isJson } from "./isJson";

export const decrypt = (data) => {
  try {
    const decrypt = crypto.AES.decrypt(
      data,
      process.env.REACT_APP_CRYPTO_SECRET_KEY
    ).toString(crypto.enc.Utf8);

    if (isJson(decrypt)) {
      return JSON.parse(decrypt);
    } else {
      return decrypt;
    }
  } catch (err) {
    return;
  }
};
