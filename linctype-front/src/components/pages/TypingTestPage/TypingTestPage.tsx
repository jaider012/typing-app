import React from "react";
import { VStack, HStack, Icon, Box } from "@chakra-ui/react";
import { BiPlay, BiRefresh } from "react-icons/bi";
import { MainLayout } from "../../templates/MainLayout/MainLayout";
import { TypingArea, TestResults } from "../../organisms";
import { TestConfigBar, StatsBar } from "../../molecules";
import { ActionButton } from "../../atoms";
import { useTypingTest } from "../../../hooks/useTypingTest";

export const TypingTestPage: React.FC = () => {
  const {
    // Test state
    words,
    currentWordIndex,
    currentCharIndex,
    userInput,
    completedWords,
    isActive,
    isCompleted,
    timeLeft,

    // Statistics
    wpm,
    accuracy,
    errors,
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

    // Save state
    isSaving,
    saveError,
    canSave,
  } = useTypingTest();

  return (
    <MainLayout>
      <VStack gap={8} align="center" w="full">
        {/* Test Configuration */}
        <TestConfigBar
          selectedTime={testTime}
          selectedMode={testMode}
          onTimeChange={setTestTime}
          onModeChange={setTestMode}
          disabled={isActive}
        />

        {/* Real-time Statistics */}
        {isActive && (
          <StatsBar
            wpm={wpm}
            accuracy={accuracy}
            timeLeft={timeLeft}
            errors={errors}
            isActive={isActive}
          />
        )}

        {/* Main Typing Area */}
        <TypingArea
          words={words}
          currentWordIndex={currentWordIndex}
          currentCharIndex={currentCharIndex}
          userInput={userInput}
          completedWords={completedWords}
          isActive={isActive}
          caretStyle="block" // TODO: Get from settings
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        />

        {/* Control Buttons */}
        {!isActive && !isCompleted && words.length > 0 && (
          <HStack gap={4}>
            <ActionButton
              variant="solid"
              onClick={() => {
                // Test will start when user begins typing
                // This button is mainly visual
              }}
            >
              Start Typing
            </ActionButton>
          </HStack>
        )}

        {isActive && (
          <ActionButton
            variant="solid"
            onClick={resetTest}
            size="sm"
          >
            Restart (Tab)
          </ActionButton>
        )}

        {/* Results Modal */}
        <TestResults
          results={results}
          onRetry={resetTest}
          isVisible={isCompleted}
          onSave={canSave ? saveResult : undefined}
          isSaving={isSaving}
        />
        
        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <Box position="fixed" top="10px" right="10px" bg="blackAlpha.800" color="white" p={2} borderRadius="md" fontSize="xs">
            <div>Active: {isActive.toString()}</div>
            <div>Completed: {isCompleted.toString()}</div>
            <div>Time Left: {timeLeft}</div>
            <div>Words: {completedWords.length}</div>
            <div>WPM: {wpm}</div>
          </Box>
        )}
      </VStack>
    </MainLayout>
  );
};
