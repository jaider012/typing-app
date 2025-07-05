import React from "react";
import { Icon } from "@chakra-ui/react";
import { BiTachometer, BiTime, BiX } from "react-icons/bi";
import { BiTargetLock } from "react-icons/bi";
import { StatCard, MotionBox } from "../../atoms";

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
  isActive,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <MotionBox
      display="grid"
      gridTemplateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }}
      gap={4}
      mb={6}
      w="full"
      maxW="600px"
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
        icon={<Icon as={BiTargetLock} />}
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
    </MotionBox>
  );
};
