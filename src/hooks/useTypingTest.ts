import { useState, useCallback, useMemo, useEffect } from "react";
import { TestMode, TestResult, TypingState } from "../types/test";
import { useTimer } from "./useTimer";
import { useAuth } from "./useAuth";
import { useCreateTest } from "./useApi";
import { CreateTestDto } from "../services/types";
import { generateWords, generateQuote } from "../utils/wordGenerator";
import { createToaster } from "@chakra-ui/react";
import calculateScore from "../calculateScore";

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

  // Track first strike errors separately (errors before corrections)
  const [firstStrikeErrors, setFirstStrikeErrors] = useState(0);

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
    setFirstStrikeErrors(0);
  }, [testMode]);

  // Generate initial words
  useEffect(() => {
    generateNewWords();
  }, [testMode, generateNewWords]);

  // Calculate WPM using standard formula (characters typed / 5 / minutes)
  const wpm = useMemo(() => {
    if (!state.startTime) return 0;

    // Calculate time elapsed based on test mode
    let timeElapsedSeconds = 0;
    if (testMode === "time") {
      // For time mode, use configured time minus remaining time
      timeElapsedSeconds = testTime - timeLeft;
    } else {
      // For words/quote mode, use actual elapsed time
      timeElapsedSeconds = (Date.now() - state.startTime) / 1000;
    }

    // Minimum time of 2 seconds to avoid crazy high WPM values
    if (timeElapsedSeconds < 2) return 0;

    // Calculate total characters typed (including spaces between completed words)
    const completedChars = state.completedWords.reduce((total, word) => total + word.length, 0);
    // Only count spaces for completed words (not including current word)
    const spacesTyped = state.completedWords.length;
    const currentWordChars = state.userInput.length;
    
    const totalCharsTyped = completedChars + spacesTyped + currentWordChars;
    
    if (totalCharsTyped === 0) return 0;
    
    // Standard WPM formula: (characters typed / 5) / minutes
    const calculatedWpm = (totalCharsTyped / 5) / (timeElapsedSeconds / 60);
    
    // Cap WPM at reasonable maximum (300 WPM is extremely fast)
    return Math.round(Math.min(calculatedWpm, 300));
  }, [state.startTime, state.completedWords, state.userInput, testMode, testTime, timeLeft]);

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
            let wordFirstStrikeErrors = 0;
            for (let i = 0; i < maxLength; i++) {
              if (typedWord[i] !== currentWord[i]) {
                newErrors++;
                newMistakePositions.add(`${prev.currentWordIndex}-${i}`);
                wordFirstStrikeErrors++;
              }
            }
            // Add first strike errors for this word
            setFirstStrikeErrors(prev => prev + wordFirstStrikeErrors);
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
            // Track first strike error (error on first attempt)
            setFirstStrikeErrors(prev => prev + 1);
          }
        } else if (value.length < prev.userInput.length) {
          // Handle backspacing - remove error marks for characters being deleted
          for (let i = value.length; i < prev.userInput.length; i++) {
            if (newMistakePositions.has(`${prev.currentWordIndex}-${i}`)) {
              newMistakePositions.delete(`${prev.currentWordIndex}-${i}`);
              newErrors--;
              // Note: We don't reduce firstStrikeErrors on backspace as they represent initial mistakes
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
    setFirstStrikeErrors(0);
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
    // Calculate actual time spent based on test mode
    let timeSpent = 0;
    if (state.startTime) {
      if (testMode === "time") {
        // For time mode, use the configured test time minus remaining time
        timeSpent = testTime - timeLeft;
        // If test is completed, use full test time
        if (state.isCompleted) {
          timeSpent = testTime;
        }
      } else {
        // For words/quote mode, use actual elapsed time
        timeSpent = (Date.now() - state.startTime) / 1000;
      }
    }
    
    const wordsTyped = state.completedWords.length;
    
    // Calculate WPM with proper time handling
    let finalWpm = 0;
    if (timeSpent > 1) { // Minimum 1 second for realistic WPM
      const completedChars = state.completedWords.reduce((total, word) => total + word.length, 0);
      // Only count spaces for completed words
      const spacesTyped = state.completedWords.length;
      const totalCharsTyped = completedChars + spacesTyped;
      
      if (totalCharsTyped > 0) {
        const calculatedWpm = (totalCharsTyped / 5) / (timeSpent / 60);
        // Cap WPM at reasonable maximum (300 WPM is extremely fast)
        finalWpm = Math.round(Math.min(calculatedWpm, 300));
      }
    }
    
    // Calculate first strike accuracy (accuracy before corrections)
    const totalCharsTyped = state.completedWords.join("").length + state.userInput.length;
    const firstStrikeAccuracy = totalCharsTyped > 0 
      ? Math.round(((totalCharsTyped - firstStrikeErrors) / totalCharsTyped) * 100)
      : 100;
    
    // Use the calculateScore function from calculateScore.ts
    const score = Math.round(calculateScore(wordsTyped, finalWpm, accuracy, firstStrikeAccuracy));
    
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
      firstStrikeErrors,
      firstStrikeAccuracy,
    };
  }, [state, accuracy, firstStrikeErrors, testMode, testTime, timeLeft]);

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
