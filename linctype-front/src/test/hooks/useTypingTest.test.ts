import { renderHook, act } from "@testing-library/react";
import { useTypingTest } from "../../hooks/useTypingTest";
import { useTimer } from "../../hooks/useTimer";
import { useAuth } from "../../hooks/useAuth";
import { useCreateTest } from "../../hooks/useApi";

// Mock dependencies
jest.mock("../../hooks/useTimer");
jest.mock("../../hooks/useAuth");
jest.mock("../../hooks/useApi");
jest.mock("../../utils/wordGenerator", () => ({
  generateWords: jest.fn(() => ["test", "words", "for", "typing"]),
  generateQuote: jest.fn(() => "test quote for typing"),
}));

const mockUseTimer = useTimer as jest.MockedFunction<typeof useTimer>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseCreateTest = useCreateTest as jest.MockedFunction<typeof useCreateTest>;

describe("useTypingTest Hook", () => {
  const mockStartTimer = jest.fn();
  const mockResetTimer = jest.fn();
  const mockExecute = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseTimer.mockReturnValue({
      timeLeft: 60,
      isActive: false,
      isCompleted: false,
      start: mockStartTimer,
      pause: jest.fn(),
      reset: mockResetTimer,
    });

    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { 
        uid: "test-user", 
        email: "test@example.com",
        displayName: null,
        photoURL: null,
        emailVerified: true
      },
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
      sendPasswordReset: jest.fn(),
      updateProfile: jest.fn(),
      getIdToken: jest.fn(),
      clearError: jest.fn(),
      loading: false,
      error: null,
    });

    mockUseCreateTest.mockReturnValue({
      execute: mockExecute,
      loading: false,
      error: null,
      data: null,
      reset: jest.fn(),
    });
  });

  describe("Initial State", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() => useTypingTest());

      expect(result.current.words).toEqual(["test", "words", "for", "typing"]);
      expect(result.current.currentWordIndex).toBe(0);
      expect(result.current.currentCharIndex).toBe(0);
      expect(result.current.userInput).toBe("");
      expect(result.current.isActive).toBe(false);
      expect(result.current.isCompleted).toBe(false);
      expect(result.current.wpm).toBe(0);
      expect(result.current.accuracy).toBe(100);
      expect(result.current.errors).toBe(0);
    });

    it("should initialize with correct test configuration", () => {
      const { result } = renderHook(() => useTypingTest());

      expect(result.current.testTime).toBe(60);
      expect(result.current.testMode).toBe("time");
    });
  });

  describe("Test Configuration", () => {
    it("should update test time", () => {
      const { result } = renderHook(() => useTypingTest());

      act(() => {
        result.current.setTestTime(30);
      });

      expect(result.current.testTime).toBe(30);
    });

    it("should update test mode", () => {
      const { result } = renderHook(() => useTypingTest());

      act(() => {
        result.current.setTestMode("words");
      });

      expect(result.current.testMode).toBe("words");
    });
  });

  describe("Typing Logic", () => {
    it("should start test on first input", () => {
      const { result } = renderHook(() => useTypingTest());

      act(() => {
        result.current.handleInput("t");
      });

      expect(mockStartTimer).toHaveBeenCalled();
      expect(result.current.isActive).toBe(true);
      expect(result.current.userInput).toBe("t");
    });

    it("should handle correct character input", () => {
      const { result } = renderHook(() => useTypingTest());

      act(() => {
        result.current.handleInput("t");
      });

      expect(result.current.userInput).toBe("t");
      expect(result.current.errors).toBe(0);
    });

    it("should handle incorrect character input", () => {
      const { result } = renderHook(() => useTypingTest());

      act(() => {
        result.current.handleInput("x"); // "test" starts with "t", not "x"
      });

      expect(result.current.userInput).toBe("x");
      expect(result.current.errors).toBe(1);
    });

    it("should advance to next word with space", () => {
      const { result } = renderHook(() => useTypingTest());

      act(() => {
        result.current.handleInput("test ");
      });

      expect(result.current.currentWordIndex).toBe(1);
      expect(result.current.completedWords).toEqual(["test"]);
      expect(result.current.userInput).toBe("");
    });

    it("should auto-advance when word is completed correctly", () => {
      const { result } = renderHook(() => useTypingTest());

      act(() => {
        result.current.handleInput("test");
      });

      expect(result.current.currentWordIndex).toBe(1);
      expect(result.current.completedWords).toEqual(["test"]);
      expect(result.current.userInput).toBe("");
    });

    it("should handle backspace correctly", () => {
      const { result } = renderHook(() => useTypingTest());

      act(() => {
        result.current.handleInput("tx"); // Incorrect
      });

      expect(result.current.errors).toBe(1);

      act(() => {
        result.current.handleInput("t"); // Backspace to correct
      });

      expect(result.current.errors).toBe(0);
      expect(result.current.userInput).toBe("t");
    });
  });

  describe("WPM Calculation", () => {
    it("should calculate WPM correctly", () => {
      jest.spyOn(Date, "now")
        .mockReturnValueOnce(0) // Start time
        .mockReturnValue(60000); // 1 minute later

      const { result } = renderHook(() => useTypingTest());

      act(() => {
        result.current.handleInput("test ");
        result.current.handleInput("words ");
      });

      // 2 words (10 chars + 2 spaces = 12 chars) in 1 minute = 12/5 = 2.4 words = 2 WPM (rounded)
      expect(result.current.wpm).toBeGreaterThan(0);
    });
  });

  describe("Accuracy Calculation", () => {
    it("should maintain 100% accuracy with correct typing", () => {
      const { result } = renderHook(() => useTypingTest());

      act(() => {
        result.current.handleInput("test");
      });

      expect(result.current.accuracy).toBe(100);
    });

    it("should decrease accuracy with errors", () => {
      const { result } = renderHook(() => useTypingTest());

      act(() => {
        result.current.handleInput("xest"); // 1 error out of 4 chars = 75%
      });

      expect(result.current.accuracy).toBeLessThan(100);
    });
  });

  describe("Test Completion", () => {
    it("should complete test when timer reaches zero", () => {
      mockUseTimer.mockReturnValue({
        timeLeft: 0,
        isActive: false,
        isCompleted: true,
        start: mockStartTimer,
        pause: jest.fn(),
        reset: mockResetTimer,
      });

      const { result } = renderHook(() => useTypingTest());

      // Start the test first
      act(() => {
        result.current.handleInput("t");
      });

      // The useEffect should trigger completion
      expect(result.current.isCompleted).toBe(true);
      expect(result.current.isActive).toBe(false);
    });

    it("should complete test when word limit is reached", () => {
      const { result } = renderHook(() => useTypingTest());

      act(() => {
        result.current.setTestMode("words");
      });

      // Complete 50 words to trigger completion
      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.handleInput("test ");
        }
      });

      expect(result.current.isCompleted).toBe(true);
    });
  });

  describe("Test Reset", () => {
    it("should reset test state", () => {
      const { result } = renderHook(() => useTypingTest());

      // Start and progress the test
      act(() => {
        result.current.handleInput("test ");
      });

      expect(result.current.isActive).toBe(true);
      expect(result.current.completedWords.length).toBe(1);

      // Reset the test
      act(() => {
        result.current.resetTest();
      });

      expect(mockResetTimer).toHaveBeenCalled();
      expect(result.current.currentWordIndex).toBe(0);
      expect(result.current.userInput).toBe("");
      expect(result.current.completedWords).toEqual([]);
      expect(result.current.isActive).toBe(false);
    });
  });

  describe("Save Functionality", () => {
    it("should save result when authenticated and test completed", async () => {
      mockExecute.mockResolvedValue({ id: "test-id" });
      
      const { result } = renderHook(() => useTypingTest());

      // Complete the test
      act(() => {
        result.current.handleInput("test ");
      });

      // Manually set completed state for this test
      act(() => {
        // Simulate test completion
        result.current.handleKeyDown({ key: "Escape" } as KeyboardEvent);
      });

      const saveResult = await act(async () => {
        return result.current.saveResult();
      });

      expect(saveResult.success).toBe(true);
    });

    it("should not save when not authenticated", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signInWithGoogle: jest.fn(),
        signOut: jest.fn(),
        sendPasswordReset: jest.fn(),
        updateProfile: jest.fn(),
        getIdToken: jest.fn(),
        clearError: jest.fn(),
        loading: false,
        error: null,
      });

      const { result } = renderHook(() => useTypingTest());

      const saveResult = await act(async () => {
        return result.current.saveResult();
      });

      expect(saveResult.success).toBe(false);
      expect(saveResult.error).toBe("Test not completed or user not authenticated");
    });
  });

  describe("Keyboard Events", () => {
    it("should reset test on Tab key", () => {
      const { result } = renderHook(() => useTypingTest());

      const mockEvent = {
        key: "Tab",
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockResetTimer).toHaveBeenCalled();
    });

    it("should reset test on Escape key when active", () => {
      const { result } = renderHook(() => useTypingTest());

      // Start the test
      act(() => {
        result.current.handleInput("t");
      });

      const mockEvent = {
        key: "Escape",
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockResetTimer).toHaveBeenCalled();
    });
  });
}); 