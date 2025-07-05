import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import "./App.css";

const App: React.FC = () => {
  const [typeTest] = useState("This is the sentence to type");
  const [words, setWords] = useState(typeTest.split(" "));
  const [enteredText, setEnteredText] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [wordsPerMinute, setWordsPerMinute] = useState(0);

  const checkFinished = () => {
    if (!words.length) {
      if (startTime) {
        const timeMillis: number = new Date().getTime() - startTime.getTime();
        const wpm = calcWordsPerMinute(typeTest.length, timeMillis);
        setWordsPerMinute(wpm);
      }
    }
  }

  useEffect(() => {
    if (words.length !== 0) return;
    checkFinished();
  }, [words, checkFinished]);

  const calcWordsPerMinute = (charsTyped: number, millis: number): number =>
    Math.floor(charsTyped / 5 / (millis / 60000));

  const onWordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (started) {
      setStarted(true);
      setStartTime(new Date());
    }
    setEnteredText(e.currentTarget.value.trim());
    if (enteredText === words[0]) {
      setCorrectCount(correctCount + 1);
      setEnteredText("");
      setWords(words.slice(1));
    }
  };

  return (
    <div className="App">
      <h1>
        {wordsPerMinute
          ? `You typed ${correctCount} words at ${wordsPerMinute} WPM.`
          : "Test Your Typing Speed, Scrub!"}
      </h1>
      <h3>
        {wordsPerMinute ? `Refresh to retake the test!` : `Type the following:`}
      </h3>
      <h6>
        {words.map((word, index) =>
          word === words[0] ? (
            <em className="current-word" key={index}>
              {word}{" "}
            </em>
          ) : (
            word + " "
          )
        )}
      </h6>
      <input name="text" value={enteredText} onChange={onWordChange} />
    </div>
  );
};

export default App;
