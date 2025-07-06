import { useState } from "react";
import { SignUpFormData } from "../../../types/auth";

export const useSignUpForm = () => {
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

  const getPasswordStrengthLabel = (strength: number): string => {
    if (strength < 50) return "Débil";
    if (strength < 75) return "Media";
    return "Fuerte";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof SignUpFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (
    e: React.FormEvent,
    onSubmit: (data: SignUpFormData) => void
  ) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return {
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
  };
}; 