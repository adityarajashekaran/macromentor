'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Spacing component for maintaining consistent vertical and horizontal spacing
 * throughout the application.
 */

const spacingVariants = cva('', {
  variants: {
    size: {
      xs: 'h-2 w-2', // 8px
      sm: 'h-4 w-4', // 16px
      md: 'h-6 w-6', // 24px
      lg: 'h-8 w-8', // 32px
      xl: 'h-12 w-12', // 48px
      '2xl': 'h-16 w-16', // 64px
      '3xl': 'h-24 w-24', // 96px
    },
    direction: {
      horizontal: 'h-0',
      vertical: 'w-0',
      both: '',
    },
  },
  defaultVariants: {
    size: 'md',
    direction: 'both',
  },
});

export interface SpacingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spacingVariants> {}

/**
 * Spacing component for maintaining consistent spacing in layouts
 * 
 * @example
 * // Vertical spacing (gap) of medium size
 * <Spacing direction="vertical" size="md" />
 * 
 * // Horizontal spacing (gap) of small size
 * <Spacing direction="horizontal" size="sm" />
 */
export function Spacing({
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
 * <SpacedContainer padding="lg">
 *   <p>Content with standardized padding</p>
 * </SpacedContainer>
 */
export interface SpacedContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export function SpacedContainer({
  className,
  padding = 'md',
  children,
  ...props
}: SpacedContainerProps) {
  const paddingClasses = {
    xs: 'p-2', // 8px
    sm: 'p-4', // 16px
    md: 'p-6', // 24px
    lg: 'p-8', // 32px
    xl: 'p-12', // 48px
  };

  return (
    <div
      className={cn(paddingClasses[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Grid component that applies consistent spacing between grid items
 */
export interface SpacedGridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  columns?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}

export function SpacedGrid({
  className,
  gap = 'md',
  columns = 3,
  children,
  ...props
}: SpacedGridProps) {
  const gapClasses = {
    xs: 'gap-2', // 8px
    sm: 'gap-4', // 16px
    md: 'gap-6', // 24px
    lg: 'gap-8', // 32px
    xl: 'gap-12', // 48px
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div
      className={cn(
        'grid',
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Stack component that applies consistent vertical spacing between elements
 */
export interface VStackProps
  extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export function VStack({
  className,
  spacing = 'md',
  children,
  ...props
}: VStackProps) {
  const spacingClasses = {
    xs: 'space-y-2', // 8px
    sm: 'space-y-4', // 16px
    md: 'space-y-6', // 24px
    lg: 'space-y-8', // 32px
    xl: 'space-y-12', // 48px
  };

  return (
    <div
      className={cn('flex flex-col', spacingClasses[spacing], className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Horizontal stack component that applies consistent horizontal spacing between elements
 */
export interface HStackProps
  extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export function HStack({
  className,
  spacing = 'md',
  children,
  ...props
}: HStackProps) {
  const spacingClasses = {
    xs: 'space-x-2', // 8px
    sm: 'space-x-4', // 16px
    md: 'space-x-6', // 24px
    lg: 'space-x-8', // 32px
    xl: 'space-x-12', // 48px
  };

  return (
    <div
      className={cn('flex flex-row items-center', spacingClasses[spacing], className)}
      {...props}
    >
      {children}
    </div>
  );
} 