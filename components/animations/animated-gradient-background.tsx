'use client';

import { motion, m } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMotion } from './motion-context';

interface AnimatedGradientBackgroundProps {
  className?: string;
  children: React.ReactNode;
}

export function AnimatedGradientBackground({
  className = '',
  children,
}: AnimatedGradientBackgroundProps) {
  // Get reduced motion preference
  const { prefersReducedMotion } = useMotion();
  
  // If reduced motion is preferred, just use a static gradient
  if (prefersReducedMotion) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-blue-500/5">
        <div className={`relative z-10 ${className}`}>{children}</div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Single continuous animated gradient background */}
      <m.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-500/5"
        animate={{
          background: [
            'linear-gradient(to bottom right, var(--color-primary-rgb, 0, 112, 243) / 0.05, var(--color-background-rgb, 255, 255, 255) 50%, var(--color-blue-500-rgb, 59, 130, 246) / 0.05)',
            'linear-gradient(to top right, var(--color-blue-500-rgb, 59, 130, 246) / 0.05, var(--color-background-rgb, 255, 255, 255) 50%, var(--color-primary-rgb, 0, 112, 243) / 0.05)',
            'linear-gradient(to bottom left, var(--color-primary-rgb, 0, 112, 243) / 0.05, var(--color-background-rgb, 255, 255, 255) 50%, var(--color-blue-500-rgb, 59, 130, 246) / 0.1)',
            'linear-gradient(to top left, var(--color-blue-500-rgb, 59, 130, 246) / 0.1, var(--color-background-rgb, 255, 255, 255) 50%, var(--color-primary-rgb, 0, 112, 243) / 0.05)',
            'linear-gradient(to bottom right, var(--color-primary-rgb, 0, 112, 243) / 0.05, var(--color-background-rgb, 255, 255, 255) 50%, var(--color-blue-500-rgb, 59, 130, 246) / 0.05)',
          ],
        }}
        transition={{
          background: {
            duration: 30,
            times: [0, 0.25, 0.5, 0.75, 1],
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 0,
          },
        }}
        aria-hidden="true"
      />

      {/* Enhanced floating particles with more energy */}
      <div className="absolute inset-0 overflow-hidden">
        <EnhancedParticles />
      </div>

      {/* Content */}
      <div className={`relative z-10 ${className}`}>{children}</div>
    </div>
  );
}

// Enhanced particles component with more energy and continuous movement
function EnhancedParticles() {
  const { prefersReducedMotion } = useMotion();
  
  // If reduced motion is preferred, don't render particles
  if (prefersReducedMotion) {
    return null;
  }
  
  // Define particles with varied properties for more energetic animation
  const particles = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // Random x position (0-100%)
    y: Math.random() * 100, // Random y position (0-100%)
    size: Math.floor(Math.random() * 12) + 3, // Random size (3-15px)
    duration: Math.floor(Math.random() * 20) + 10, // Random animation duration (10-30s)
    delay: Math.random() * 15, // Varied delay (0-15s) for more natural movement
    opacity: (Math.random() * 0.15) + 0.1, // Random opacity (0.1-0.25)
  }));

  return (
    <>
      {particles.map((particle) => (
        <m.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: particle.id % 3 === 0 
              ? 'var(--color-protein)' 
              : particle.id % 3 === 1 
                ? 'var(--color-carbs)' 
                : 'var(--color-fat)',
            opacity: particle.opacity,
          }}
          animate={{
            x: [
              0,
              Math.random() * 150 - 75, 
              Math.random() * 150 - 75,
              Math.random() * 150 - 75,
              0
            ],
            y: [
              0,
              Math.random() * 150 - 75,
              Math.random() * 150 - 75,
              Math.random() * 150 - 75,
              0
            ],
            scale: [
              1,
              1 + Math.random() * 0.5,
              1 - Math.random() * 0.3,
              1 + Math.random() * 0.5,
              1
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
} 