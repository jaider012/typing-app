import { useReducer, useCallback, useEffect } from "react";
import { TestMode, TypingState } from "../types/test";
import { useTimer } from "./useTimer";
import { useAuth } from "./useAuth";
import { useCreateTest } from "./useApi";
import { useTestConfiguration } from "./useTestConfiguration";
import { useTypingStatistics } from "./useTypingStatistics";
import { CreateTestDto } from "../services/types";
import { generateWords, generateQuote } from "../utils/wordGenerator";
import { createToaster } from "@chakra-ui/react";
import { EnhancedTypingState, TypingAction } from "./types/tipingTest";

const toaster = createToaster({
  placement: "top",
  pauseOnPageIdle: true,
});

// Reducer function with immutable updates
function typingReducer(
  state: EnhancedTypingState,
  action: TypingAction
): EnhancedTypingState {
  const baseUpdate = (updates: Partial<TypingState>) => ({
    ...state,
    ...updates,
    // Recompute derived properties
    totalCharsTyped: computeTotalCharsTyped(
      updates.completedWords ?? state.completedWords,
      updates.userInput ?? state.userInput
    ),
    currentWord:
      (updates.words ?? state.words)[
        updates.currentWordIndex ?? state.currentWordIndex
      ] || "",
    isOnFirstWord: (updates.currentWordIndex ?? state.currentWordIndex) === 0,
    canGoBack: canGoBackToPreviousWord(
      updates.currentWordIndex ?? state.currentWordIndex,
      updates.completedWords ?? state.completedWords,
      updates.words ?? state.words
    ),
  });

  switch (action.type) {
    case "START_TEST":
      return baseUpdate({
        isActive: true,
        startTime: action.startTime,
      });

    case "UPDATE_INPUT":
      return baseUpdate({
        userInput: action.input,
        currentCharIndex: action.input.length,
      });

    case "COMPLETE_WORD":
      const newCompletedWords = [...state.completedWords, action.word];
      return baseUpdate({
        completedWords: newCompletedWords,
        userInput: "",
        currentCharIndex: 0,
      });

    case "ADVANCE_WORD":
      const nextIndex = state.currentWordIndex + 1;
      return baseUpdate({
        currentWordIndex: nextIndex,
        userInput: "",
        currentCharIndex: 0,
      });

    case "GO_BACK_WORD":
      const newCompleted = [...state.completedWords];
      newCompleted.pop();

      // Remove errors for the previous word
      const newMistakePositions = new Set(state.mistakePositions);
      const previousWord = state.words[action.previousIndex];
      for (
        let i = 0;
        i < Math.max(action.previousWord.length, previousWord.length);
        i++
      ) {
        newMistakePositions.delete(`${action.previousIndex}-${i}`);
      }

      return baseUpdate({
        currentWordIndex: action.previousIndex,
        userInput: action.previousWord,
        currentCharIndex: action.previousWord.length,
        completedWords: newCompleted,
        mistakePositions: newMistakePositions,
        errors: newMistakePositions.size,
      });

    case "COMPLETE_TEST":
      return baseUpdate({
        isCompleted: true,
        isActive: false,
      });

    case "RESET_TEST":
      return {
        ...initialState,
        words: action.words,
        totalCharsTyped: 0,
        currentWord: action.words[0] || "",
        isOnFirstWord: true,
        canGoBack: false,
      };

    case "SET_WORDS":
      return baseUpdate({
        words: action.words,
        currentWordIndex: 0,
        userInput: "",
        completedWords: [],
        currentCharIndex: 0,
        isActive: false,
        isCompleted: false,
        startTime: null,
        errors: 0,
        mistakePositions: new Set(),
      });

    case "ADD_ERROR":
      const newMistakes = new Set(state.mistakePositions);
      newMistakes.add(action.position);
      return baseUpdate({
        mistakePositions: newMistakes,
        errors: newMistakes.size,
      });

    case "REMOVE_ERROR":
      const updatedMistakes = new Set(state.mistakePositions);
      updatedMistakes.delete(action.position);
      return baseUpdate({
        mistakePositions: updatedMistakes,
        errors: updatedMistakes.size,
      });

    case "BACKSPACE_CHAR":
      const mistakesAfterBackspace = new Set(state.mistakePositions);
      action.removedErrorPositions.forEach((pos) =>
        mistakesAfterBackspace.delete(pos)
      );
      return baseUpdate({
        mistakePositions: mistakesAfterBackspace,
        errors: mistakesAfterBackspace.size,
      });

    default:
      return state;
  }
}

// Helper functions for computed properties
function computeTotalCharsTyped(
  completedWords: string[],
  userInput: string
): number {
  const completedChars = completedWords.reduce(
    (total, word) => total + word.length,
    0
  );
  const spacesTyped = completedWords.length;
  return completedChars + spacesTyped + userInput.length;
}

function canGoBackToPreviousWord(
  currentIndex: number,
  completedWords: string[],
  words: string[]
): boolean {
  if (currentIndex <= 0) return false;
  const previousIndex = currentIndex - 1;
  const previousWord = words[previousIndex];
  const previousTypedWord = completedWords[previousIndex];
  return previousTypedWord !== previousWord;
}

// Initial state
const initialState: EnhancedTypingState = {
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
  totalCharsTyped: 0,
  currentWord: "",
  isOnFirstWord: true,
  canGoBack: false,
};

// Custom hook for test completion logic
function useTestCompletion(
  state: EnhancedTypingState,
  testMode: TestMode,
  timeLeft: number,
  dispatch: React.Dispatch<TypingAction>
) {
  useEffect(() => {
    const shouldComplete =
      (testMode === "time" && timeLeft === 0 && state.startTime) ||
      (testMode === "words" && state.completedWords.length >= 50) ||
      (state.currentWordIndex >= state.words.length && state.words.length > 0);

    if (shouldComplete && !state.isCompleted) {
      dispatch({ type: "COMPLETE_TEST" });
    }
  }, [
    testMode,
    timeLeft,
    state.startTime,
    state.completedWords.length,
    state.currentWordIndex,
    state.words.length,
    state.isCompleted,
    dispatch,
  ]);
}

