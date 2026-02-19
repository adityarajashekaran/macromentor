/**
 * SVG Optimization Utilities
 * 
 * This module provides utilities for optimizing SVG rendering and performance
 */
import * as React from 'react';

export type SVGOptimizationOptions = {
  // Whether to use reduced complexity for SVGs on limited devices
  reduceComplexity: boolean;
  
  // Whether to disable animations within SVGs
  disableAnimations: boolean;
  
  // Whether to use simplified paths (reduced number of points)
  useSimplifiedPaths: boolean;
  
  // Whether to progressively load complex SVGs
  enableProgressiveLoading: boolean;
  
  // Forces SVG rendering to be deferred until needed (lazy loading)
  deferRendering: boolean;
}

/**
 * Default optimization options
 */
export const defaultSVGOptimizationOptions: SVGOptimizationOptions = {
  reduceComplexity: false,
  disableAnimations: false,
  useSimplifiedPaths: false,
  enableProgressiveLoading: true,
  deferRendering: false,
}

/**
 * Gets SVG optimization options based on device capabilities
 */
export function getSVGOptimizationOptions(
  isLowPowerDevice: boolean = false, 
  prefersReducedMotion: boolean = false
): SVGOptimizationOptions {
  return {
    reduceComplexity: isLowPowerDevice,
    disableAnimations: prefersReducedMotion,
    useSimplifiedPaths: isLowPowerDevice,
    enableProgressiveLoading: true,
    deferRendering: isLowPowerDevice,
  };
}

/**
 * Simplifies an SVG path by reducing the number of points
 * This is useful for improving rendering performance on low-end devices
 * 
 * @param pathData The original path data string (d attribute)
 * @param tolerance How much simplification to apply (higher = more reduction)
 * @returns Simplified path data
 */
export function simplifySVGPath(pathData: string, tolerance: number = 1): string {
  if (tolerance <= 0) return pathData;
  
  // Simple implementation - in a real-world scenario, you would use
  // an actual path simplification algorithm like Ramer-Douglas-Peucker
  
  // For now, this is a naive approach that just removes every Nth command
  // based on the tolerance level
  const parts = pathData.split(/(?=[MmLlHhVvCcSsQqTtAaZz])/);
  
  if (parts.length < 10) return pathData; // Don't simplify very simple paths
  
  const skipFactor = Math.max(1, Math.floor(tolerance));
  
  // Keep first move command and essential structure
  const simplified = [parts[0]]; // Always keep the initial move command
  
  for (let i = 1; i < parts.length; i++) {
    const command = parts[i][0]; // First character is the command
    
    // Always keep Z (closePath), M (moveTo), and essential curve commands like C
    if (command === 'Z' || command === 'z' || command === 'M' || command === 'm') {
      simplified.push(parts[i]);
    } 
    // For line commands (L, l, H, h, V, v), apply simplification
    else if (['L', 'l', 'H', 'h', 'V', 'v'].includes(command)) {
      if (i % skipFactor === 0) {
        simplified.push(parts[i]);
      }
    }
    // For curve commands, reduce less aggressively
    else {
      if (i % Math.max(1, Math.floor(skipFactor / 2)) === 0) {
        simplified.push(parts[i]);
      }
    }
  }
  
  return simplified.join('');
}

/**
 * Optimize SVG props for rendering performance
 * 
 * @param options Optimization options
 * @returns Props to spread onto an SVG element
 */
export function getOptimizedSVGProps(options: Partial<SVGOptimizationOptions> = {}): React.SVGAttributes<SVGElement> {
  const mergedOptions = { ...defaultSVGOptimizationOptions, ...options };
  
  const styleObj: Record<string, string> = {};
  if (mergedOptions.disableAnimations) {
    styleObj['--animation-duration'] = '0s';
  }
  
  return {
    // Shape rendering optimization
    shapeRendering: mergedOptions.reduceComplexity ? 'optimizeSpeed' : 'geometricPrecision',
    
    // Text rendering optimization
    textRendering: mergedOptions.reduceComplexity ? 'optimizeSpeed' : 'optimizeLegibility',
    
    // Disable animations if requested
    style: styleObj,
    
    // Performance attributes
    vectorEffect: mergedOptions.reduceComplexity ? 'non-scaling-stroke' : undefined,
    
    // Progressive loading attributes
    ...(mergedOptions.enableProgressiveLoading ? {
      'data-progressive-loading': 'true',
    } : {}),
    
    // Ensure proper scaling
    preserveAspectRatio: 'xMidYMid meet',
  };
}

/**
 * HOC to optimize an SVG component
 * 
 * @param Component The SVG component to optimize
 * @param options Optimization options
 * @returns Optimized SVG component
 */
export function optimizeSVGComponent<P extends React.SVGAttributes<SVGElement>>(
  Component: React.ComponentType<P>,
  options: Partial<SVGOptimizationOptions> = {}
): React.FC<P> {
  return (props: P) => {
    const svgProps = getOptimizedSVGProps(options);
    
    // Combine the optimization props with the component's existing props
    const combinedProps = {
      ...props,
      ...svgProps,
    } as P;
    
    return React.createElement(Component, combinedProps);
  };
} 