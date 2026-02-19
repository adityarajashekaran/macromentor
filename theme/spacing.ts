/**
 * Spacing System
 * This file defines spacing values for consistent layout spacing across the application
 */

// Base spacing unit (in rem)
const baseSpacing = 0.25; // 4px (assuming 1rem = 16px)

// Spacing scale (in rem)
export const spacing = {
  px: '1px',
  0: '0',
  0.5: `${baseSpacing * 0.5}rem`, // 2px
  1: `${baseSpacing}rem`,         // 4px
  1.5: `${baseSpacing * 1.5}rem`, // 6px
  2: `${baseSpacing * 2}rem`,     // 8px
  2.5: `${baseSpacing * 2.5}rem`, // 10px
  3: `${baseSpacing * 3}rem`,     // 12px
  3.5: `${baseSpacing * 3.5}rem`, // 14px
  4: `${baseSpacing * 4}rem`,     // 16px
  5: `${baseSpacing * 5}rem`,     // 20px
  6: `${baseSpacing * 6}rem`,     // 24px
  7: `${baseSpacing * 7}rem`,     // 28px
  8: `${baseSpacing * 8}rem`,     // 32px
  9: `${baseSpacing * 9}rem`,     // 36px
  10: `${baseSpacing * 10}rem`,   // 40px
  11: `${baseSpacing * 11}rem`,   // 44px
  12: `${baseSpacing * 12}rem`,   // 48px
  14: `${baseSpacing * 14}rem`,   // 56px
  16: `${baseSpacing * 16}rem`,   // 64px
  20: `${baseSpacing * 20}rem`,   // 80px
  24: `${baseSpacing * 24}rem`,   // 96px
  28: `${baseSpacing * 28}rem`,   // 112px
  32: `${baseSpacing * 32}rem`,   // 128px
  36: `${baseSpacing * 36}rem`,   // 144px
  40: `${baseSpacing * 40}rem`,   // 160px
  44: `${baseSpacing * 44}rem`,   // 176px
  48: `${baseSpacing * 48}rem`,   // 192px
  52: `${baseSpacing * 52}rem`,   // 208px
  56: `${baseSpacing * 56}rem`,   // 224px
  60: `${baseSpacing * 60}rem`,   // 240px
  64: `${baseSpacing * 64}rem`,   // 256px
  72: `${baseSpacing * 72}rem`,   // 288px
  80: `${baseSpacing * 80}rem`,   // 320px
  96: `${baseSpacing * 96}rem`,   // 384px
};

// Semantic spacing aliases
export const semanticSpacing = {
  // Component spacing
  buttonPadding: spacing[4],
  cardPadding: spacing[6],
  containerPadding: spacing[6],
  inputPadding: spacing[3],
  
  // Layout spacing
  sectionSpacing: spacing[16],
  sectionPaddingY: spacing[16],
  sectionPaddingX: spacing[6],
  
  // Element spacing
  elementsGap: spacing[4],
  elementsPaddingY: spacing[2],
  elementsPaddingX: spacing[4],
  
  // Form spacing
  formElementsGap: spacing[6],
  formGroupGap: spacing[3],
  
  // Mobile optimized spacing (can be used in media queries)
  mobileContainerPadding: spacing[4],
  mobileSectionPaddingY: spacing[10],
  mobileSectionPaddingX: spacing[4],
};

/**
 * Helper function to get spacing values by key
 * 
 * @example
 * // Returns the spacing value for key '4'
 * getSpacing(4) // => '1rem' (16px)
 */
export function getSpacing(key: keyof typeof spacing) {
  return spacing[key];
}

/**
 * Helper function to get semantic spacing values by key
 * 
 * @example
 * // Returns the semantic spacing value for 'cardPadding'
 * getSemanticSpacing('cardPadding') // => '1.5rem' (24px)
 */
export function getSemanticSpacing(key: keyof typeof semanticSpacing) {
  return semanticSpacing[key];
} 