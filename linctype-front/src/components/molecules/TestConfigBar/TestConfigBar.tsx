import React from 'react';
import { HStack, Text, Divider } from '@chakra-ui/react';
import { ActionButton } from '../../atoms';
import { TestMode } from '../../../types/test';

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
  disabled = false
}) => {
  const timeOptions = [15, 30, 60, 120];
  const modeOptions: TestMode[] = ['time', 'words', 'quote'];

  return (
    <HStack spacing={6} justify="center" mb={6} flexWrap="wrap">
      <HStack spacing={2}>
        <Text fontSize="sm" color="sub" fontFamily="mono">
          time
        </Text>
        {timeOptions.map((time) => (
          <ActionButton
            key={time}
            size="sm"
            variant={selectedTime === time ? 'primary' : 'ghost'}
            onClick={() => onTimeChange(time)}
            disabled={disabled}
          >
            {time}
          </ActionButton>
        ))}
      </HStack>
      
      <Divider orientation="vertical" height="30px" />
      
      <HStack spacing={2}>
        <Text fontSize="sm" color="sub" fontFamily="mono">
          mode
        </Text>
        {modeOptions.map((mode) => (
          <ActionButton
            key={mode}
            size="sm"
            variant={selectedMode === mode ? 'primary' : 'ghost'}
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