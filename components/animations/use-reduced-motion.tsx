'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook that detects if the user has requested reduced motion
 * This helps make animations accessible
 */
export function useReducedMotion() {
  // Default to not reducing motion if we can't detect preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for the prefers-reduced-motion media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set the initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Create an event listener that updates our state when the preference changes
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add the event listener
    mediaQuery.addEventListener('change', handleMediaChange);
    
    // Clean up the event listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  return prefersReducedMotion;
}