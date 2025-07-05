import React, { ReactNode } from 'react';
import { Text, HStack } from '@chakra-ui/react';
import { MotionBox, MotionText } from '../../atoms';

interface ResultMetricProps {
  label: string;
  value: string | number;
  previousValue?: string | number;
  improvement?: boolean;
  icon?: ReactNode;
}

export const ResultMetric: React.FC<ResultMetricProps> = ({ 
  label, 
  value, 
  previousValue, 
  improvement, 
  icon 
}) => {
  return (
    <MotionBox
      textAlign="center"
      p={6}
      bg="card"
      borderRadius="lg"
      border="1px solid"
      borderColor="border"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {icon && (
        <MotionBox mb={3} color="primary.400" fontSize="2xl">
          {icon}
        </MotionBox>
      )}
      
      <MotionText
        fontSize="3xl"
        fontWeight="bold"
        color="main"
        fontFamily="mono"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
      >
        {value}
      </MotionText>
      
      <Text fontSize="sm" color="sub" mt={2} fontFamily="mono">
        {label}
      </Text>
      
      {previousValue !== undefined && (
        <HStack justify="center" mt={2} gap={1}>
          <Text fontSize="xs" color={improvement ? "green.400" : "red.400"} fontFamily="mono">
            {improvement ? "↗" : "↘"} {previousValue}
          </Text>
        </HStack>
      )}
    </MotionBox>
  );
};