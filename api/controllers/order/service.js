const db = require("../../models/index");
const orderDetails = db.orders;

const generateVedaOrderId = async () => {
  const lastOrder = await orderDetails.findAll({
    order: [["id", "DESC"]],
    limit: 1,
  });

  const lastOrderId = lastOrder.length ? lastOrder[0].vedaOrderId : null;
  if (lastOrderId === null) {
    return "Veda-0001";
  }

  const counter = parseInt(lastOrderId.slice(-4));
  const orderId = `${lastOrderId.slice(0, -4)}${(counter + 1)
    .toString()
    .padStart(4, "0")}`;
  return orderId;
};

//NOTE _ convert day into date
const convertDayIntoDate = async (day) => {
  //NOTE : Get today's date
  const today = new Date();
  //NOTE : Set the number of days to add
  const daysToAdd = day;
  //NOTE : Create a new date by adding the number of days to today's date
  const newDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return newDate;
};

module.exports = {
  generateVedaOrderId,
  convertDayIntoDate,
};
