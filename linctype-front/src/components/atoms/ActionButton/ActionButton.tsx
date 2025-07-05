import React, { ReactNode } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface ActionButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: ReactNode;
  loading?: boolean;
  children: ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  variant = 'primary', 
  icon, 
  loading, 
  children, 
  ...props 
}) => {
  return (
    <Button
      as={motion.button}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      leftIcon={icon}
      isLoading={loading}
      variant={variant}
      fontFamily="mono"
      borderRadius="md"
      transition="all 0.2s"
      {...props}
    >
      {children}
    </Button>
  );
};