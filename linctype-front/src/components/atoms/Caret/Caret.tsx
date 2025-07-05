import React from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CaretStyle } from '../../../types/test';

interface CaretProps {
  style: CaretStyle;
  smooth?: boolean;
}

export const Caret: React.FC<CaretProps> = ({ style, smooth = true }) => {
  const getCaretStyles = (caretStyle: CaretStyle) => {
    const baseStyles = {
      position: 'absolute' as const,
      left: '0',
      top: '0',
      pointerEvents: 'none' as const,
      zIndex: 1,
    };

    switch (caretStyle) {
      case 'line':
        return {
          ...baseStyles,
          width: '2px',
          height: '100%',
          bg: 'caret',
          left: '0',
        };
      case 'block':
        return {
          ...baseStyles,
          width: '100%',
          height: '100%',
          bg: 'caret',
          opacity: 0.5,
        };
      case 'outline':
        return {
          ...baseStyles,
          width: '100%',
          height: '100%',
          border: '2px solid',
          borderColor: 'caret',
          bg: 'transparent',
        };
      case 'underline':
        return {
          ...baseStyles,
          width: '100%',
          height: '2px',
          bg: 'caret',
          bottom: '0',
          top: 'auto',
        };
      default:
        return {
          ...baseStyles,
          width: '2px',
          height: '100%',
          bg: 'caret',
        };
    }
  };

  const caretStyles = getCaretStyles(style);

  return (
    <Box
      as={motion.div}
      {...caretStyles}
      animate={{ opacity: [1, 0, 1] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};