function isJson(data) {
  let info;
  try {
    info = JSON.parse(data);
  } catch (e) {
    return false;
  }
  return info;
}

module.exports = {
  isJson,
};
