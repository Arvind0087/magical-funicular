const  getUniqueDataById  = (dataArray)=> {
    const uniqueData = {};
    for (const data of dataArray) {
      if (!uniqueData[data.id]) {
        uniqueData[data.id] = data;
      } 
    }
    return Object.values(uniqueData);
  }

  module.exports = {
    getUniqueDataById
  }