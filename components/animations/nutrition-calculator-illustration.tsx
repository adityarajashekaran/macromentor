'use client';

import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from './use-scroll-animation';
import { useMotion } from './motion-context';

// Goals from the calculator with associated colors
const GOALS = [
  { 
    text: "Lose Fat", 
    bgColor: "bg-red-100 dark:bg-red-950/40", 
    textColor: "text-red-600 dark:text-red-300" 
  },
  { 
    text: "Build Lean Muscle", 
    bgColor: "bg-blue-100 dark:bg-blue-950/40", 
    textColor: "text-blue-600 dark:text-blue-300" 
  },
  { 
    text: "Maintain Weight", 
    bgColor: "bg-green-100 dark:bg-green-950/40", 
    textColor: "text-green-600 dark:text-green-300" 
  },
  { 
    text: "Clean Bulk", 
    bgColor: "bg-purple-100 dark:bg-purple-950/40", 
    textColor: "text-purple-600 dark:text-purple-300" 
  },
  { 
    text: "Improve Health", 
    bgColor: "bg-amber-100 dark:bg-amber-950/40", 
    textColor: "text-amber-600 dark:text-amber-300" 
  },
  { 
    text: "Body Recomposition", 
    bgColor: "bg-teal-100 dark:bg-teal-950/40", 
    textColor: "text-teal-600 dark:text-teal-300" 
  },
];

export function NutritionCalculatorIllustration() {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.1,
    once: true,
  });
  
  const { prefersReducedMotion } = useMotion();
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

  // Change goal every 4 seconds when visible
  useEffect(() => {
    if (!isVisible || prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setCurrentGoalIndex((prev) => (prev + 1) % GOALS.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isVisible, prefersReducedMotion]);

  // Base animation properties
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  // Text animation variants
  const textVariants = {
    initial: { 
      opacity: 0
    },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 1.0,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.8,
        ease: "easeIn"
      }
    }
  };

  // Box animation variants
  const boxVariants = {
    initial: { 
      opacity: 0
    },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 1.0,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.8,
        ease: "easeIn"
      }
    }
  };
  
  // For reduced motion preference
  if (prefersReducedMotion) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-full max-w-sm p-6 bg-card rounded-xl shadow-md border border-border">
          <h3 className="text-xl font-semibold text-center mb-4">Achieve your Goal</h3>
          <div className={`rounded-lg p-4 text-center ${GOALS[0].bgColor}`}>
            <p className={`text-lg font-medium ${GOALS[0].textColor}`}>
              {GOALS[0].text}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-8" ref={ref as any}>
      <m.div 
        className="w-full max-w-sm p-6 bg-card rounded-xl shadow-md border border-border"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <h3 className="text-xl font-semibold text-center mb-4">Achieve your Goal</h3>
        
        <div className="relative h-20 flex items-center justify-center rounded-lg overflow-hidden">
          <AnimatePresence mode="sync">
            <m.div
              key={currentGoalIndex}
              className={`absolute inset-0 ${GOALS[currentGoalIndex].bgColor}`}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={boxVariants}
            />
            <m.p
              key={`text-${currentGoalIndex}`}
              className={`text-xl font-medium text-center w-full ${GOALS[currentGoalIndex].textColor} absolute z-10`}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={textVariants}
            >
              {GOALS[currentGoalIndex].text}
            </m.p>
          </AnimatePresence>
        </div>
      </m.div>
    </div>
  );
} 