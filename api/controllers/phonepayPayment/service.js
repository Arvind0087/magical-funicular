const crypto = require("crypto");

function calculateSHA256(payload) {
  const hash = crypto.createHash("sha256");
  hash.update(payload);
  return hash.digest("hex");
}
function generateOrderNumber(userId) {
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 8));
    const paddedUserId = userId.toString().padStart(2, "0");
    return `VEDA${randomNumber}${paddedUserId}`;
  }

  function generateBookOrderNumber() {
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 8));
    return `VEDA${randomNumber}${123}`;
  }
module.exports = {
  calculateSHA256,
  generateOrderNumber,
  generateBookOrderNumber
};
