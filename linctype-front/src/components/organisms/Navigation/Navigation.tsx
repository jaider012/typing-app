import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Flex, HStack, Text, IconButton } from "@chakra-ui/react";
import { ActionButton, UserAvatar } from "../../atoms";
import { useColorMode } from "../../ui/color-mode";
import { AuthUser } from "../../../types/auth";

interface NavigationProps {
  user?: AuthUser;
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
  const location = useLocation();

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
          <Link to="/">
            <HStack gap={2} cursor="pointer" _hover={{ opacity: 0.8 }}>
              <Text fontSize="2xl" color="primary.400">⚡</Text>
              <Text fontSize="xl" fontWeight="bold" color="main" fontFamily="mono">
                linctype
              </Text>
            </HStack>
          </Link>
        </HStack>

        {/* Center Navigation */}
        <HStack gap={1}>
          <Link to="/">
            <ActionButton
              variant={location.pathname === "/" ? "solid" : "ghost"}
              size="sm"
              bg={location.pathname === "/" ? "caret" : "transparent"}
              color={location.pathname === "/" ? "bg" : "main"}
              _hover={{
                bg: location.pathname === "/" ? "primary.600" : "card",
              }}
            >
              Test
            </ActionButton>
          </Link>
          <Link to="/leaderboard">
            <ActionButton
              variant={location.pathname === "/leaderboard" ? "solid" : "ghost"}
              size="sm"
              bg={location.pathname === "/leaderboard" ? "caret" : "transparent"}
              color={location.pathname === "/leaderboard" ? "bg" : "main"}
              _hover={{
                bg: location.pathname === "/leaderboard" ? "primary.600" : "card",
              }}
            >
              Leaderboard
            </ActionButton>
          </Link>
          {user && (
            <Link to="/profile">
              <ActionButton
                variant={location.pathname === "/profile" ? "solid" : "ghost"}
                size="sm"
                bg={location.pathname === "/profile" ? "caret" : "transparent"}
                color={location.pathname === "/profile" ? "bg" : "main"}
                _hover={{
                  bg: location.pathname === "/profile" ? "primary.600" : "card",
                }}
              >
                Profile
              </ActionButton>
            </Link>
          )}
        </HStack>

        {/* Right side items */}
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
            <HStack gap={3}>
              <UserAvatar
                src={user.photoURL}
                name={user.displayName || user.email || "User"}
                size="sm"
              />
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
