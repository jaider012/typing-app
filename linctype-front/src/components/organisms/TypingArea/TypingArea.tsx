import React, { useRef, useEffect } from 'react';
import { Box, Textarea, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Word } from '../../molecules';
import { CaretStyle } from '../../../types/test';

interface TypingAreaProps {
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  userInput: string;
  completedWords: string[];
  isActive: boolean;
  caretStyle: CaretStyle;
  onInput: (value: string) => void;
  onKeyDown: (e: KeyboardEvent) => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({ 
  words, 
  currentWordIndex, 
  currentCharIndex,
  userInput, 
  completedWords, 
  isActive, 
  caretStyle,
  onInput, 
  onKeyDown 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);

  // Auto-focus and maintain focus
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isActive]);

  // Auto-scroll to keep active word visible
  useEffect(() => {
    if (activeWordRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [currentWordIndex]);

  // Handle click to refocus
  const handleClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Handle textarea events
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown(e.nativeEvent);
  };

  // Calculate display words (show current and next few lines)
  const displayWords = words.slice(
    Math.max(0, currentWordIndex - 10), 
    currentWordIndex + 50
  );
  const displayStartIndex = Math.max(0, currentWordIndex - 10);

  return (
    <Box position="relative" w="full" maxW="900px" mx="auto">
      {/* Invisible input for capturing typing */}
      <Textarea
        ref={textareaRef}
        position="absolute"
        opacity={0}
        pointerEvents="none"
        top={0}
        left={0}
        w="full"
        h="full"
        resize="none"
        value={userInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        tabIndex={0}
        aria-label="Typing input"
      />
      
      {/* Words display area */}
      <Box
        minH="120px"
        maxH="200px"
        overflow="hidden"
        p={6}
        bg="textArea"
        borderRadius="lg"
        border="2px solid"
        borderColor={isActive ? 'primary.400' : 'border'}
        fontSize="1.5rem"
        lineHeight="1.8"
        fontFamily="mono"
        cursor="text"
        transition="all 0.2s"
        onClick={handleClick}
        as={motion.div}
        whileHover={{ borderColor: 'primary.300' }}
        position="relative"
      >
        <Box
          as={motion.div}
          layout
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {displayWords.map((word, index) => {
            const actualWordIndex = displayStartIndex + index;
            const isCurrentWord = actualWordIndex === currentWordIndex;
            
            return (
              <Box
                key={`word-${actualWordIndex}`}
                ref={isCurrentWord ? activeWordRef : null}
                display="inline-block"
              >
                <Word
                  word={word}
                  userInput={isCurrentWord ? userInput : completedWords[actualWordIndex] || ''}
                  isActive={isCurrentWord}
                  isCompleted={actualWordIndex < currentWordIndex}
                  caretStyle={caretStyle}
                />
              </Box>
            );
          })}
        </Box>
        
        {/* Fade gradient at bottom */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height="20px"
          bgGradient="linear(to-t, textArea, transparent)"
          pointerEvents="none"
        />
      </Box>
      
      {/* Hint text */}
      {!isActive && (
        <Text
          textAlign="center"
          mt={4}
          fontSize="sm"
          color="sub"
          fontFamily="mono"
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Click here or start typing to begin • Press Tab to restart
        </Text>
      )}
    </Box>
  );
};