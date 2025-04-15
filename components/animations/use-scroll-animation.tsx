'use client';

import { useEffect, useRef, useState } from 'react';

type UseScrollAnimationOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

/**
 * Custom hook that detects when an element enters the viewport
 * and triggers animations accordingly
 */
export function useScrollAnimation({
  threshold = 0.1,
  rootMargin = '0px',
  once = true,
}: UseScrollAnimationOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(currentRef);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
} 