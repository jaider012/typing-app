import React from "react";
import { CharacterState, CaretStyle } from "../../../types/test";
import { Caret } from "../Caret/Caret";
import { MotionBox } from "../MotionBox";
import { useColorMode } from "../../ui/color-mode";
import {
  getCharacterColor,
  getCharacterBackground,
  getCharacterOpacity,
} from "../../../utils/characterColor";

interface CharacterProps {
  char: string;
  state: CharacterState;
  showCaret?: boolean;
  caretStyle?: CaretStyle;
}

export const Character: React.FC<CharacterProps> = ({
  char,
  state,
  showCaret = false,
  caretStyle = "line",
}) => {
  const { colorMode } = useColorMode();
  return (
    <MotionBox
      as="span"
      position="relative"
      fontFamily="mono"
      fontSize="inherit"
      lineHeight="inherit"
      color={getCharacterColor(state, colorMode)}
      bg={getCharacterBackground(state, colorMode)}
      opacity={getCharacterOpacity(state)}
      px={state === "incorrect" || state === "current" ? "2px" : "0"}
      py={state === "current" ? "1px" : "0"}
      initial={{ opacity: getCharacterOpacity(state) }}
      animate={{
        opacity: getCharacterOpacity(state),
        backgroundColor: getCharacterBackground(state, colorMode),
        color: getCharacterColor(state, colorMode),
      }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      whiteSpace="pre"
      fontWeight={state === "current" ? "bold" : "normal"}
    >
      {char === " " ? "\u00A0" : char}
      {/* {showCaret && <Caret style={caretStyle} />} */}
    </MotionBox>
  );
};
