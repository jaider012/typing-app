import React, { ReactNode } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  color = 'main', 
  icon, 
  size = 'md' 
}) => {
  const sizes = {
    sm: { p: 3, fontSize: 'sm', valueSize: 'lg' },
    md: { p: 4, fontSize: 'md', valueSize: 'xl' },
    lg: { p: 6, fontSize: 'lg', valueSize: '2xl' }
  };

  return (
    <Box
      as={motion.div}
      bg="card"
      borderRadius="md"
      textAlign="center"
      border="1px solid"
      borderColor="border"
      whileHover={{ scale: 1.02 }}
      transition="all 0.2s"
      {...sizes[size]}
    >
      {icon && (
        <Box mb={2} color={color} fontSize="xl">
          {icon}
        </Box>
      )}
      <Text 
        fontSize={sizes[size].valueSize} 
        fontWeight="bold" 
        color={color}
        fontFamily="mono"
      >
        {value}
      </Text>
      <Text 
        fontSize={sizes[size].fontSize} 
        color="sub" 
        mt={1}
        fontFamily="mono"
      >
        {label}
      </Text>
    </Box>
  );
};