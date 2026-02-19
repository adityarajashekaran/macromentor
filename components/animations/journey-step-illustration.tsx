'use client';

import { motion, m } from 'framer-motion';
import { useScrollAnimation } from './use-scroll-animation';
import { useMotion } from './motion-context';
import { Activity, Brain, CalendarClock } from 'lucide-react';

interface JourneyStepIllustrationProps {
  step: 1 | 2 | 3;
  title: string;
  description: string;
}

export function JourneyStepIllustration({
  step,
  title,
  description,
}: JourneyStepIllustrationProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.2,
    once: true,
  });
  
  const { prefersReducedMotion } = useMotion();

  // SVG variants for animation
  const circleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2 * step,
        ease: 'easeOut',
      },
    },
  };

  const numberVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.2 * step + 0.2,
        ease: 'easeOut',
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2 * step + 0.3,
        ease: 'easeOut',
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2 * step + 0.4,
        ease: 'easeOut',
      },
    },
  };

  // Icon based on step
  const StepIcon = 
    step === 1 ? Activity : 
    step === 2 ? CalendarClock : 
    Brain;

  // Static version for reduced motion
  if (prefersReducedMotion) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <div className="text-primary font-bold text-xl">{step}</div>
        </div>
        <div className="mt-2 text-center">
          <h3 className="font-medium text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref as any} className="flex flex-col items-center">
      <div className="relative h-32 w-32 mb-4">
        {/* Background circle */}
        <m.div
          className="absolute inset-0 flex items-center justify-center"
          variants={circleVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <m.div 
              variants={numberVariants}
              className="text-primary font-bold text-xl"
            >
              {step}
            </m.div>
          </div>
        </m.div>
        
        {/* Icon animation that appears from behind the number */}
        <m.div
          className="absolute inset-0 flex items-center justify-center"
          variants={iconVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <StepIcon 
            className="h-8 w-8 text-primary opacity-30 absolute"
            style={{ transform: 'translate(35px, -25px)' }} 
          />
        </m.div>
      </div>
      
      {/* Text content */}
      <m.div 
        className="text-center"
        variants={textVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <h3 className="font-medium text-lg mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </m.div>
      
      {/* Connection line - only for steps 1 & 2 */}
      {step < 3 && (
        <div className="hidden md:block absolute" style={{ left: '100%', top: '30%', width: '40px', height: '2px' }}>
          <m.div 
            className="h-full bg-primary/30"
            initial={{ scaleX: 0 }}
            animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.5 * step,
              ease: 'easeInOut'
            }}
            style={{ transformOrigin: 'left' }}
          />
        </div>
      )}
    </div>
  );
} 