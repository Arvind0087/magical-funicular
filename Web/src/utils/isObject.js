export const isObject = (data) => {
  try {
    if (typeof data === "object") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
