import React from "react";
import { Spinner, Center } from "@chakra-ui/react";
import { MotionBox } from "../../atoms/MotionBox";
import { useAuth } from "../../../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  requireAuth = true,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center height="100vh" bg="bg">
        <MotionBox
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Spinner size="xl" color="caret" />
        </MotionBox>
      </Center>
    );
  }

  if (requireAuth && !user) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {fallback || null}
      </MotionBox>
    );
  }

  if (!requireAuth && user) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {fallback || null}
      </MotionBox>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </MotionBox>
  );
};
