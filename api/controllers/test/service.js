const getRandomObjects = (arr, n) => {
  const result = new Array(n);
  let len = arr.length;
  const taken = new Array(len);
  if (n > len) {
    throw new RangeError(
      "getRandomObjects: more elements taken than available"
    );
  }
  while (n--) {
    const randomIndex = Math.floor(Math.random() * len);
    result[n] = arr[randomIndex in taken ? taken[randomIndex] : randomIndex];
    taken[randomIndex] = --len in taken ? taken[len] : len;
  }
  return result;
};

function getScoreValue(attemptedTest) {
  //NOTE:  Implement your logic to compute the score here
  const correctAnswers = attemptedTest.all_questions.filter(q => q.answer === q.correct_answer);
  const score = (correctAnswers.length / attemptedTest.all_questions.length) * 100;
  return score;
}




module.exports = {
  getRandomObjects,
  getScoreValue
};
