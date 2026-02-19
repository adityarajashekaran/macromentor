'use client';

import { motion, m } from 'framer-motion';
import { useMotion } from './motion-context';

interface AnimatedTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  className?: string;
  staggerChildren?: boolean;
  delay?: number;
}

export function AnimatedText({
  text,
  as = 'p',
  className = '',
  staggerChildren = false,
  delay = 0,
}: AnimatedTextProps) {
  const { prefersReducedMotion } = useMotion();
  
  // If reduced motion is preferred, render without animation
  if (prefersReducedMotion) {
    const Component = as;
    return <Component className={className}>{text}</Component>;
  }
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerChildren ? 0.05 : 0,
        delayChildren: delay,
      },
    },
  };
  
  const childVariants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };
  
  const Component = as;
  
  if (staggerChildren) {
    // Split text into words for staggered animation
    const words = text.split(' ');
    
    return (
      <Component className={className}>
        <m.span
          style={{ display: 'inline-block' }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, index) => (
            <m.span
              key={index}
              style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.2em' }}
              variants={childVariants}
            >
              {word}{' '}
            </m.span>
          ))}
        </m.span>
      </Component>
    );
  }
  
  // Animate the whole text as a single unit
  return (
    <Component className={className}>
      <m.span
        variants={childVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay }}
        style={{ display: 'inline-block' }}
      >
        {text}
      </m.span>
    </Component>
  );
} 