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
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
      minutes > 1 ? "s" : ""
    } ${seconds} second${seconds > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ${seconds} second${
      seconds > 1 ? "s" : ""
    }`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""}`;
  }
};

const calculateAverageTimePerQuestion = (
  totalTestTime,
  attemptedTestTime,
  totalQuestions
) => {
  const totalTime = parseInt(totalTestTime);
  const attemptedTime = parseInt(attemptedTestTime);
  const questions = parseInt(totalQuestions);

  const totalTestTimeInSeconds = totalTime * 60;
  const attemptedTimePerQuestion = attemptedTime / questions;
  const averageTimePerQuestion =
    attemptedTimePerQuestion / (totalTestTimeInSeconds / 60);
  return averageTimePerQuestion.toFixed(2);
};

const convertTime = async (time) => {
  const parts = time.split(":");
  const duration = new Date(0, 0, 0, ...parts);
  const seconds = duration.getSeconds();
  const minutes = duration.getMinutes();
  const hours = duration.getHours();

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
      minutes > 1 ? "s" : ""
    } ${seconds} second${seconds > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    if (seconds === 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ${seconds} second${
        seconds > 1 ? "s" : ""
      }`;
    }
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""}`;
  }
};

const getKeyFromObject = (aa, bb) => {
  return `${aa} : ${bb[aa]}`;
};

//NOTE - Check the array of result and push final response
const evaluateTest = async (attemptedTest) => {
  //NOTE - Create response
  let response = [
    {
      tooFast: { correctQuestion: 0, wrongQuestion: 0 },
      ideal: { correctQuestion: 0, wrongQuestion: 0 },
      overTime: { correctQuestion: 0, wrongQuestion: 0 },
    },
  ];

  for (const data of attemptedTest) {
    const result = await evaluateResponse(
      data.time,
      data.questionBank.answer,
      data.answer
    );

    //NOTE:  Update counts based on the result
    const timeInSeconds = await getTimeInSeconds(data.time);

    if (timeInSeconds <= 30) {
      response[0].tooFast.correctQuestion += result.correctQuestion;
      response[0].tooFast.wrongQuestion += result.wrongQuestion;
    } else if (timeInSeconds <= 120) {
      response[0].ideal.correctQuestion += result.correctQuestion;
      response[0].ideal.wrongQuestion += result.wrongQuestion;
    } else {
      response[0].overTime.correctQuestion += result.correctQuestion;
      response[0].overTime.wrongQuestion += result.wrongQuestion;
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
  formatDuration,
  calculateAverageTimePerQuestion,
  convertTime,
  getKeyFromObject,
  evaluateResponse,
  evaluateTest,
  getTimeInSeconds,
  getTimeStatus
};
