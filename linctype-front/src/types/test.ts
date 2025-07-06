export type CharacterState = 'pending' | 'correct' | 'incorrect' | 'current';

export type CaretStyle = 'line' | 'block' | 'outline' | 'underline';

export type TestMode = 'time' | 'words' | 'quote';

export interface TestResult {
  wpm: number;
  accuracy: number;
  score: number;
  wordsTyped: number;
  timeSpent: number;
  mistakes: number;
  errors: number;
  text: string;
  consistency: number;
  createdAt: string;
  firstStrikeAccuracy: number;
}

export interface TestConfig {
  time: number;
  mode: TestMode;
  language: string;
}

export interface TypingState {
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  userInput: string;
  completedWords: string[];
  isActive: boolean;
  isCompleted: boolean;
  startTime: number | null;
  errors: number;
  mistakePositions: Set<string>;
}