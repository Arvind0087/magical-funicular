export const isNumber = (str) => {
  return !isNaN(str) && /^\d+$/.test(str);
};
