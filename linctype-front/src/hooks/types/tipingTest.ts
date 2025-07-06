import { TypingState } from "../../types/test";

// Action types for the reducer
type TypingAction =
  | { type: "START_TEST"; startTime: number }
  | {
      type: "UPDATE_INPUT";
      input: string;
      currentWord: string;
      wordIndex: number;
    }
  | { type: "COMPLETE_WORD"; word: string; isCorrect: boolean }
  | { type: "ADVANCE_WORD" }
  | { type: "GO_BACK_WORD"; previousWord: string; previousIndex: number }
  | { type: "COMPLETE_TEST" }
  | { type: "RESET_TEST"; words: string[] }
  | { type: "SET_WORDS"; words: string[] }
  | { type: "ADD_ERROR"; position: string }
  | { type: "REMOVE_ERROR"; position: string }
  | { type: "BACKSPACE_CHAR"; removedErrorPositions: string[] };

// Enhanced state with computed properties
interface EnhancedTypingState extends TypingState {
  readonly totalCharsTyped: number;
  readonly currentWord: string;
  readonly isOnFirstWord: boolean;
  readonly canGoBack: boolean;
}

export type { TypingAction, EnhancedTypingState };
