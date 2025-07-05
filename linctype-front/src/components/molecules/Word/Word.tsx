import React from "react";
import { Character, MotionBox } from "../../atoms";
import { CharacterState, CaretStyle } from "../../../types/test";

interface WordProps {
  word: string;
  userInput: string;
  isActive: boolean;
  isCompleted: boolean;
  caretStyle: CaretStyle;
}

export const Word: React.FC<WordProps> = ({
  word,
  userInput,
  isActive,
  isCompleted,
  caretStyle,
}) => {
  const getCharacterState = (index: number): CharacterState => {
    if (!isActive && !isCompleted) return "pending";
    if (index < userInput.length) {
      return userInput[index] === word[index] ? "correct" : "incorrect";
    }
    if (isActive && index === userInput.length) return "current";
    return "pending";
  };

  return (
    <MotionBox
      as="span"
      display="inline-block"
      mr={4}
      mb={2}
      px={isActive ? 2 : 0}
      py={isActive ? 1 : 0}
      bg={isActive ? "wordActive" : "transparent"}
      borderRadius="sm"
      animate={{
        backgroundColor: isActive
          ? "var(--chakra-colors-wordActive)"
          : "transparent",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {word.split("").map((char, index) => (
        <Character
          key={`${word}-${index}`}
          char={char}
          state={getCharacterState(index)}
          showCaret={isActive && index === userInput.length}
          caretStyle={caretStyle}
        />
      ))}
      {/* Show caret at end of word if user has typed the entire word */}
      {isActive && userInput.length === word.length && (
        <Character
          char=" "
          state="current"
          showCaret={true}
          caretStyle={caretStyle}
        />
      )}
    </MotionBox>
  );
};
