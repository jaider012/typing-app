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
import { SignUpFormData } from "../../../types/auth";
import { useSignUpForm } from "../../../hooks/useSignUpForm";

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => void;
  onSwitchToLogin: () => void;
  onGoogleSignIn: () => void;
  loading?: boolean;
  error?: string | null;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  onSwitchToLogin,
  onGoogleSignIn,
  loading = false,
  error,
}) => {
  const {
    formData,
    showPassword,
    showConfirmPassword,
    errors,
    passwordStrength,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    getPasswordStrengthColor,
    getPasswordStrengthLabel,
  } = useSignUpForm();

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
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
                {showPassword ? "x" : "show"}
              </IconButton>
            </HStack>
            {formData.password && (
              <Box mt={2}>
                <Box
                  w="full"
                  h="6px"
                  bg="gray.200"
                  borderRadius="full"
                  overflow="hidden"
                >
                  <Box
                    h="full"
                    w={`${passwordStrength}%`}
                    bg={getPasswordStrengthColor(passwordStrength)}
                    transition="all 0.3s"
                  />
                </Box>
                <Text fontSize="xs" color="sub" mt={1} fontFamily="mono">
                  {getPasswordStrengthLabel(passwordStrength)}
                </Text>
              </Box>
            )}
            {errors.password && (
              <Text color="#dc2626" fontSize="sm" mt={1}>
                {errors.password}
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
              Confirmar Contraseña
            </Text>
            <HStack>
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirma tu contraseña"
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
                  showConfirmPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                onClick={toggleConfirmPasswordVisibility}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                {showConfirmPassword ? "noshow" : "show"}
              </IconButton>
            </HStack>
            {errors.confirmPassword && (
              <Text color="#dc2626" fontSize="sm" mt={1}>
                {errors.confirmPassword}
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
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
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

          <Text fontSize="sm" color="sub" fontFamily="mono">
            ¿Ya tienes cuenta?{" "}
            <Link
              color="caret"
              onClick={onSwitchToLogin}
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              Iniciar sesión
            </Link>
          </Text>
        </VStack>
      </form>
    </MotionBox>
  );
};
