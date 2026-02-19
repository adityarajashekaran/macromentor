'use client';

import { m } from 'framer-motion';
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
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-gradient-end/5">
        <div className={`relative z-10 ${className}`}>{children}</div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Single continuous animated gradient background */}
      <m.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-gradient-end/5"
        animate={{
          background: [
            'linear-gradient(to bottom right, hsl(var(--primary) / 0.05), hsl(var(--background)) 50%, hsl(var(--gradient-end) / 0.05))',
            'linear-gradient(to top right, hsl(var(--gradient-end) / 0.05), hsl(var(--background)) 50%, hsl(var(--primary) / 0.05))',
            'linear-gradient(to bottom left, hsl(var(--primary) / 0.05), hsl(var(--background)) 50%, hsl(var(--gradient-end) / 0.1))',
            'linear-gradient(to top left, hsl(var(--gradient-end) / 0.1), hsl(var(--background)) 50%, hsl(var(--primary) / 0.05))',
            'linear-gradient(to bottom right, hsl(var(--primary) / 0.05), hsl(var(--background)) 50%, hsl(var(--gradient-end) / 0.05))',
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

      {/* Subtle blurred gradient shapes */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-end/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className={`relative z-10 ${className}`}>{children}</div>
    </div>
  );
}
