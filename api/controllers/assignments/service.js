//TODO - Divied time in  hour, minutes,seconds
const dividTime = (timeString) => {
  return ([hours, minutes, seconds] = timeString
    .split(":")
    .map((component) => parseInt(component)));
};

//TODO - Add time dyanamically
function addTime(timestamp, hours, minutes, seconds) {
  const date = new Date(timestamp);
  date.setHours(date.getHours() + hours);
  date.setMinutes(date.getMinutes() + minutes);
  date.setSeconds(date.getSeconds() + seconds);
  return date.toISOString();
}
function addTestAttemptTimes(time1, time2) {
  const [hours1, minutes1, seconds1] = time1.split(":").map(Number); // Convert time1 to an array of hours, minutes, and seconds
  const [hours2, minutes2, seconds2] = time2.split(":").map(Number); // Convert time2 to an array of hours, minutes, and seconds

  const totalSeconds = seconds1 + seconds2; // Add the seconds
  const totalMinutes = minutes1 + minutes2 + Math.floor(totalSeconds / 60); // Add the minutes and any "carry-over" from seconds
  const totalHours = hours1 + hours2 + Math.floor(totalMinutes / 60); // Add the hours and any "carry-over" from minutes

  const resultSeconds = totalSeconds % 60; // Calculate the remaining seconds
  const resultMinutes = totalMinutes % 60; // Calculate the remaining minutes
  const resultHours = totalHours; // The total hours are already calculated

  const result = `${String(resultHours).padStart(2, "0")}:${String(
    resultMinutes
  ).padStart(2, "0")}:${String(resultSeconds).padStart(2, "0")}`; // Combine the result into a string in the format "HH:mm:ss"

  return result;
}

module.exports = {
  addTestAttemptTimes,
};

module.exports = {
  addTime,
  dividTime,
  addTestAttemptTimes
};
