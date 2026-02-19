'use client';

import { m } from 'framer-motion';
import { useScrollAnimation } from './use-scroll-animation';
import { useMotion } from './motion-context';
import { Badge } from '@/components/ui/badge';

export function NutritionCalculatorIllustration() {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.1,
    once: true,
  });

  const { prefersReducedMotion } = useMotion();

  const macros = [
    { label: 'Protein', grams: 185, color: 'var(--color-protein)' },
    { label: 'Carbs', grams: 280, color: 'var(--color-carbs)' },
    { label: 'Fat', grams: 82, color: 'var(--color-fat)' },
  ];

  const content = (
    <div className="w-full max-w-sm p-6 bg-card rounded-xl shadow-md border border-border">
      <div className="flex justify-center mb-3">
        <Badge variant="secondary" className="text-xs">Sample Results</Badge>
      </div>
      <div className="text-center mb-4">
        <div className="text-4xl font-heading font-bold text-foreground">2,450</div>
        <div className="text-sm text-muted-foreground">kcal / day</div>
      </div>
      <div className="space-y-2">
        {macros.map((macro) => (
          <div key={macro.label} className="flex items-center gap-3">
            <div
              className="h-2 rounded-full flex-1"
              style={{
                backgroundColor: macro.color,
                opacity: 0.8,
              }}
            />
            <span className="text-xs text-muted-foreground w-20 text-right">
              {macro.label} {macro.grams}g
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // For reduced motion preference
  if (prefersReducedMotion) {
    return (
      <div className="flex justify-center items-center py-8">
        {content}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-8" ref={ref as any}>
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {content}
      </m.div>
    </div>
  );
}
