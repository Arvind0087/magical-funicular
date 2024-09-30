export const generateDateFromTo = ({ start, end }) => {
  const dates = [];
  // create new Date objects from the start and end dates
  const date1 = new Date(start);
  const date2 = new Date(end);

  // iterate over each day between the start and end dates and print the date
  for (let date = date1; date <= date2; date.setDate(date.getDate() + 1)) {
    dates.push(date.toISOString().slice(0, 10));
  }
  return dates;
};

export const get30DateFromTodate = (datevalue) => {
  let today;
  if (datevalue) {
    today = new Date(datevalue);
  } else {
    today = new Date();
  }

  const thirtyDaysFromNow = new Date(
    today.getTime() + 30 * 24 * 60 * 60 * 1000
  );
  return thirtyDaysFromNow;
};

export const addDaysToDate = (date, days) => {
  try {
    var newDate = new Date(date);
    newDate.setTime(newDate.getTime() + days * 86400000);
    return newDate.toISOString().split("T")[0];
  } catch (error) {
    return;
  }
};
