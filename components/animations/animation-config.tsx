'use client';

/**
 * Central configuration for animation parameters
 * Used to maintain visual consistency across animations
 */

// Base timing for animations (in seconds)
export const timings = {
  fast: 0.2,
  medium: 0.5,
  slow: 0.8,
  veryFast: 0.1,
  verySlow: 1.2,
};

// Standard easing functions
export const easings = {
  // Standard easings
  easeOut: [0.16, 1, 0.3, 1], // Custom ease with nice overshoot
  easeIn: [0.4, 0, 1, 0.2],
  easeInOut: [0.65, 0, 0.35, 1],
  
  // Spring-like
  spring: [0.34, 1.56, 0.64, 1], // Bouncy spring
  gentleSpring: [0.12, 1.23, 0.46, 0.94], // More subtle spring
};

// Delay patterns
export const delays = {
  stagger: 0.08, // Default stagger delay between children
  staggerFast: 0.05,
  staggerSlow: 0.12,
  initial: 0.1, // Initial delay before animation starts
};

// Animation variants for common animations
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: timings.medium,
      ease: easings.easeOut,
    },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: timings.medium,
      ease: easings.easeOut,
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: timings.medium,
      ease: easings.easeOut,
    },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: delays.stagger,
      delayChildren: delays.initial,
    },
  },
};

// Helper functions for creating custom animations
export function withDelay(variant: any, delay: number) {
  return {
    ...variant,
    visible: {
      ...variant.visible,
      transition: {
        ...variant.visible.transition,
        delay,
      },
    },
  };
}

export function withCustomDuration(variant: any, duration: number) {
  return {
    ...variant,
    visible: {
      ...variant.visible,
      transition: {
        ...variant.visible.transition,
        duration,
      },
    },
  };
} 