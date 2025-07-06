import { Box, BoxProps, Button, ButtonProps, Text, TextProps } from "@chakra-ui/react";
import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

// Crear los componentes motion base
const ChakraMotionBox = motion(Box);
const ChakraMotionButton = motion(Button);
const ChakraMotionText = motion(Text);

// Combinar los tipos de Chakra UI y Framer Motion
type MotionBoxProps = BoxProps & HTMLMotionProps<"div">;
type MotionButtonProps = ButtonProps & HTMLMotionProps<"button">;
type MotionTextProps = TextProps & HTMLMotionProps<"p">;

// Componente MotionBox reutilizable
export const MotionBox = forwardRef<HTMLDivElement, MotionBoxProps>(
  (props, ref) => {
    return <ChakraMotionBox ref={ref} {...props} />;
  }
);

// Componente MotionButton reutilizable
export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  (props, ref) => {
    return <ChakraMotionButton ref={ref} {...props} />;
  }
);

// Componente MotionText reutilizable
export const MotionText = forwardRef<HTMLParagraphElement, MotionTextProps>(
  (props, ref) => {
    return <ChakraMotionText ref={ref} {...props} />;
  }
);

MotionBox.displayName = "MotionBox";
MotionButton.displayName = "MotionButton";
MotionText.displayName = "MotionText";

// Variantes de animación comunes
export const motionVariants = {
  // Animaciones de entrada
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  
  // Animaciones de hover
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
  
  // Animación de parpadeo (para el cursor)
  blink: {
    animate: { opacity: [1, 0, 1] },
    transition: {
      opacity: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  
  // Animaciones de carga
  pulse: {
    animate: { scale: [1, 1.05, 1] },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  
  spin: {
    animate: { rotate: 360 },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Transiciones comunes
export const motionTransitions = {
  smooth: { duration: 0.3, ease: "easeInOut" },
  fast: { duration: 0.15, ease: "easeOut" },
  slow: { duration: 0.6, ease: "easeInOut" },
  bounce: { type: "spring", damping: 10, stiffness: 100 },
  elastic: { type: "spring", damping: 8, stiffness: 200 },
}; 