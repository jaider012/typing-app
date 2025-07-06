const calculateScore = (
  words: number, // How many words the user types for the duration of the test
  wpm: number, // How many words per minute the user types for the duration of the test
  accuracy: number, // How accurate the user is after corrections are taken into account (if the user makes 10 typing errors, but corrects all the errors by deleting and retyping, the accuracy should be 100%)
  firstStrikeAccuracy: number // How accurate the user is before corrections are taken into account
) => {
  let calculatedScore = 0;
  calculatedScore = words * (wpm / 60) * accuracy * firstStrikeAccuracy * 10;
  return calculatedScore;
};

export default calculateScore;
