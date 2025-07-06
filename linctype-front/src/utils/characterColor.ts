import { CaretStyle, CharacterState } from "../types/test";

const getCharacterColor = (
  state: CharacterState,
  colorMode: "light" | "dark"
): string => {
  switch (state) {
    case "correct":
      return colorMode === "light" ? "#059669" : "#34d399";
    case "incorrect":
      return colorMode === "light" ? "#dc2626" : "#f87171";
    case "pending":
    default:
      return colorMode === "light" ? "#9ca3af" : "#6b7280";
  }
};

const getCharacterBackground = (
  state: CharacterState,
  colorMode: "light" | "dark"
): string => {
  switch (state) {
    case "incorrect":
      return "transparent";
    case "current":
      return colorMode === "light" ? "#60a5fa" : "#3b82f6";
    default:
      return "transparent";
  }
};

const getCharacterOpacity = (state: CharacterState): number => {
  switch (state) {
    case "correct":
      return 1;
    case "incorrect":
      return 1;
    case "current":
      return 1;
    case "pending":
    default:
      return 0.4;
  }
};

const getCaretStyles = (caretStyle: CaretStyle, caretColor: string) => {
  const baseStyles = {
    position: "absolute" as const,
    left: "0",
    top: "0",
    pointerEvents: "none" as const,
    zIndex: 1,
  };

  switch (caretStyle) {
    case "line":
      return {
        ...baseStyles,
        width: "3px",
        height: "100%",
        backgroundColor: caretColor,
        left: "0",
      };
    case "block":
      return {
        ...baseStyles,
        width: "100%",
        height: "100%",
        backgroundColor: caretColor,
        opacity: 0.7,
        borderRadius: "2px",
      };
    case "outline":
      return {
        ...baseStyles,
        width: "100%",
        height: "100%",
        border: "2px solid",
        borderColor: caretColor,
        backgroundColor: "transparent",
        borderRadius: "2px",
      };
    case "underline":
      return {
        ...baseStyles,
        width: "100%",
        height: "3px",
        backgroundColor: caretColor,
        bottom: "0",
        top: "auto",
        borderRadius: "1px",
      };
    default:
      return {
        ...baseStyles,
        width: "3px",
        height: "100%",
        backgroundColor: caretColor,
        borderRadius: "1px",
      };
  }
};

export {
  getCharacterColor,
  getCharacterBackground,
  getCharacterOpacity,
  getCaretStyles,
};
