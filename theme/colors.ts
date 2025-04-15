/**
 * Color System
 * This file defines color values for consistent styling across the application
 */

// Base color palette
export const palette = {
  // Primary colors
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  // Secondary colors
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  
  // Success colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  // Warning colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  // Error colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  // Additional colors
  black: '#000000',
  white: '#ffffff',
  transparent: 'transparent',
};

// Semantic color mapping
export const semanticColors = {
  // Text colors
  text: {
    primary: palette.neutral[900],
    secondary: palette.neutral[700],
    tertiary: palette.neutral[500],
    disabled: palette.neutral[400],
    inverse: palette.white,
    link: palette.primary[600],
    linkHover: palette.primary[700],
    success: palette.success[700],
    warning: palette.warning[700],
    error: palette.error[700],
  },
  
  // Background colors
  background: {
    default: palette.white,
    paper: palette.neutral[50],
    subtle: palette.neutral[100],
    inverse: palette.neutral[900],
    success: palette.success[50],
    warning: palette.warning[50],
    error: palette.error[50],
  },
  
  // Border colors
  border: {
    default: palette.neutral[200],
    strong: palette.neutral[400],
    focus: palette.primary[500],
    success: palette.success[300],
    warning: palette.warning[300],
    error: palette.error[300],
  },
  
  // Button colors
  button: {
    primaryBg: palette.primary[600],
    primaryHoverBg: palette.primary[700],
    primaryText: palette.white,
    
    secondaryBg: palette.secondary[600],
    secondaryHoverBg: palette.secondary[700],
    secondaryText: palette.white,
    
    tertiaryBg: palette.neutral[100],
    tertiaryHoverBg: palette.neutral[200],
    tertiaryText: palette.neutral[900],
  },
  
  // Form element colors
  form: {
    inputBg: palette.white,
    inputBorder: palette.neutral[300],
    inputFocusBorder: palette.primary[500],
    inputText: palette.neutral[900],
    inputPlaceholder: palette.neutral[400],
    
    checkboxBg: palette.white,
    checkboxBorder: palette.neutral[300],
    checkboxCheckedBg: palette.primary[600],
    
    errorText: palette.error[600],
    errorBorder: palette.error[300],
    errorBg: palette.error[50],
  },
};

/**
 * Helper function to get a specific color from the palette
 * 
 * @example
 * // Returns the primary color at shade 600
 * getColor('primary', 600) // => '#16a34a'
 */
export function getColor(
  colorName: keyof typeof palette, 
  shade?: keyof typeof palette.primary | null
): string {
  const color = palette[colorName];
  
  // If color is a shade object and a shade is provided, return that shade
  if (typeof color !== 'string' && shade) {
    return color[shade];
  }
  
  // If color is a string or no shade was provided for an object
  return typeof color === 'string' ? color : color[500]; // Default to 500 shade
}

/**
 * Helper function to get a semantic color
 * 
 * @example
 * // Returns the primary text color
 * getSemanticColor('text', 'primary') // => '#171717'
 */
export function getSemanticColor(
  category: keyof typeof semanticColors,
  colorName: string
): string {
  return semanticColors[category][colorName as keyof typeof semanticColors[typeof category]];
} 