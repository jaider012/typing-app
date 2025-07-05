import { useState, useCallback, useMemo, useEffect } from 'react';
import { TestMode, TestResult, TypingState } from '../types/test';
import { useTimer } from './useTimer';
import { generateWords, generateQuote } from '../utils/wordGenerator';

export const useTypingTest = () => {
  // Test configuration
  const [testTime, setTestTime] = useState(60);
  const [testMode, setTestMode] = useState<TestMode>('time');
  
  // Test state
  const [state, setState] = useState<TypingState>({
    words: [],
    currentWordIndex: 0,
    currentCharIndex: 0,
    userInput: '',
    completedWords: [],
    isActive: false,
    isCompleted: false,
    startTime: null,
    errors: 0,
    mistakePositions: new Set(),
  });

  // Timer hook
  const { timeLeft, isActive: timerActive, start: startTimer, reset: resetTimer } = useTimer(testTime);

  // Generate initial words
  useEffect(() => {
    generateNewWords();
  }, [testMode]);

  const generateNewWords = useCallback(() => {
    let newWords: string[];
    
    switch (testMode) {
      case 'words':
        newWords = generateWords(50);
        break;
      case 'quote':
        const quote = generateQuote();
        newWords = quote.split(' ');
        break;
      case 'time':
      default:
        newWords = generateWords(200); // Generate enough words for longest possible test
        break;
    }
    
    setState(prev => ({
      ...prev,
      words: newWords,
      currentWordIndex: 0,
      currentCharIndex: 0,
      userInput: '',
      completedWords: [],
      isActive: false,
      isCompleted: false,
      startTime: null,
      errors: 0,
      mistakePositions: new Set(),
    }));
  }, [testMode]);

  // Calculate WPM
  const wpm = useMemo(() => {
    if (!state.startTime || !state.isActive) return 0;
    
    const timeElapsed = (Date.now() - state.startTime) / 1000 / 60; // in minutes
    if (timeElapsed === 0) return 0;
    
    const correctWords = state.completedWords.filter((word, index) => 
      word === state.words[index]
    ).length;
    
    return Math.round(correctWords / timeElapsed);
  }, [state.startTime, state.isActive, state.completedWords, state.words]);

  // Calculate accuracy
  const accuracy = useMemo(() => {
    const totalChars = state.completedWords.join('').length + state.userInput.length;
    if (totalChars === 0) return 100;
    
    const correctChars = totalChars - state.errors;
    return Math.round((correctChars / totalChars) * 100);
  }, [state.completedWords, state.userInput, state.errors]);

  // Handle input changes
  const handleInput = useCallback((value: string) => {
    setState(prev => {
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

      const currentWord = prev.words[prev.currentWordIndex];
      if (!currentWord) return prev;

      let newErrors = prev.errors;
      const newMistakePositions = new Set(prev.mistakePositions);

      // Check for new errors only when typing forward
      if (value.length > prev.userInput.length) {
        const newCharIndex = value.length - 1;
        const typedChar = value[newCharIndex];
        const expectedChar = currentWord[newCharIndex];
        
        if (typedChar !== expectedChar) {
          newErrors++;
          newMistakePositions.add(`${prev.currentWordIndex}-${newCharIndex}`);
        }
      }

      // Handle space key - move to next word
      if (value.endsWith(' ')) {
        const typedWord = value.slice(0, -1); // Remove the space
        const newCompletedWords = [...prev.completedWords, typedWord];
        const newCurrentWordIndex = prev.currentWordIndex + 1;

        // Check if test is complete
        if (newCurrentWordIndex >= prev.words.length || (testMode === 'words' && newCurrentWordIndex >= 50)) {
          return {
            ...prev,
            completedWords: newCompletedWords,
            userInput: '',
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
          userInput: '',
          currentWordIndex: newCurrentWordIndex,
          currentCharIndex: 0,
          errors: newErrors,
          mistakePositions: newMistakePositions,
        };
      }

      // Handle exact word completion without space
      if (value === currentWord) {
        // Don't auto-advance, wait for space
        return {
          ...prev,
          userInput: value,
          currentCharIndex: value.length,
          errors: newErrors,
          mistakePositions: newMistakePositions,
        };
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
  }, [startTimer, testMode]);

  // Handle key events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Handle tab to restart
    if (e.key === 'Tab') {
      e.preventDefault();
      resetTest();
    }
    
    // Prevent certain keys during active test
    if (state.isActive) {
      if (e.key === 'Escape') {
        e.preventDefault();
        resetTest();
      }
    }
  }, [state.isActive]);

  // Reset test
  const resetTest = useCallback(() => {
    resetTimer(testTime);
    generateNewWords();
  }, [resetTimer, testTime, generateNewWords]);

  // Check for timer completion
  useEffect(() => {
    if (testMode === 'time' && timeLeft === 0 && state.isActive) {
      setState(prev => ({
        ...prev,
        isCompleted: true,
        isActive: false,
      }));
    }
  }, [timeLeft, testMode, state.isActive]);

  // Calculate final results
  const results: TestResult = useMemo(() => {
    if (!state.isCompleted) {
      return {
        wpm: 0,
        accuracy: 0,
        score: 0,
        wordsTyped: 0,
        timeSpent: 0,
        mistakes: 0,
        errors: 0,
        text: '',
        consistency: 0,
        createdAt: new Date().toISOString(),
      };
    }

    const timeSpent = state.startTime ? (Date.now() - state.startTime) / 1000 : 0;
    const wordsTyped = state.completedWords.length;
    const finalWpm = timeSpent > 0 ? Math.round((wordsTyped / (timeSpent / 60))) : 0;
    const score = Math.round(finalWpm * accuracy * (wordsTyped / 100));

    return {
      wpm: finalWpm,
      accuracy,
      score,
      wordsTyped,
      timeSpent: Math.round(timeSpent),
      mistakes: state.mistakePositions.size,
      errors: state.errors,
      text: state.words.slice(0, state.currentWordIndex + 1).join(' '),
      consistency: Math.max(0, 100 - (state.mistakePositions.size / wordsTyped) * 100),
      createdAt: new Date().toISOString(),
    };
  }, [state, accuracy]);

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
    startTest: () => {
      if (!state.isActive) {
        // Focus will trigger input which will start the test
      }
    }
  };
};