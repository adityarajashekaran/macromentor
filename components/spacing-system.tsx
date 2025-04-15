'use client';

import React from 'react';
import { semanticSpacing, spacing } from '@/theme/spacing';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Spacing component for maintaining consistent vertical and horizontal spacing
 * throughout the application.
 */

const spacingVariants = cva('', {
  variants: {
    size: {
      '0.5': 'h-0.5 w-0.5', // 2px
      '1': 'h-1 w-1',       // 4px
      '2': 'h-2 w-2',       // 8px
      '3': 'h-3 w-3',       // 12px
      '4': 'h-4 w-4',       // 16px
      '6': 'h-6 w-6',       // 24px
      '8': 'h-8 w-8',       // 32px
      '12': 'h-12 w-12',    // 48px
      '16': 'h-16 w-16',    // 64px
      '24': 'h-24 w-24',    // 96px
    },
    direction: {
      horizontal: 'h-0',
      vertical: 'w-0',
      both: '',
    },
  },
  defaultVariants: {
    size: '4',
    direction: 'both',
  },
});

export interface SpacingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spacingVariants> {}

/**
 * Spacer component for maintaining consistent spacing in layouts
 * 
 * @example
 * // Vertical spacing (gap) of medium size
 * <Spacer direction="vertical" size="4" />
 * 
 * // Horizontal spacing (gap) of small size
 * <Spacer direction="horizontal" size="2" />
 */
export function Spacer({
  className,
  size,
  direction,
  ...props
}: SpacingProps) {
  return (
    <div
      className={cn(spacingVariants({ size, direction }), className)}
      {...props}
      aria-hidden="true"
    />
  );
}

/**
 * Container component that applies consistent padding based on the spacing system
 * 
 * @example
 * <Container size="lg">
 *   <p>Content with standardized padding</p>
 * </Container>
 */
const containerVariants = cva('mx-auto', {
  variants: {
    size: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'w-full',
    },
    padding: {
      none: 'p-0',
      sm: 'p-2 sm:p-4',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
      xl: 'p-8 sm:p-12',
    },
  },
  defaultVariants: {
    size: 'lg',
    padding: 'md',
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  children: React.ReactNode;
}

export function Container({
  className,
  size,
  padding,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(containerVariants({ size, padding }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Section component that applies consistent margin and padding
 */
const sectionVariants = cva('', {
  variants: {
    spacing: {
      sm: 'py-6 sm:py-8',
      md: 'py-8 sm:py-12',
      lg: 'py-12 sm:py-16',
      xl: 'py-16 sm:py-24',
    },
    padding: {
      none: 'px-0',
      sm: 'px-2 sm:px-4',
      md: 'px-4 sm:px-6',
      lg: 'px-6 sm:px-8',
    },
  },
  defaultVariants: {
    spacing: 'md',
    padding: 'md',
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  children: React.ReactNode;
  as?: 'section' | 'div' | 'article';
}

export function Section({
  className,
  spacing,
  padding,
  children,
  as: Component = 'section',
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(sectionVariants({ spacing, padding }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Stack component that applies consistent vertical spacing between elements
 */
const stackVariants = cva('flex flex-col', {
  variants: {
    spacing: {
      '0': 'space-y-0',
      '1': 'space-y-1',
      '2': 'space-y-2',
      '3': 'space-y-3',
      '4': 'space-y-4',
      '6': 'space-y-6',
      '8': 'space-y-8',
      '12': 'space-y-12',
      '16': 'space-y-16',
    },
  },
  defaultVariants: {
    spacing: '4',
  },
});

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  children: React.ReactNode;
}

export function Stack({
  className,
  spacing,
  children,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(stackVariants({ spacing }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Horizontal stack component that applies consistent horizontal spacing between elements
 */
const rowVariants = cva('flex flex-row items-center', {
  variants: {
    spacing: {
      '0': 'space-x-0',
      '1': 'space-x-1',
      '2': 'space-x-2',
      '3': 'space-x-3',
      '4': 'space-x-4',
      '6': 'space-x-6',
      '8': 'space-x-8',
      '12': 'space-x-12',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      wrap: 'flex-wrap',
      nowrap: 'flex-nowrap',
    },
  },
  defaultVariants: {
    spacing: '4',
    align: 'center',
    justify: 'start',
    wrap: 'nowrap',
  },
});

export interface RowProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof rowVariants> {
  children: React.ReactNode;
}

export function Row({
  className,
  spacing,
  align,
  justify,
  wrap,
  children,
  ...props
}: RowProps) {
  return (
    <div
      className={cn(rowVariants({ spacing, align, justify, wrap }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Grid component that applies consistent spacing between grid items
 */
const gridVariants = cva('grid', {
  variants: {
    gap: {
      '0': 'gap-0',
      '1': 'gap-1',
      '2': 'gap-2',
      '3': 'gap-3',
      '4': 'gap-4',
      '6': 'gap-6',
      '8': 'gap-8',
      '12': 'gap-12',
    },
    cols: {
      '1': 'grid-cols-1',
      '2': 'grid-cols-1 sm:grid-cols-2',
      '3': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
      '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      '5': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
      '6': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
      '12': 'grid-cols-12',
    },
  },
  defaultVariants: {
    gap: '4',
    cols: '3',
  },
});

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  children: React.ReactNode;
}

export function Grid({
  className,
  gap,
  cols,
  children,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(gridVariants({ gap, cols }), className)}
      {...props}
    >
      {children}
    </div>
  );
} 