'use client';

import { motion, m } from 'framer-motion';
import { useScrollAnimation } from './use-scroll-animation';
import { Card, CardContent } from '@/components/ui/card';
import { useMotion } from './motion-context';
import type React from 'react';

interface AnimatedFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

export function AnimatedFeatureCard({
  icon,
  title,
  description,
  index,
}: AnimatedFeatureCardProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.1,
    once: true,
  });
  
  const { prefersReducedMotion } = useMotion();
  
  // Static render if reduced motion is preferred
  if (prefersReducedMotion) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="mb-4">{icon}</div>
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    );
  }
  
  // Animation variants
  const cardVariants = {
    hidden: { 
      y: 50,
      opacity: 0
    },
    visible: { 
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1], // Nice ease out
        delay: index * 0.1, // Stagger based on index
      }
    }
  };
  
  const iconVariants = {
    hidden: { 
      scale: 0.8,
      opacity: 0 
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        delay: 0.1 + index * 0.1,
        ease: "easeOut"
      }
    }
  };
  
  const textVariants = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.2 + index * 0.1, 
        ease: "easeOut"
      }
    }
  };
  
  return (
    <m.div
      ref={ref as any}
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover={{ 
        y: -5,
        transition: { 
          duration: 0.2,
          ease: "easeOut"
        } 
      }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden bg-card/80 backdrop-blur-[2px] hover:bg-card/100 transition-colors">
        <CardContent className="p-6">
          <m.div
            variants={iconVariants}
            className="mb-4"
          >
            {icon}
          </m.div>
          
          <m.div variants={textVariants}>
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </m.div>
        </CardContent>
      </Card>
    </m.div>
  );
} 