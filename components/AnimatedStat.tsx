'use client';

import React, { useState, useEffect } from 'react';

interface AnimatedStatProps {
  value: number;
  duration?: number; // Animation duration in milliseconds
}

/**
 * AnimatedStat displays a count-up transition from 0 to the target value.
 * Resolves Next.js / React 19 hydration mismatch by displaying a skeleton pulse during SSR/initial hydration.
 */
export const AnimatedStat: React.FC<AnimatedStatProps> = ({ value, duration = 1000 }) => {
  const [mounted, setMounted] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  // Set mount flag on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Run the count-up animation once mounted
  useEffect(() => {
    if (!mounted) return;
    if (value <= 0) {
      setDisplayValue(0);
      return;
    }

    let startTime: number | null = null;
    const startVal = 0;
    const endVal = value;

    const runAnimation = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // cubic ease-out to slow down near the end
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOutCubic * (endVal - startVal) + startVal);
      
      setDisplayValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(runAnimation);
      } else {
        setDisplayValue(endVal);
      }
    };

    const animFrame = requestAnimationFrame(runAnimation);
    return () => cancelAnimationFrame(animFrame);
  }, [value, duration, mounted]);

  // Display skeleton loader during server rendering to prevent hydration errors
  if (!mounted) {
    return (
      <span className="inline-block w-8 h-5 bg-white/10 rounded animate-pulse align-middle" />
    );
  }

  return <span>{displayValue}</span>;
};
