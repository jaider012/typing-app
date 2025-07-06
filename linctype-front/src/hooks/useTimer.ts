import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export const useTimer = (initialTime: number) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const initialTimeRef = useRef(initialTime);

  // Actualizar la referencia cuando cambie initialTime
  useEffect(() => {
    initialTimeRef.current = initialTime;
    if (!isActive) {
      setTimeLeft(initialTime);
    }
  }, [initialTime, isActive]);

  const start = useCallback(() => {
    setIsActive(true);
    startTimeRef.current = Date.now();
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback((newTime?: number) => {
    const resetTime = newTime ?? initialTimeRef.current;
    setIsActive(false);
    setTimeLeft(resetTime);
    startTimeRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isActive && startTimeRef.current) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current!) / 1000);
        const newTimeLeft = Math.max(0, initialTimeRef.current - elapsed);
        
        setTimeLeft(prevTime => {
          // Solo actualizar si realmente cambió
          if (prevTime !== newTimeLeft) {
            if (newTimeLeft === 0) {
              setIsActive(false);
            }
            return newTimeLeft;
          }
          return prevTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive]);

  // Memoizar valores calculados para evitar re-renders innecesarios
  const memoizedValues = useMemo(() => ({
    isCompleted: timeLeft === 0,
  }), [timeLeft]);

  // Memoizar funciones para evitar re-creación
  const memoizedActions = useMemo(() => ({
    start,
    pause,
    reset,
  }), [start, pause, reset]);

  return {
    timeLeft,
    isActive,
    ...memoizedValues,
    ...memoizedActions,
  };
};