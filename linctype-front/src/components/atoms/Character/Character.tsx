import React from "react";
import { CharacterState, CaretStyle } from "../../../types/test";
import { Caret } from "../Caret/Caret";
import { MotionBox } from "../MotionBox";

interface CharacterProps {
  char: string;
  state: CharacterState;
  showCaret?: boolean;
  caretStyle?: CaretStyle;
}
const getCharacterColor = (state: CharacterState): string => {
  switch (state) {
    case "correct":
      return "correct";
    case "incorrect":
      return "incorrect";
    case "current":
      return "current";
    case "pending":
    default:
      return "pending";
  }
};

const getCharacterBackground = (state: CharacterState): string => {
  switch (state) {
    case "incorrect":
      return "red.500";
    default:
      return "transparent";
  }
};

export const Character: React.FC<CharacterProps> = ({
  char,
  state,
  showCaret = false,
  caretStyle = "line",
}) => {
  return (
    <MotionBox
      as="span"
      position="relative"
      fontFamily="mono"
      fontSize="inherit"
      lineHeight="inherit"
      color={getCharacterColor(state)}
      bg={getCharacterBackground(state)}
      borderRadius={state === "incorrect" ? "sm" : "none"}
      px={state === "incorrect" ? "1px" : "0"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ opacity: { duration: 0.125, ease: "easeOut" } }}
      whiteSpace="pre"
    >
      {char === " " ? "\u00A0" : char}
      {showCaret && <Caret style={caretStyle} />}
    </MotionBox>
  );
};
