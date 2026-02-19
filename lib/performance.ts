/**
 * Performance Monitoring Utilities
 * 
 * This module provides utilities for monitoring and optimizing 
 * client-side performance, especially focused on animations.
 */

// Animation Performance Monitoring
export type PerformanceMetric = {
  name: string;
  startTime: number;
  duration?: number;
  fps?: number[];
  avgFps?: number;
}

/**
 * Monitors performance metrics for animations
 */
export class AnimationPerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private frameCounters: Map<string, {count: number, lastTimestamp: number}> = new Map();
  
  // Start tracking an animation
  public startTracking(name: string): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      fps: []
    });
    
    this.frameCounters.set(name, {
      count: 0,
      lastTimestamp: performance.now()
    });
    
    this.trackFrameRate(name);
  }
  
  // End tracking and finalize metrics
  public endTracking(name: string): PerformanceMetric | undefined {
    const metric = this.metrics.get(name);
    if (!metric) return undefined;
    
    metric.duration = performance.now() - metric.startTime;
    
    // Calculate average FPS if we have frame data
    if (metric.fps && metric.fps.length > 0) {
      metric.avgFps = metric.fps.reduce((sum, fps) => sum + fps, 0) / metric.fps.length;
    }
    
    // Clear the frame tracking
    this.frameCounters.delete(name);
    
    return metric;
  }
  
  // Track animation frame rate
  private trackFrameRate(name: string): void {
    const frameCounter = this.frameCounters.get(name);
    const metric = this.metrics.get(name);
    
    if (!frameCounter || !metric) return;
    
    // Increment frame count
    frameCounter.count++;
    
    // Every 500ms, calculate and store the FPS
    const now = performance.now();
    const elapsed = now - frameCounter.lastTimestamp;
    
    if (elapsed >= 500) {
      const fps = (frameCounter.count / elapsed) * 1000;
      metric.fps?.push(Math.round(fps));
      
      // Reset counter
      frameCounter.count = 0;
      frameCounter.lastTimestamp = now;
    }
    
    // Continue tracking frames
    if (this.frameCounters.has(name)) {
      requestAnimationFrame(() => this.trackFrameRate(name));
    }
  }
  
  // Get all performance metrics
  public getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }
  
  // Check if performance is problematic
  public hasPerformanceIssue(name: string): boolean {
    const metric = this.metrics.get(name);
    if (!metric || !metric.avgFps) return false;
    
    // Consider anything below 30 FPS problematic
    return metric.avgFps < 30;
  }
}

// Create a singleton instance
const monitor = typeof window !== 'undefined' ? new AnimationPerformanceMonitor() : null;

/**
 * Gets the animation performance monitor instance
 * Returns null if running on server
 */
export const getAnimationPerformanceMonitor = (): AnimationPerformanceMonitor | null => {
  return monitor;
};

/**
 * Detects if the user has requested reduced motion
 * Returns true if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Detects if the device is likely to have performance issues with animations
 * This is a simple heuristic based on device memory and processor cores
 */
export const hasLimitedPerformance = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for device memory API (Chrome/Edge only)
  const memory = (navigator as any).deviceMemory;
  if (memory && memory < 4) return true;
  
  // Check for hardware concurrency (number of logical processors)
  const cores = navigator.hardwareConcurrency;
  if (cores && cores < 4) return true;
  
  // Check if it's a mobile device (simplistic check)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return isMobile;
};

/**
 * Updates performance configuration based on device capabilities
 * Returns configuration object for animations and other performance settings
 */
export const getPerformanceConfig = () => {
  const reducedMotion = prefersReducedMotion();
  const limitedPerformance = hasLimitedPerformance();
  
  return {
    enableAnimations: !reducedMotion,
    useHighPerformanceMode: !limitedPerformance && !reducedMotion,
    preferReducedMotion: reducedMotion,
    animationComplexity: limitedPerformance ? 'low' : reducedMotion ? 'minimal' : 'full',
    optimizeSVGRendering: limitedPerformance || reducedMotion
  };
}; 