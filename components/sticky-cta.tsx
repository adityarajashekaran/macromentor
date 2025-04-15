'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, m, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import type { MouseEvent } from 'react';

interface StickyCTAProps {
  text: string;
  scrollThreshold?: number;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function StickyCTA({ 
  text, 
  scrollThreshold = 500, 
  onClick 
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Show CTA after scrolling past the specified threshold
      setIsVisible(scrollY > scrollThreshold);
      
      // Show scroll-to-top button after scrolling down further
      setShowScrollTop(scrollY > scrollThreshold * 2); 
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div 
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {showScrollTop && (
            <m.button
              onClick={handleScrollToTop}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </m.button>
          )}

          <Button
            onClick={onClick}
            className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 dark:from-primary dark:to-blue-400 dark:hover:from-primary/90 dark:hover:to-blue-400/90 shadow-lg"
            size="lg"
          >
            {text}
          </Button>
        </m.div>
      )}
    </AnimatePresence>
  );
} 