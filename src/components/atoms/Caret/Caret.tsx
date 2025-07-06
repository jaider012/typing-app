import React from "react";
import { CaretStyle } from "../../../types/test";
import { MotionBox } from "../MotionBox";
import { useColorModeValue } from "../../ui/color-mode";
import { getCaretStyles } from "../../../utils/characterColor";

interface CaretProps {
  style: CaretStyle;
  smooth?: boolean;
}

export const Caret: React.FC<CaretProps> = ({ style, smooth = true }) => {
  const caretColor = useColorModeValue("blue.400", "blue.600");
  const caretStyles = getCaretStyles(style, caretColor);
  return (
    <MotionBox
      {...caretStyles}
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{
        opacity: {
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    />
  );
};
