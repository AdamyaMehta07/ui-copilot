import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ui_copilot_usage';
const DAILY_LIMIT = 5;

export function useDailyLimit() {
  const [remaining, setRemaining] = useState(DAILY_LIMIT);
  const [canGenerate, setCanGenerate] = useState(true);
  const [resetTime, setResetTime] = useState(null);

  // Check and reset daily limit
  const checkAndReset = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();
    const now = new Date();
    
    // Calculate next reset time (tomorrow at midnight)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    setResetTime(tomorrow);
    
    if (stored) {
      const { date, usage } = JSON.parse(stored);
      if (date === today) {
        const remainingCount = DAILY_LIMIT - usage;
        setRemaining(remainingCount);
        setCanGenerate(usage < DAILY_LIMIT);
      } else {
        // Reset for new day
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          date: today,
          usage: 0
        }));
        setRemaining(DAILY_LIMIT);
        setCanGenerate(true);
      }
    } else {
      // First time user
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        date: today,
        usage: 0
      }));
      setRemaining(DAILY_LIMIT);
      setCanGenerate(true);
    }
  }, []);

  useEffect(() => {
    checkAndReset();
    // Check every hour for date change
    const interval = setInterval(checkAndReset, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkAndReset]);

  // Increment usage count
  const incrementUsage = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();
    
    if (stored) {
      const { date, usage } = JSON.parse(stored);
      if (date === today && usage < DAILY_LIMIT) {
        const newUsage = usage + 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          date: today,
          usage: newUsage
        }));
        setRemaining(DAILY_LIMIT - newUsage);
        setCanGenerate(newUsage < DAILY_LIMIT);
        return true;
      }
    }
    return false;
  }, []);

  return { remaining, canGenerate, incrementUsage, resetTime };
}