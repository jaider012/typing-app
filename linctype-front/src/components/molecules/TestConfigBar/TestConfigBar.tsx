import React from "react";
import { HStack, Text, Box } from "@chakra-ui/react";
import { ActionButton } from "../../atoms";
import { TestMode } from "../../../types/test";

interface TestConfigBarProps {
  selectedTime: number;
  selectedMode: TestMode;
  onTimeChange: (time: number) => void;
  onModeChange: (mode: TestMode) => void;
  disabled?: boolean;
}

export const TestConfigBar: React.FC<TestConfigBarProps> = ({
  selectedTime,
  selectedMode,
  onTimeChange,
  onModeChange,
  disabled = false,
}) => {
  const timeOptions = [15, 30, 60, 120];
  const modeOptions: TestMode[] = ["time", "words", "quote"];

  return (
    <HStack gap={6} justify="center" mb={6} flexWrap="wrap">
      <HStack gap={2}>
        <Text fontSize="sm" color="sub" fontFamily="mono">
          time
        </Text>
        {timeOptions.map((time) => (
          <ActionButton
            key={time}
            size="sm"
            variant={selectedTime === time ? "solid" : "ghost"}
            onClick={() => onTimeChange(time)}
            disabled={disabled}
          >
            {time}
          </ActionButton>
        ))}
      </HStack>

      <Box height="30px" bg="border" w="1px" my={2} mx={2} />

      <HStack gap={2}>
        <Text fontSize="sm" color="sub" fontFamily="mono">
          mode
        </Text>
        {modeOptions.map((mode) => (
          <ActionButton
            key={mode}
            size="sm"
            variant={selectedMode === mode ? "solid" : "ghost"}
            onClick={() => onModeChange(mode)}
            disabled={disabled}
          >
            {mode}
          </ActionButton>
        ))}
      </HStack>
    </HStack>
  );
};
