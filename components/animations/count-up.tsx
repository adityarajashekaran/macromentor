'use client';

import { useEffect, useState } from 'react';
import { useScrollAnimation } from './use-scroll-animation';
import { useMotion } from './motion-context';

interface CountUpProps {
  end: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /**
   * Decimal places to show
   */
  decimals?: number;
}

export function CountUp({
  end,
  duration = 2,
  delay = 0,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.3,
    once: true,
  });
  const { prefersReducedMotion } = useMotion();

  useEffect(() => {
    // If reduced motion is preferred, skip the animation
    if (prefersReducedMotion) {
      setValue(end);
      return;
    }

    // Only start animation when element is visible
    if (!isVisible) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) {
        startTimestamp = timestamp + delay * 1000;
      }

      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setValue(Math.floor(progress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    };

    // Start the animation
    const animationId = window.requestAnimationFrame(step);

    // Clean up animation on unmount
    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [isVisible, end, duration, delay, prefersReducedMotion]);

  // Format the number with correct decimal places
  const formattedValue = decimals > 0 
    ? value.toFixed(decimals) 
    : value.toString();

  return (
    <span ref={ref as any} className={className}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
} 