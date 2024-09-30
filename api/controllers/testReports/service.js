const addTimes = (startTime, endTime) => {
  var times = [0, 0, 0];
  var max = times.length;

  var a = (startTime || "").split(":");
  var b = (endTime || "").split(":");

  // normalize time values
  for (var i = 0; i < max; i++) {
    a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
    b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
  }

  // store time values
  for (var i = 0; i < max; i++) {
    times[i] = a[i]++;
  }

  var hours = times[0];
  var minutes = times[1];
  var seconds = times[2];

  if (seconds >= 60) {
    var m = (seconds / 60) << 0;
    minutes += m;
    seconds -= 60 * m;
  }

  if (minutes >= 60) {
    var h = (minutes / 60) << 0;
    hours += h;
    minutes -= 60 * h;
  }

  return (
    ("0" + hours).slice(-2) +
    ":" +
    ("0" + minutes).slice(-2) +
    ":" +
    ("0" + seconds).slice(-2)
  );
};

const getKeyFromObject = (aa, bb) => {
  //`${aa} : ${bb[aa]}`;
  return `<p>${aa}: </p>${bb[aa]}`;
};

const convertTime = async (time) => {
  const parts = time.split(":");
  const duration = new Date(0, 0, 0, ...parts);
  const seconds = duration.getSeconds();
  const minutes = duration.getMinutes();
  const hours = duration.getHours();

  if (hours > 0) {
    return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min${
      minutes > 1 ? "s" : ""
    } ${seconds} sec${seconds > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    if (seconds === 0) {
      return `${minutes} min${minutes > 1 ? "s" : ""}`;
    } else {
      return `${minutes} min${minutes > 1 ? "s" : ""} ${seconds} sec${
        seconds > 1 ? "s" : ""
      }`;
    }
  } else {
    return `${seconds} sec${seconds > 1 ? "s" : ""}`;
  }
};

const formatDuration = async (times) => {
  const totalDuration = times.reduce((acc, time) => {
    const parts = time.split(":");
    return (
      acc +
      parseInt(parts[0]) * 3600 +
      parseInt(parts[1]) * 60 +
      parseInt(parts[2])
    );
  }, 0);

  const seconds = totalDuration % 60;
  const minutes = Math.floor(totalDuration / 60) % 60;
  const hours = Math.floor(totalDuration / 3600);

  if (hours > 0) {
    return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min${
      minutes > 1 ? "s" : ""
    } ${seconds} sec${seconds > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `${minutes} min${minutes > 1 ? "s" : ""} ${seconds} sec${
      seconds > 1 ? "s" : ""
    }`;
  } else {
    return `${seconds} sec${seconds > 1 ? "s" : ""}`;
  }
};

const calculateAverageTimePerQuestion = (attemptedTestTime, totalQuestions) => {
  //NOTE - convert total attempted test time in to sec
  const timeParts = attemptedTestTime.split(" ");
  let mins = 0;
  let secs = 0;
  if (timeParts.length === 2 && ["secs", "sec"].includes(timeParts[1])) {
    secs = parseInt(timeParts[0]);
  } else if (timeParts.length === 4) {
    mins = parseInt(timeParts[0]);
    secs = parseInt(timeParts[2]);
  }
  const attemptedTestTimeInSeconds = mins * 60 + secs; //TODO: get total time in sec

  //NOTE - get average time per question
  const averageTimePerQuestion = attemptedTestTimeInSeconds / totalQuestions;

  const avgTimeMinutes = Math.floor(averageTimePerQuestion / 60); //NOTE - get average time per question mins convertion
  const avgTimeSeconds = Math.round(averageTimePerQuestion % 60); //NOTE - get average time per question secs convertion

  if (avgTimeMinutes > 0) {
    return `${avgTimeMinutes} mins ${avgTimeSeconds} secs`; //TODO - if response is in mins and in sec
  } else {
    return `${avgTimeSeconds} secs`; //TODO - if response is in sec only
  }
};

//NOTE - Check the array of result and push final response
const evaluateTest = async (attemptedTest) => {
  //NOTE - Create response
  let response = {
    tooFast: { correctQuestion: 0, wrongQuestion: 0 },
    ideal: { correctQuestion: 0, wrongQuestion: 0 },
    overTime: { correctQuestion: 0, wrongQuestion: 0 },
  };
  for (const data of attemptedTest) {
    const result = await evaluateResponse(
      data.time,
      data.questionBank.answer,
      data.answer
    );

    //NOTE:  Update counts based on the result
    const timeInSeconds = getTimeInSeconds(data.time);
    if (timeInSeconds <= 30) {
      response.tooFast.correctQuestion += result.correctQuestion;
      response.tooFast.wrongQuestion += result.wrongQuestion;
    } else if (timeInSeconds <= 120) {
      response.ideal.correctQuestion += result.correctQuestion;
      response.ideal.wrongQuestion += result.wrongQuestion;
    } else {
      response.overTime.correctQuestion += result.correctQuestion;
      response.overTime.wrongQuestion += result.wrongQuestion;
    }
  }

  return response;
};

//NOTE: Check if the student answer matches the correct answer
const evaluateResponse = async (time, correctAnswer, studentAnswer) => {
  const result = { correctQuestion: 0, wrongQuestion: 0 };
  if (correctAnswer === studentAnswer) {
    result.correctQuestion = 1;
  } else {
    result.wrongQuestion = 1;
  }
  return result;
};

//NOTE - convert the time format
function getTimeInSeconds(time) {
  const [hours, minutes, seconds] = time.split(":").map((t) => parseInt(t));
  return hours * 3600 + minutes * 60 + seconds;
}

const getTimeStatus = async (time) => {
  const getTime = await getTimeInSeconds(time);

  if (getTime <= 30) {
    return "Too Fast";
  } else if (getTime <= 120) {
    return "Ideal";
  } else {
    return "Overtime";
  }
};

module.exports = {
  addTimes,
  getKeyFromObject,
  convertTime,
  formatDuration,
  calculateAverageTimePerQuestion,
  evaluateResponse,
  evaluateTest,
  getTimeInSeconds,
  getTimeStatus,
};
