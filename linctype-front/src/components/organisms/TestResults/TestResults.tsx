import React from "react";
import { Text, Grid, Box, HStack, Icon } from "@chakra-ui/react";
import {
  BiTachometer,
  BiTargetLock,
  BiBarChart,
  BiRefresh,
  BiSave,
} from "react-icons/bi";
import { ResultMetric } from "../../molecules";
import { ActionButton, MotionBox } from "../../atoms";
import { TestResult } from "../../../types/test";

interface TestResultsProps {
  results: TestResult;
  previousBest?: TestResult;
  onRetry: () => void;
  onSave?: () => void;
  isVisible: boolean;
}

export const TestResults: React.FC<TestResultsProps> = ({
  results,
  previousBest,
  onRetry,
  onSave,
  isVisible,
}) => {
  const improvements = previousBest
    ? {
        wpm: results.wpm > previousBest.wpm,
        accuracy: results.accuracy > previousBest.accuracy,
        consistency: results.consistency > previousBest.consistency,
      }
    : undefined;

  if (!isVisible) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.600"
      backdropFilter="blur(10px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
      p={4}
    >
      <MotionBox
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        bg="modal"
        border="1px solid"
        borderColor="border"
        borderRadius="lg"
        maxW="2xl"
        w="full"
        maxH="90vh"
        overflowY="auto"
        p={6}
      >
        <Box textAlign="center" pb={4}>
          <Text fontSize="2xl" fontWeight="bold" color="main" fontFamily="mono">
            Test Complete! 🎉
          </Text>
          <Text fontSize="sm" color="sub" fontWeight="normal" mt={1}>
            Great job! Here are your results
          </Text>
        </Box>
        {/* Main metrics */}
        <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={6}>
          <ResultMetric
            label="WPM"
            value={results.wpm}
            previousValue={previousBest?.wpm}
            improvement={improvements?.wpm}
            icon={<Icon as={BiTachometer} />}
          />
          <ResultMetric
            label="Accuracy"
            value={`${results.accuracy}%`}
            previousValue={
              previousBest ? `${previousBest.accuracy}%` : undefined
            }
            improvement={improvements?.accuracy}
            icon={<Icon as={BiTargetLock} />}
          />
          <ResultMetric
            label="Consistency"
            value={`${Math.round(results.consistency)}%`}
            previousValue={
              previousBest
                ? `${Math.round(previousBest.consistency)}%`
                : undefined
            }
            improvement={improvements?.consistency}
            icon={<Icon as={BiBarChart} />}
          />
        </Grid>

        {/* Additional stats */}
        <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={6}>
          <Box p={4} bg="card" borderRadius="md" textAlign="center">
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="main"
              fontFamily="mono"
            >
              {results.wordsTyped}
            </Text>
            <Text fontSize="sm" color="sub" fontFamily="mono">
              Words Typed
            </Text>
          </Box>
          <Box p={4} bg="card" borderRadius="md" textAlign="center">
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="main"
              fontFamily="mono"
            >
              {results.timeSpent}s
            </Text>
            <Text fontSize="sm" color="sub" fontFamily="mono">
              Time Spent
            </Text>
          </Box>
        </Grid>

        {/* Score breakdown */}
        <Box p={4} bg="card" borderRadius="md" mb={6}>
          <Text fontSize="sm" color="sub" mb={2} fontFamily="mono">
            Score Calculation:
          </Text>
          <Text fontSize="xs" color="sub" fontFamily="mono" opacity={0.8}>
            {results.wpm} WPM × {results.accuracy}% accuracy ×{" "}
            {results.wordsTyped} words ÷ 100 = {results.score} points
          </Text>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="primary.400"
            mt={2}
            fontFamily="mono"
          >
            Final Score: {results.score}
          </Text>
        </Box>

        {/* Action buttons */}
        <HStack gap={4} justify="center">
          <ActionButton
            variant="solid"
            icon={<Icon as={BiRefresh} />}
            onClick={onRetry}
            size="lg"
          >
            Try Again
          </ActionButton>
          {onSave && (
            <ActionButton
              variant="solid"
              icon={<Icon as={BiSave} />}
              onClick={onSave}
              size="lg"
            >
              Save Result
            </ActionButton>
          )}
        </HStack>

        {/* Quick restart hint */}
        <Text
          textAlign="center"
          mt={4}
          fontSize="xs"
          color="sub"
          fontFamily="mono"
        >
          Press Tab to quickly restart
        </Text>
      </MotionBox>
    </Box>
  );
};
