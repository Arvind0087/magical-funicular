exports.rankingOfUser = async (finalUserSchool) => {
    // Sort the data based on the marks in descending order
    const sortedData = finalUserSchool.sort((a, b) => b.marks - a.marks);
  
    // Assign ranks based on the order
    const ranks = sortedData.map((data, index) => {
      if (data.marks !== 0) {
        data.rank = index + 1;
      } else {
        data.rank = "N/A";
      }
      return { rank: data.rank, userID: data.userID };
    });
    
    return ranks;
  };
  
