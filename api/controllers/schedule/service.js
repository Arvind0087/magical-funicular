function printTimeSlots(
  startTime,
  endTime,
  slotSizeInMinutes,
  breakTimeInMinutes
) {
  let slots = [];
  let currentTime = new Date(startTime);
  const endTimeTimestamp = new Date(endTime).getTime();

  while (currentTime.getTime() < endTimeTimestamp) {
    const nextTime = new Date(
      currentTime.getTime() + slotSizeInMinutes * 60000
    );
    const slotEndTime = new Date(
      Math.min(nextTime.getTime(), endTimeTimestamp)
    );

    slots.push(`${formatTime(currentTime)} - ${formatTime(slotEndTime)}`);

    if (nextTime.getTime() > endTimeTimestamp) {
      break;
    }

    if (breakTimeInMinutes) {
      currentTime = new Date(
        slotEndTime.getTime() + breakTimeInMinutes * 60000
      );
    } else {
      currentTime = nextTime;
    }
  }

  return slots;
}

//FORMATE TIME
function formatTime(time) {
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

//EXCLUDING TIME FROM ALL SCHEDULE TIME
async function ExcludeTime(bookTimeFrom, bookTimeTo, result) {
  const fromHourMinute = bookTimeFrom.split(":");
  const toHourMinute = bookTimeTo.split(":");
  const formattedTime = `${fromHourMinute[0]}:${fromHourMinute[1]} - ${toHourMinute[0]}:${toHourMinute[1]}`;
  const filteredTimeSlots = result.filter((time) => time !== formattedTime);
  return filteredTimeSlots;
}

function countTimeSlots(
  startTime,
  endTime,
  slotSizeInMinutes,
  breakTimeInMinutes
) {
  let count = 0;
  let currentTime = new Date(startTime);
  const endTimeTimestamp = new Date(endTime).getTime();

  while (currentTime.getTime() < endTimeTimestamp) {
    const nextTime = new Date(
      currentTime.getTime() + slotSizeInMinutes * 60000
    );
    const slotEndTime = new Date(
      Math.min(nextTime.getTime(), endTimeTimestamp)
    );

    count++;

    if (nextTime.getTime() > endTimeTimestamp) {
      break;
    }

    if (breakTimeInMinutes) {
      currentTime = new Date(
        slotEndTime.getTime() + breakTimeInMinutes * 60000
      );
    } else {
      currentTime = nextTime;
    }
  }

  return count;
}

function groupByDate(data, targetDate) {
  const output = [];
  let runningTotal = 0;
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    if (element.date.getTime() === targetDate.getTime()) {
      runningTotal += element.count;
    } else {
      output.push({ count: runningTotal, date: targetDate });
      targetDate = element.date;
      runningTotal = element.count;
    }
  }
  output.push({ count: runningTotal, date: targetDate });
  return output;
}

function convertIntoColor(actualValues) {
  if (actualValues <= 100 && actualValues >= 49) {
    return "#00FF00";         //green
  } else if (actualValues <= 49 && actualValues >= 10) {
    return "#FFFF00";        //yellow
  } else if (actualValues <= 10 && actualValues >= 0) {
    return "#FF0000";        //red
  } else {
    return "#808080";        //grey
  }
}

// let finalCount = [];

// const year = newDate.getFullYear();
// const month = newDate.getMonth();
// const numDaysInMonth = new Date(year, month + 1, 0).getDate();

// for (let i = 1; i <= numDaysInMonth; i++) {
//   const date = new Date(year, month, i);
//   if (
//     date.getFullYear() === year &&
//     date.getMonth() === month &&
//     date.getDate() >= 1
//   ) {
//     const dateString = date.toISOString().slice(0, 10);
//     const monthNumber = parseInt(dateString.split("-")[1]);
//     //if(monthNumber<)
//     finalCount.push({ date: dateString });
//   }
// }

module.exports = {
  printTimeSlots,
  ExcludeTime,
  countTimeSlots,
  groupByDate,
  convertIntoColor,
};
