import { useState, useCallback, useMemo, useEffect } from "react";
import { TestMode, TestResult, TypingState } from "../types/test";
import { useTimer } from "./useTimer";
import { useAuth } from "./useAuth";
import { useCreateTest } from "./useApi";
import { CreateTestDto } from "../services/types";
import { generateWords, generateQuote } from "../utils/wordGenerator";
import { createToaster } from "@chakra-ui/react";

const toaster = createToaster({
  placement: "top",
  pauseOnPageIdle: true,
});

export const useTypingTest = () => {
  // Auth and API hooks
  const { isAuthenticated } = useAuth();
  const createTestApi = useCreateTest();

  // Test configuration
  const [testTime, setTestTime] = useState(60);
  const [testMode, setTestMode] = useState<TestMode>("time");

  // Test state
  const [state, setState] = useState<TypingState>({
    words: [],
    currentWordIndex: 0,
    currentCharIndex: 0,
    userInput: "",
    completedWords: [],
    isActive: false,
    isCompleted: false,
    startTime: null,
    errors: 0,
    mistakePositions: new Set(),
  });

  // Timer hook
  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer(testTime);

  const generateNewWords = useCallback(() => {
    let newWords: string[];

    switch (testMode) {
      case "words":
        newWords = generateWords(50);
        break;
      case "quote":
        const quote = generateQuote();
        newWords = quote.split(" ");
        break;
      case "time":
      default:
        newWords = generateWords(200); // Generate enough words for longest possible test
        break;
    }

    setState((prev) => ({
      ...prev,
      words: newWords,
      currentWordIndex: 0,
      currentCharIndex: 0,
      userInput: "",
      completedWords: [],
      isActive: false,
      isCompleted: false,
      startTime: null,
      errors: 0,
      mistakePositions: new Set(),
    }));
  }, [testMode]);

  // Generate initial words
  useEffect(() => {
    generateNewWords();
  }, [testMode, generateNewWords]);

  // Calculate WPM using standard formula (characters typed / 5 / minutes)
  const wpm = useMemo(() => {
    if (!state.startTime) return 0;

    const timeElapsed = (Date.now() - state.startTime) / 1000 / 60; // in minutes
    if (timeElapsed === 0) return 0;

    // Calculate total characters typed (including spaces between completed words)
    const completedChars = state.completedWords.reduce((total, word) => total + word.length, 0);
    const spacesTyped = state.completedWords.length > 0 ? state.completedWords.length : 0;
    const currentWordChars = state.userInput.length;
    
    const totalCharsTyped = completedChars + spacesTyped + currentWordChars;
    
    // Standard WPM formula: (characters typed / 5) / minutes
    return Math.round((totalCharsTyped / 5) / timeElapsed);
  }, [state.startTime, state.completedWords, state.userInput]);

  // Calculate accuracy
  const accuracy = useMemo(() => {
    const totalChars =
      state.completedWords.join("").length + state.userInput.length;
    if (totalChars === 0) return 100;

    const correctChars = totalChars - state.errors;
    return Math.round((correctChars / totalChars) * 100);
  }, [state.completedWords, state.userInput, state.errors]);

      // Handle input changes
  const handleInput = useCallback(
    (value: string) => {
      setState((prev) => {
        // Start test on first input
        if (!prev.isActive && value.length > 0) {
          startTimer();
          return {
            ...prev,
            isActive: true,
            startTime: Date.now(),
            userInput: value,
            currentCharIndex: value.length,
          };
        }

        // Handle backspace to previous word if current input is empty and we're not on first word
        if (value === "" && prev.userInput === "" && prev.currentWordIndex > 0) {
          const previousWordIndex = prev.currentWordIndex - 1;
          const previousWord = prev.words[previousWordIndex];
          const previousTypedWord = prev.completedWords[previousWordIndex];
          
          // Only allow going back if the previous word had errors
          if (previousTypedWord !== previousWord) {
            const newCompletedWords = [...prev.completedWords];
            newCompletedWords.pop(); // Remove the last completed word
            
            // Remove error marks for the previous word
            const newMistakePositions = new Set(prev.mistakePositions);
            for (let i = 0; i < Math.max(previousTypedWord.length, previousWord.length); i++) {
              newMistakePositions.delete(`${previousWordIndex}-${i}`);
            }
            
            // Recalculate errors
            let newErrors = 0;
            newMistakePositions.forEach(() => newErrors++);
            
            return {
              ...prev,
              currentWordIndex: previousWordIndex,
              userInput: previousTypedWord,
              currentCharIndex: previousTypedWord.length,
              completedWords: newCompletedWords,
              errors: newErrors,
              mistakePositions: newMistakePositions,
            };
          }
        }

        const currentWord = prev.words[prev.currentWordIndex];
        if (!currentWord) return prev;

        let newErrors = prev.errors;
        const newMistakePositions = new Set(prev.mistakePositions);

        // Handle space key - advance to next word regardless of correctness
        if (value.endsWith(" ")) {
          const typedWord = value.slice(0, -1); // Remove the space
          const newCompletedWords = [...prev.completedWords, typedWord];
          const newCurrentWordIndex = prev.currentWordIndex + 1;

          // If the word is incorrect, add errors for missing or extra characters
          if (typedWord !== currentWord) {
            // Count character differences as errors
            const maxLength = Math.max(typedWord.length, currentWord.length);
            for (let i = 0; i < maxLength; i++) {
              if (typedWord[i] !== currentWord[i]) {
                newErrors++;
                newMistakePositions.add(`${prev.currentWordIndex}-${i}`);
              }
            }
          }

          // Check if test is complete
          if (
            newCurrentWordIndex >= prev.words.length ||
            (testMode === "words" && newCurrentWordIndex >= 50)
          ) {
            return {
              ...prev,
              completedWords: newCompletedWords,
              userInput: "",
              currentWordIndex: newCurrentWordIndex,
              currentCharIndex: 0,
              isCompleted: true,
              isActive: false,
              errors: newErrors,
              mistakePositions: newMistakePositions,
            };
          }

          return {
            ...prev,
            completedWords: newCompletedWords,
            userInput: "",
            currentWordIndex: newCurrentWordIndex,
            currentCharIndex: 0,
            errors: newErrors,
            mistakePositions: newMistakePositions,
          };
        }

        // Auto-advance when word is completed correctly (without space)
        if (value === currentWord) {
          const newCompletedWords = [...prev.completedWords, value];
          const newCurrentWordIndex = prev.currentWordIndex + 1;

          // Check if test is complete
          if (
            newCurrentWordIndex >= prev.words.length ||
            (testMode === "words" && newCurrentWordIndex >= 50)
          ) {
            return {
              ...prev,
              completedWords: newCompletedWords,
              userInput: "",
              currentWordIndex: newCurrentWordIndex,
              currentCharIndex: 0,
              isCompleted: true,
              isActive: false,
              errors: newErrors,
              mistakePositions: newMistakePositions,
            };
          }

          return {
            ...prev,
            completedWords: newCompletedWords,
            userInput: "",
            currentWordIndex: newCurrentWordIndex,
            currentCharIndex: 0,
            errors: newErrors,
            mistakePositions: newMistakePositions,
          };
        }

        // Check for new errors only when typing forward (not backspacing)
        if (value.length > prev.userInput.length) {
          const newCharIndex = value.length - 1;
          const typedChar = value[newCharIndex];
          const expectedChar = currentWord[newCharIndex];

          // If typing beyond word length or character doesn't match
          if (
            newCharIndex >= currentWord.length ||
            typedChar !== expectedChar
          ) {
            newErrors++;
            newMistakePositions.add(`${prev.currentWordIndex}-${newCharIndex}`);
          }
        } else if (value.length < prev.userInput.length) {
          // Handle backspacing - remove error marks for characters being deleted
          for (let i = value.length; i < prev.userInput.length; i++) {
            if (newMistakePositions.has(`${prev.currentWordIndex}-${i}`)) {
              newMistakePositions.delete(`${prev.currentWordIndex}-${i}`);
              newErrors--;
            }
          }
        }

        // Prevent typing beyond the current word length (except for space)
        if (value.length > currentWord.length && !value.endsWith(" ")) {
          return prev; // Don't allow typing beyond word length
        }

        // Normal typing
        return {
          ...prev,
          userInput: value,
          currentCharIndex: value.length,
          errors: newErrors,
          mistakePositions: newMistakePositions,
        };
      });
    },
    [startTimer, testMode]
  );

  // Reset test
  const resetTest = useCallback(() => {
    resetTimer(testTime);
    generateNewWords();
  }, [resetTimer, testTime, generateNewWords]);

  // Handle key events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Handle tab to restart
      if (e.key === "Tab") {
        e.preventDefault();
        resetTest();
        return;
      }

      // Handle escape to restart during active test
      if (e.key === "Escape" && state.isActive) {
        e.preventDefault();
        resetTest();
        return;
      }
    },
    [state.isActive, resetTest]
  );

  // Check for timer completion
  useEffect(() => {
    if (testMode === "time" && timeLeft === 0 && state.isActive) {
      setState((prev) => ({
        ...prev,
        isCompleted: true,
        isActive: false,
      }));
    }
  }, [timeLeft, testMode, state.isActive]);

  // Force completion check - ensure TestResults shows even if other conditions fail
  useEffect(() => {
    const shouldComplete = 
      (testMode === "time" && timeLeft === 0 && state.startTime) ||
      (testMode === "words" && state.completedWords.length >= 50) ||
      (state.currentWordIndex >= state.words.length && state.words.length > 0);

    if (shouldComplete && !state.isCompleted) {
      setState((prev) => ({
        ...prev,
        isCompleted: true,
        isActive: false,
      }));
    }
  }, [testMode, timeLeft, state.startTime, state.completedWords.length, state.currentWordIndex, state.words.length, state.isCompleted]);

  // Calculate final results
  const results: TestResult = useMemo(() => {
    const timeSpent = state.startTime
      ? (Date.now() - state.startTime) / 1000
      : 0;
    const wordsTyped = state.completedWords.length;
    
    // Use the same WPM calculation as the real-time one for consistency
    let finalWpm = 0;
    if (timeSpent > 0) {
      const completedChars = state.completedWords.reduce((total, word) => total + word.length, 0);
      const spacesTyped = state.completedWords.length > 0 ? state.completedWords.length : 0;
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

  // Save test result to backend
  const saveResult = useCallback(async () => {
    if (!isAuthenticated || !state.isCompleted) {
      return {
        success: false,
        error: "Test not completed or user not authenticated",
      };
    }

    try {
      // Map frontend TestResult to backend CreateTestDto
      const payload: CreateTestDto = {
        wpm: results.wpm,
        accuracy: results.accuracy,
        score: results.score,
        wordsTyped: results.wordsTyped,
        timeSpent: results.timeSpent,
        mistakes: results.errors, // Map frontend 'errors' to backend 'mistakes'
        text: results.text,
      };

      const savedTest = await createTestApi.execute(payload);

      toaster.create({
        title: "Test guardado",
        description: "Tu resultado ha sido guardado exitosamente",
        status: "success",
        duration: 3000,
      });

      return { success: true, data: savedTest };
    } catch (error) {
      toaster.create({
        title: "Error al guardar",
        description: "No se pudo guardar el resultado del test",
        status: "error",
        duration: 3000,
      });

      return { success: false, error: "Failed to save test result" };
    }
  }, [isAuthenticated, state.isCompleted, results, createTestApi]);

  return {
    // State
    words: state.words,
    currentWordIndex: state.currentWordIndex,
    currentCharIndex: state.currentCharIndex,
    userInput: state.userInput,
    completedWords: state.completedWords,
    isActive: state.isActive,
    isCompleted: state.isCompleted,
    timeLeft,

    // Statistics
    wpm,
    accuracy,
    errors: state.errors,
    results,

    // Configuration
    testTime,
    testMode,

    // Actions
    handleInput,
    handleKeyDown,
    resetTest,
    setTestTime,
    setTestMode,
    saveResult,
    startTest: () => {
      if (!state.isActive) {
        // Focus will trigger input which will start the test
      }
    },

    // Save state
    isSaving: createTestApi.loading,
    saveError: createTestApi.error,
    canSave: isAuthenticated && state.isCompleted,
  };
};
