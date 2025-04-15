'use client';

import { motion, m } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useMotion } from './motion-context';

interface ScrollIndicatorProps {
  className?: string;
}

export function ScrollIndicator({ className = '' }: ScrollIndicatorProps) {
  const { prefersReducedMotion } = useMotion();
  
  // Skip animation if reduced motion is preferred
  if (prefersReducedMotion) {
    return (
      <div className={`hidden md:flex justify-center ${className}`}>
        <ChevronDown className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.3,
        repeat: Infinity,
        repeatDelay: 1,
      },
    },
  };

  const chevronVariants = {
    initial: { opacity: 0, y: -5 },
    animate: {
      opacity: [0, 1, 0],
      y: [0, 5, 10],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className={`hidden md:flex justify-center ${className}`}>
      <m.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center"
      >
        <m.div variants={chevronVariants}>
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </m.div>
        <m.div variants={chevronVariants} className="-mt-3">
          <ChevronDown className="h-5 w-5 text-muted-foreground/70" />
        </m.div>
        <m.div variants={chevronVariants} className="-mt-3">
          <ChevronDown className="h-5 w-5 text-muted-foreground/40" />
        </m.div>
      </m.div>
    </div>
  );
} 