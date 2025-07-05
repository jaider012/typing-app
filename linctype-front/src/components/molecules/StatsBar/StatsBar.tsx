import React from 'react';
import { Grid, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  BiTachometer, 
  BiTarget, 
  BiTime, 
  BiX 
} from 'react-icons/bi';
import { StatCard } from '../../atoms';

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  timeLeft: number;
  errors: number;
  isActive: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({ 
  wpm, 
  accuracy, 
  timeLeft, 
  errors, 
  isActive 
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Grid
      templateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }}
      gap={4}
      mb={6}
      w="full"
      maxW="600px"
      as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StatCard 
        label="WPM" 
        value={wpm} 
        color="primary.400"
        icon={<Icon as={BiTachometer} />}
      />
      <StatCard 
        label="Accuracy" 
        value={`${accuracy}%`} 
        color="green.400"
        icon={<Icon as={BiTarget} />}
      />
      <StatCard 
        label="Time" 
        value={formatTime(timeLeft)} 
        color="orange.400"
        icon={<Icon as={BiTime} />}
      />
      <StatCard 
        label="Errors" 
        value={errors} 
        color="red.400"
        icon={<Icon as={BiX} />}
      />
    </Grid>
  );
};