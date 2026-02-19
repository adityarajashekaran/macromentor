'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useReducedMotion } from './use-reduced-motion';

interface MotionContextType {
  prefersReducedMotion: boolean;
}

// Create context with default values
const MotionContext = createContext<MotionContextType>({ 
  prefersReducedMotion: false 
});

// Custom hook to use the motion context
export const useMotion = () => useContext(MotionContext);

interface MotionProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps your app and makes motion preferences
 * available to any child component that calls useMotion().
 */
export function MotionProvider({ children }: MotionProviderProps) {
  const prefersReducedMotion = useReducedMotion();
  
  // The value that will be given to the context
  const value = {
    prefersReducedMotion,
  };
  
  return (
    <MotionContext.Provider value={value}>
      {children}
    </MotionContext.Provider>
  );
} 