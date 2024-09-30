const ObjectsToCsv = require("objects-to-csv");

exports.csv = async (data,res) => {
  const plainObject = JSON.parse(JSON.stringify(data));
  const csv = new ObjectsToCsv(plainObject);
  const csvString = await csv.toString();
  res.set({
    "Content-Type": "application/octet-stream",
    "Content-Disposition": "attachment; filename=user_data.csv",
    "Content-Length": csvString.length,
  });
  return res.send(csvString);
};

