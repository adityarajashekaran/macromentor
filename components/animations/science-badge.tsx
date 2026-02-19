'use client';

import { motion, m } from 'framer-motion';
import { useScrollAnimation } from './use-scroll-animation';
import { useMotion } from './motion-context';
import { FlaskConical, CheckCircle } from 'lucide-react';

interface ScienceBadgeProps {
  text?: string;
  className?: string;
}

export function ScienceBadge({
  text = 'Science-Backed Formulas',
  className = '',
}: ScienceBadgeProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.5,
    once: true,
  });
  const { prefersReducedMotion } = useMotion();

  // If reduced motion is preferred, show a static badge
  if (prefersReducedMotion) {
    return (
      <div className={`inline-flex items-center rounded-full bg-primary/10 dark:bg-primary/20 px-2 py-0.5 text-xs ${className}`}>
        <FlaskConical className="mr-1 h-3.5 w-3.5 text-primary" />
        <span className="text-primary font-medium">{text}</span>
      </div>
    );
  }

  // Animation variants
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      }
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, rotate: -45 },
    visible: { 
      opacity: 1, 
      rotate: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: 'easeOut',
      }
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        delay: 0.3,
        ease: 'easeOut',
      }
    },
  };

  const checkVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        delay: 0.4,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 200,
      }
    },
  };

  return (
    <m.div
      ref={ref as any}
      className={`relative inline-flex items-center rounded-full bg-primary/10 dark:bg-primary/20 px-2 py-0.5 text-xs ${className}`}
      variants={badgeVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <m.div variants={iconVariants} className="flex items-center">
        <FlaskConical className="mr-1 h-3.5 w-3.5 text-primary" />
      </m.div>
      
      <m.span 
        className="text-primary font-medium"
        variants={textVariants}
      >
        {text}
      </m.span>
      
      <m.div 
        className="ml-1 flex items-center" 
        variants={checkVariants}
      >
        <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
      </m.div>
    </m.div>
  );
} 