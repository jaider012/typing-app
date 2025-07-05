import React from "react";
import { Character, MotionBox } from "../../atoms";
import { CharacterState, CaretStyle } from "../../../types/test";
import { useColorModeValue } from "../../ui/color-mode";

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
  // Color mode values
  const activeBg = useColorModeValue("gray.100", "gray.800");
  const activeBorder = useColorModeValue("gray.300", "gray.600");
  
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
      px={isActive ? 1 : 0}
      py={isActive ? 0.5 : 0}
      bg={isActive ? activeBg : "transparent"}
      borderRadius="md"
      border={isActive ? "1px solid" : "none"}
      borderColor={isActive ? activeBorder : "transparent"}
      animate={{
        backgroundColor: isActive ? activeBg : "transparent",
        borderColor: isActive ? activeBorder : "transparent",
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
