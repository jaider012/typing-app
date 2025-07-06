import React from "react";
import {
  Box,
  Input,
  VStack,
  Text,
  Link,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { MotionBox } from "../../atoms/MotionBox";
import { ActionButton } from "../../atoms/ActionButton/ActionButton";
import { LoginFormData } from "../../../types/auth";
import { useLoginForm } from "../../../hooks/useLoginForm";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  onForgotPassword: (email: string) => void;
  onSwitchToSignUp: () => void;
  onGoogleSignIn: () => void;
  loading?: boolean;
  error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPassword,
  onSwitchToSignUp,
  onGoogleSignIn,
  loading = false,
  error,
}) => {
  const {
    formData,
    showPassword,
    errors,
    handleChange,
    handleSubmit,
    handleForgotPassword,
    togglePasswordVisibility,
  } = useLoginForm();

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        width: "71%",
      }}
    >
      <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
        <VStack gap={4}>
          {error && (
            <Box
              p={3}
              bg="#fecaca"
              color="#991b1b"
              borderRadius="md"
              border="1px solid #f87171"
              w="full"
            >
              <Text fontSize="sm">{error}</Text>
            </Box>
          )}

          <Box w="full">
            <Text
              fontFamily="mono"
              color="main"
              mb={2}
              fontSize="sm"
              fontWeight="medium"
            >
              Email
            </Text>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              disabled={loading}
              fontFamily="mono"
              bg="textArea"
              borderColor="border"
              _focus={{
                borderColor: "caret",
                boxShadow: "0 0 0 1px var(--chakra-colors-caret)",
              }}
            />
            {errors.email && (
              <Text color="#dc2626" fontSize="sm" mt={1}>
                {errors.email}
              </Text>
            )}
          </Box>

          <Box w="full">
            <Text
              fontFamily="mono"
              color="main"
              mb={2}
              fontSize="sm"
              fontWeight="medium"
            >
              Contraseña
            </Text>
            <HStack>
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Tu contraseña"
                disabled={loading}
                fontFamily="mono"
                bg="textArea"
                borderColor="border"
                _focus={{
                  borderColor: "caret",
                  boxShadow: "0 0 0 1px var(--chakra-colors-caret)",
                }}
                flex={1}
              />
              <IconButton
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                onClick={togglePasswordVisibility}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                {showPassword ? "noshow" : "show"}
              </IconButton>
            </HStack>
            {errors.password && (
              <Text color="#dc2626" fontSize="sm" mt={1}>
                {errors.password}
              </Text>
            )}
          </Box>

          <ActionButton
            type="submit"
            variant="solid"
            width="full"
            loading={loading}
            bg="caret"
            color="bg"
            _hover={{ bg: "primary.600" }}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </ActionButton>

          <ActionButton
            onClick={onGoogleSignIn}
            variant="outline"
            width="full"
            loading={loading}
            borderColor="border"
            color="main"
            _hover={{ bg: "card" }}
          >
            {loading ? "Conectando..." : "Continuar con Google"}
          </ActionButton>

          <VStack gap={2} align="center">
            <Link
              color="caret"
              fontSize="sm"
              onClick={() => handleForgotPassword(onForgotPassword)}
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
              fontFamily="mono"
            >
              ¿Olvidaste tu contraseña?
            </Link>

            <Text fontSize="sm" color="sub" fontFamily="mono">
              ¿No tienes cuenta?{" "}
              <Link
                color="caret"
                onClick={onSwitchToSignUp}
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
              >
                Crear cuenta
              </Link>
            </Text>
          </VStack>
        </VStack>
      </form>
    </MotionBox>
  );
};
