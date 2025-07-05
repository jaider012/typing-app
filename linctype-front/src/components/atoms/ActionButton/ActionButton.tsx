import React, { ReactNode } from "react";
import { Button, ButtonProps, ConditionalValue } from "@chakra-ui/react";
import { MotionBox } from "../MotionBox";

interface ActionButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: ConditionalValue<
    "ghost" | "outline" | "solid" | "subtle" | "surface" | "plain" | undefined
  >;
  icon?: ReactNode;
  loading?: boolean;
  children: ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = "solid",
  icon,
  loading,
  children,
  ...props
}) => {
  return (
    <MotionBox
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      display="inline-block"
    >
      <Button
        variant={
          variant as ConditionalValue<
            | "ghost"
            | "outline"
            | "solid"
            | "subtle"
            | "surface"
            | "plain"
            | undefined
          >
        }
        loading={loading}
        fontFamily="mono"
        borderRadius="md"
        {...props}
      >
        {icon && <span style={{ marginRight: "8px" }}>{icon}</span>}
        {children}
      </Button>
    </MotionBox>
  );
};
