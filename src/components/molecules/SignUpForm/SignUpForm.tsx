import React, { useState } from "react";
import {
  Box,
  Button,
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
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 50) return "#ef4444";
    if (strength < 75) return "#f59e0b";
    return "#10b981";
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof SignUpFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit}>
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
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                {showPassword ? "noshow" : "show"}
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
                  {passwordStrength < 50
                    ? "Débil"
                    : passwordStrength < 75
                    ? "Media"
                    : "Fuerte"}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
