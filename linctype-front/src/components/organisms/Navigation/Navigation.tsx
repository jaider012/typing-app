import React from "react";
import { Box, Flex, HStack, Text, IconButton } from "@chakra-ui/react";
import { ActionButton } from "../../atoms";
import { useColorMode } from "../../ui/color-mode";
import { User } from "../../../types/user";

interface NavigationProps {
  user?: User;
  onThemeToggle: () => void;
  onSettingsOpen: () => void;
  onAuthAction: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  user,
  onThemeToggle,
  onSettingsOpen,
  onAuthAction,
}) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      as="nav"
      w="full"
      py={4}
      px={6}
      borderBottom="1px solid"
      borderColor="border"
      bg="bg"
      position="sticky"
      top={0}
      zIndex={10}
      backdropFilter="blur(10px)"
    >
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        {/* Logo */}
        <HStack gap={2}>
          <Text fontSize="2xl" color="primary.400">⚡</Text>
          <Text fontSize="xl" fontWeight="bold" color="main" fontFamily="mono">
            linctype
          </Text>
        </HStack>

        {/* Navigation items */}
        <HStack gap={4}>
          <IconButton
            aria-label="Toggle theme"
            variant="ghost"
            onClick={onThemeToggle}
          >
            {colorMode === "light" ? "🌙" : "☀️"}
          </IconButton>

          <IconButton
            aria-label="Settings"
            variant="ghost"
            onClick={onSettingsOpen}
          >
            ⚙️
          </IconButton>

          {user ? (
            <HStack gap={2}>
              <Text fontSize="sm" fontFamily="mono" color="main">
                {user.displayName || user.email?.split("@")[0]}
              </Text>
              <ActionButton variant="ghost" onClick={onAuthAction} size="sm">
                Sign Out
              </ActionButton>
            </HStack>
          ) : (
            <ActionButton variant="solid" onClick={onAuthAction} size="sm">
              Sign In
            </ActionButton>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};
