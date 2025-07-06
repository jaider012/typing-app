import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TypingTestPage } from "../../components/pages/TypingTestPage/TypingTestPage";
import { useTypingTest } from "../../hooks/useTypingTest";

// Mock the hook
jest.mock("../../hooks/useTypingTest");

// Mock Chakra UI components
jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  createToaster: jest.fn(() => ({
    create: jest.fn(),
  })),
}));

const mockUseTypingTest = useTypingTest as jest.MockedFunction<
  typeof useTypingTest
>;

describe("TypingTestPage - Simple Tests", () => {
  const defaultMockValues = {
    words: ["hello", "world", "test", "typing"],
    currentWordIndex: 0,
    currentCharIndex: 0,
    userInput: "",
    completedWords: [],
    isActive: false,
    isCompleted: false,
    timeLeft: 60,
    wpm: 0,
    accuracy: 100,
    errors: 0,
    results: {
      wpm: 0,
      accuracy: 100,
      score: 0,
      wordsTyped: 0,
      timeSpent: 0,
      mistakes: 0,
      errors: 0,
      text: "",
      consistency: 100,
      createdAt: new Date().toISOString(),
      firstStrikeAccuracy: 100,
    },
    testTime: 60,
    testMode: "time" as const,
    handleInput: jest.fn(),
    handleKeyDown: jest.fn(),
    resetTest: jest.fn(),
    setTestTime: jest.fn(),
    setTestMode: jest.fn(),
    saveResult: jest.fn(),
    startTest: jest.fn(),
    isSaving: false,
    saveError: null,
    canSave: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTypingTest.mockReturnValue(defaultMockValues);
  });

  describe("Basic Rendering", () => {
    it("should render without crashing", () => {
      render(<TypingTestPage />);
      expect(screen.getByText("hello")).toBeInTheDocument();
    });

    it("should render all test words", () => {
      render(<TypingTestPage />);
      expect(screen.getByText("hello")).toBeInTheDocument();
      expect(screen.getByText("world")).toBeInTheDocument();
      expect(screen.getByText("test")).toBeInTheDocument();
      expect(screen.getByText("typing")).toBeInTheDocument();
    });

    it("should render test configuration options", () => {
      render(<TypingTestPage />);
      // Check for time options
      expect(screen.getByText("15")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
      expect(screen.getByText("60")).toBeInTheDocument();
      expect(screen.getByText("120")).toBeInTheDocument();

      // Check for mode options
      expect(screen.getByText("time")).toBeInTheDocument();
      expect(screen.getByText("words")).toBeInTheDocument();
      expect(screen.getByText("quote")).toBeInTheDocument();
    });
  });

  describe("Test States", () => {
    it("should show start button when test is inactive", () => {
      render(<TypingTestPage />);
      expect(screen.getByText("Start Typing")).toBeInTheDocument();
    });

    it("should show restart button when test is active", () => {
      mockUseTypingTest.mockReturnValue({
        ...defaultMockValues,
        isActive: true,
      });

      render(<TypingTestPage />);
      expect(screen.getByText("Restart (Tab)")).toBeInTheDocument();
    });

    it("should show stats when test is active", () => {
      mockUseTypingTest.mockReturnValue({
        ...defaultMockValues,
        isActive: true,
        wpm: 25,
        accuracy: 95,
      });

      render(<TypingTestPage />);
      expect(screen.getByText("25")).toBeInTheDocument();
      expect(screen.getByText("95%")).toBeInTheDocument();
    });
  });

  describe("Test Completion", () => {
    it("should show results modal when test is completed", () => {
      mockUseTypingTest.mockReturnValue({
        ...defaultMockValues,
        isCompleted: true,
        results: {
          ...defaultMockValues.results,
          wpm: 45,
          accuracy: 95,
          wordsTyped: 10,
          score: 100,
          firstStrikeAccuracy: 90,
        },
      });

      render(<TypingTestPage />);
      expect(screen.getByText("Test Complete! 🎉")).toBeInTheDocument();
      expect(screen.getByText("45")).toBeInTheDocument(); // WPM
      expect(screen.getByText("95%")).toBeInTheDocument(); // Accuracy
    });

    it("should show save button when user can save", () => {
      mockUseTypingTest.mockReturnValue({
        ...defaultMockValues,
        isCompleted: true,
        canSave: true,
      });

      render(<TypingTestPage />);
      expect(screen.getByText("Save Result")).toBeInTheDocument();
    });

    it("should show try again button", () => {
      mockUseTypingTest.mockReturnValue({
        ...defaultMockValues,
        isCompleted: true,
      });

      render(<TypingTestPage />);
      expect(screen.getByText("Try Again")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call handleInput when typing", () => {
      render(<TypingTestPage />);
      const input = screen.getByDisplayValue("");

      fireEvent.change(input, { target: { value: "h" } });
      expect(defaultMockValues.handleInput).toHaveBeenCalledWith("h");
    });

    it("should call resetTest when restart button is clicked", () => {
      mockUseTypingTest.mockReturnValue({
        ...defaultMockValues,
        isActive: true,
      });

      render(<TypingTestPage />);
      const restartButton = screen.getByText("Restart (Tab)");

      fireEvent.click(restartButton);
      expect(defaultMockValues.resetTest).toHaveBeenCalled();
    });

    it("should call setTestTime when time option is clicked", () => {
      render(<TypingTestPage />);
      const timeButton = screen.getByText("30");

      fireEvent.click(timeButton);
      expect(defaultMockValues.setTestTime).toHaveBeenCalledWith(30);
    });

    it("should call setTestMode when mode option is clicked", () => {
      render(<TypingTestPage />);
      const modeButton = screen.getByText("words");

      fireEvent.click(modeButton);
      expect(defaultMockValues.setTestMode).toHaveBeenCalledWith("words");
    });
  });

  describe("Keyboard Events", () => {
    it("should handle Tab key for restart", () => {
      render(<TypingTestPage />);

      fireEvent.keyDown(document, { key: "Tab" });
      expect(defaultMockValues.handleKeyDown).toHaveBeenCalled();
    });

    it("should handle Escape key", () => {
      mockUseTypingTest.mockReturnValue({
        ...defaultMockValues,
        isActive: true,
      });

      render(<TypingTestPage />);

      fireEvent.keyDown(document, { key: "Escape" });
      expect(defaultMockValues.handleKeyDown).toHaveBeenCalled();
    });
  });

  describe("Loading States", () => {
    it("should show saving state", () => {
      mockUseTypingTest.mockReturnValue({
        ...defaultMockValues,
        isCompleted: true,
        canSave: true,
        isSaving: true,
      });

      render(<TypingTestPage />);
      expect(screen.getByText("Saving...")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have hidden input with proper attributes", () => {
      render(<TypingTestPage />);
      const input = screen.getByDisplayValue("");

      expect(input).toHaveAttribute("autoComplete", "off");
      expect(input).toHaveAttribute("spellCheck", "false");
    });
  });

  describe("Configuration Disabled State", () => {
    it("should disable configuration when test is active", () => {
      mockUseTypingTest.mockReturnValue({
        ...defaultMockValues,
        isActive: true,
      });

      render(<TypingTestPage />);

      // Configuration buttons should be disabled
      const timeButton = screen.getByText("30");
      expect(timeButton).toBeDisabled();
    });
  });
});