// Main hook using reducer pattern
export const useTypingTestReducer = () => {
  const { isAuthenticated } = useAuth();
  const createTestApi = useCreateTest();

  // Configuration state (separate from complex typing state)
  const { testTime, testMode, setTestTime, setTestMode } =
    useTestConfiguration();

  // Main state with reducer
  const [state, dispatch] = useReducer(typingReducer, initialState);

  // Timer hook
  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer(testTime);

  // Specialized calculation hooks
  const statistics = useTypingStatistics(state);

  // Test completion logic
  useTestCompletion(state, testMode, timeLeft, dispatch);

  // Word generation with memoization
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
        newWords = generateWords(200);
        break;
    }

    dispatch({ type: "SET_WORDS", words: newWords });
  }, [testMode]);

  // Initialize words
  useEffect(() => {
    generateNewWords();
  }, [generateNewWords]);

  // Input handling with cleaner logic
  const handleInput = useCallback(
    (value: string) => {
      // Start test on first input
      if (!state.isActive && value.length > 0) {
        startTimer();
        dispatch({ type: "START_TEST", startTime: Date.now() });
      }

      // Handle backspace to previous word
      if (value === "" && state.userInput === "" && state.canGoBack) {
        const previousIndex = state.currentWordIndex - 1;
        const previousTypedWord = state.completedWords[previousIndex];
        dispatch({
          type: "GO_BACK_WORD",
          previousWord: previousTypedWord,
          previousIndex,
        });
        return;
      }

      const currentWord = state.currentWord;
      if (!currentWord) return;

      // Handle space - advance to next word
      if (value.endsWith(" ")) {
        const typedWord = value.slice(0, -1);
        const isCorrect = typedWord === currentWord;

        dispatch({ type: "COMPLETE_WORD", word: typedWord, isCorrect });
        dispatch({ type: "ADVANCE_WORD" });

        // Add errors for incorrect words
        if (!isCorrect) {
          const maxLength = Math.max(typedWord.length, currentWord.length);
          for (let i = 0; i < maxLength; i++) {
            if (typedWord[i] !== currentWord[i]) {
              dispatch({
                type: "ADD_ERROR",
                position: `${state.currentWordIndex}-${i}`,
              });
            }
          }
        }
        return;
      }

      // Auto-advance when word is completed correctly
      if (value === currentWord) {
        dispatch({ type: "COMPLETE_WORD", word: value, isCorrect: true });
        dispatch({ type: "ADVANCE_WORD" });
        return;
      }

      // Handle character-level errors and backspacing
      if (value.length > state.userInput.length) {
        // Typing forward - check for errors
        const newCharIndex = value.length - 1;
        const typedChar = value[newCharIndex];
        const expectedChar = currentWord[newCharIndex];

        if (newCharIndex >= currentWord.length || typedChar !== expectedChar) {
          dispatch({
            type: "ADD_ERROR",
            position: `${state.currentWordIndex}-${newCharIndex}`,
          });
        }
      } else if (value.length < state.userInput.length) {
        // Backspacing - remove errors
        const removedPositions: string[] = [];
        for (let i = value.length; i < state.userInput.length; i++) {
          const position = `${state.currentWordIndex}-${i}`;
          if (state.mistakePositions.has(position)) {
            removedPositions.push(position);
          }
        }
        if (removedPositions.length > 0) {
          dispatch({
            type: "BACKSPACE_CHAR",
            removedErrorPositions: removedPositions,
          });
        }
      }

      // Prevent typing beyond word length
      if (value.length > currentWord.length && !value.endsWith(" ")) {
        return;
      }

      dispatch({
        type: "UPDATE_INPUT",
        input: value,
        currentWord,
        wordIndex: state.currentWordIndex,
      });
    },
    [
      state.isActive,
      state.userInput,
      state.canGoBack,
      state.currentWordIndex,
      state.completedWords,
      state.currentWord,
      state.mistakePositions,
      startTimer,
    ]
  );

  // Other handlers
  const resetTest = useCallback(() => {
    resetTimer(testTime);
    generateNewWords();
  }, [resetTimer, testTime, generateNewWords]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        resetTest();
      } else if (e.key === "Escape" && state.isActive) {
        e.preventDefault();
        resetTest();
      }
    },
    [state.isActive, resetTest]
  );

  // Save functionality
  const saveResult = useCallback(async () => {
    if (!isAuthenticated || !state.isCompleted) {
      return {
        success: false,
        error: "Test not completed or user not authenticated",
      };
    }

    try {
      const payload: CreateTestDto = {
        wpm: statistics.results.wpm,
        accuracy: statistics.results.accuracy,
        score: statistics.results.score,
        wordsTyped: statistics.results.wordsTyped,
        timeSpent: statistics.results.timeSpent,
        mistakes: statistics.results.errors,
        text: statistics.results.text,
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
  }, [isAuthenticated, state.isCompleted, statistics.results, createTestApi]);

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

    // Computed properties
    currentWord: state.currentWord,
    canGoBack: state.canGoBack,
    totalCharsTyped: state.totalCharsTyped,

    // Statistics
    wpm: statistics.wpm,
    accuracy: statistics.accuracy,
    errors: state.errors,
    results: statistics.results,

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

    // Save state
    isSaving: createTestApi.loading,
    saveError: createTestApi.error,
    canSave: isAuthenticated && state.isCompleted,
  };
};
