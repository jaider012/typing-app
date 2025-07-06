import { useState, useCallback } from "react";
import { TestMode } from "../types/test";

// Hook especializado para la configuración del test
export const useTestConfiguration = () => {
  const [testTime, setTestTime] = useState(60);
  const [testMode, setTestMode] = useState<TestMode>("time");

  const updateTestTime = useCallback((newTime: number) => {
    setTestTime(newTime);
  }, []);

  const updateTestMode = useCallback((newMode: TestMode) => {
    setTestMode(newMode);
  }, []);

  const resetToDefaults = useCallback(() => {
    setTestTime(60);
    setTestMode("time");
  }, []);

  return {
    testTime,
    testMode,
    setTestTime: updateTestTime,
    setTestMode: updateTestMode,
    resetToDefaults,
  };
}; 