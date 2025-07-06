import { useMemo } from "react";
import { TestResult } from "../types/test";

interface TypingStatisticsState {
  startTime: number | null;
  completedWords: string[];
  userInput: string;
  errors: number;
  mistakePositions: Set<string>;
  currentWordIndex: number;
  words: string[];
}

// Hook especializado para cálculos estadísticos
export const useTypingStatistics = (state: TypingStatisticsState) => {
  // Cálculo de caracteres totales tipados
  const totalCharsTyped = useMemo(() => {
    const completedChars = state.completedWords.reduce((total, word) => total + word.length, 0);
    const spacesTyped = state.completedWords.length;
    return completedChars + spacesTyped + state.userInput.length;
  }, [state.completedWords, state.userInput]);

  // Cálculo de WPM en tiempo real
  const wpm = useMemo(() => {
    if (!state.startTime) return 0;
    const timeElapsed = (Date.now() - state.startTime) / 1000 / 60;
    if (timeElapsed === 0) return 0;
    return Math.round((totalCharsTyped / 5) / timeElapsed);
  }, [state.startTime, totalCharsTyped]);

  // Cálculo de precisión
  const accuracy = useMemo(() => {
    if (totalCharsTyped === 0) return 100;
    const correctChars = totalCharsTyped - state.errors;
    return Math.round((correctChars / totalCharsTyped) * 100);
  }, [totalCharsTyped, state.errors]);

  // Cálculo de consistencia
  const consistency = useMemo(() => {
    const wordsTyped = state.completedWords.length;
    if (wordsTyped === 0) return 100;
    return Math.max(0, 100 - (state.mistakePositions.size / wordsTyped) * 100);
  }, [state.completedWords.length, state.mistakePositions.size]);

  // Resultados finales del test
  const results: TestResult = useMemo(() => {
    const timeSpent = state.startTime ? (Date.now() - state.startTime) / 1000 : 0;
    const wordsTyped = state.completedWords.length;
    
    let finalWpm = 0;
    if (timeSpent > 0) {
      const completedChars = state.completedWords.reduce((total, word) => total + word.length, 0);
      const spacesTyped = state.completedWords.length;
      const totalCharsTyped = completedChars + spacesTyped;
      finalWpm = Math.round((totalCharsTyped / 5) / (timeSpent / 60));
    }
    
    const score = Math.round(finalWpm * accuracy * (accuracy / 100));
    const consistencyScore = wordsTyped > 0 
      ? Math.max(0, 100 - (state.mistakePositions.size / wordsTyped) * 100)
      : 100;

    return {
      wpm: finalWpm,
      accuracy,
      score,
      wordsTyped,
      timeSpent: Math.round(timeSpent),
      mistakes: state.mistakePositions.size,
      errors: state.errors,
      text: state.words.slice(0, state.currentWordIndex).join(" "),
      consistency: Math.round(consistencyScore),
      createdAt: new Date().toISOString(),
    };
  }, [state, accuracy]);

  return {
    totalCharsTyped,
    wpm,
    accuracy,
    consistency,
    results,
  };
}; 