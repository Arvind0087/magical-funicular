
exports.dateconverter = async () => {
    const date = new Date();
    const inputTimestamp = date.toISOString();
    const outputTimestamp = inputTimestamp.slice(0, 19).replace("T", " ");
    return outputTimestamp;
  };