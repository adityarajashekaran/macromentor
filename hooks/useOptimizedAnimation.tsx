'use client';

import { useState, useEffect } from 'react';
import { prefersReducedMotion, getAnimationPerformanceMonitor, getPerformanceConfig } from '@/lib/performance';
import dynamic from 'next/dynamic';

// Dynamically import Framer Motion with code splitting
const LazyMotion = dynamic(() => import('framer-motion').then(mod => mod.LazyMotion), {
  ssr: false,
  loading: () => null,
});

const DynamicAnimatePresence = dynamic(() => import('framer-motion').then(mod => mod.AnimatePresence), {
  ssr: false,
  loading: () => null,
});

// Dynamically import domAnimation feature from Framer Motion
const loadFeatures = () => import('framer-motion').then(mod => mod.domAnimation);

/**
 * Custom hook for optimized animations
 * 
 * Features:
 * - Code splitting for Framer Motion
 * - Respects user's reduced motion preferences
 * - Performance monitoring
 * - Dynamic feature loading
 */
export function useOptimizedAnimation() {
  // Track if animations are ready
  const [isReady, setIsReady] = useState(false);
  
  // Get performance configuration
  const config = getPerformanceConfig();
  
  // Get the performance monitor
  const performanceMonitor = getAnimationPerformanceMonitor();
  
  useEffect(() => {
    // Mark as ready after first render
    setIsReady(true);
    
    // Start tracking overall animation performance
    if (performanceMonitor) {
      performanceMonitor.startTracking('page-animations');
      
      // Clean up tracking when component unmounts
      return () => {
        performanceMonitor.endTracking('page-animations');
      };
    }
  }, []);
  
  /**
   * Wrap components with LazyMotion for code splitting
   */
  const OptimizedAnimationProvider = ({ children }: { children: React.ReactNode }) => {
    if (!isReady || !config.enableAnimations) {
      // Return children without animation if not ready or animations disabled
      return <>{children}</>;
    }
    
    return (
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    );
  };
  
  /**
   * Optimized AnimatePresence component
   */
  const OptimizedAnimatePresence = ({ 
    children, 
    ...props 
  }: React.ComponentProps<typeof DynamicAnimatePresence>) => {
    if (!isReady || !config.enableAnimations) {
      return <>{children}</>;
    }
    
    return <DynamicAnimatePresence {...props}>{children}</DynamicAnimatePresence>;
  };
  
  /**
   * Track performance of a specific animation
   */
  const trackAnimation = (name: string) => {
    if (!performanceMonitor) return {
      start: () => {},
      end: () => {},
    };
    
    return {
      start: () => performanceMonitor.startTracking(name),
      end: () => performanceMonitor.endTracking(name),
    };
  };
  
  /**
   * Generate optimized variants based on performance config
   */
  const getOptimizedVariants = (variants: any, animationType: 'entrance' | 'exit' | 'hover' = 'entrance') => {
    if (!config.enableAnimations) {
      // Return instant variants with no animation
      return {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      };
    }
    
    if (config.animationComplexity === 'minimal') {
      // Minimal animations just use opacity
      return {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { duration: 0.3 }
        },
        exit: { 
          opacity: 0,
          transition: { duration: 0.2 }
        }
      };
    }
    
    if (config.animationComplexity === 'low') {
      // Simpler animations with reduced properties
      const simplifiedVariants = { ...variants };
      
      // Remove complex transform properties
      if (simplifiedVariants.hidden?.rotate) delete simplifiedVariants.hidden.rotate;
      if (simplifiedVariants.hidden?.scale) delete simplifiedVariants.hidden.scale;
      if (simplifiedVariants.visible?.rotate) delete simplifiedVariants.visible.rotate;
      if (simplifiedVariants.visible?.scale) delete simplifiedVariants.visible.scale;
      
      // Simplify transitions
      if (simplifiedVariants.visible?.transition) {
        simplifiedVariants.visible.transition = { 
          duration: 0.4,
          ease: 'easeOut'
        };
      }
      
      return simplifiedVariants;
    }
    
    // Return full animations
    return variants;
  };
  
  return {
    isReady,
    OptimizedAnimationProvider,
    OptimizedAnimatePresence,
    trackAnimation,
    getOptimizedVariants,
    prefersReducedMotion: config.preferReducedMotion,
    performanceConfig: config,
  };
} 