/**
 * Color palette for predicted classes.
 */
export const palette = [
  '#811776',
  '#FFFF00',
  '#00FFFF',
  '#FF00FF',
  '#0000FF',
  '#FF8F20',
  '#AD2E24',
  '#470400',
  '#CFF000',
  '#A7D141',
  '#41D1B3',
  '#70E9FF',
  '#00ACED',
  '#BFD8BD',
  '#FF70E9',
  '#FF5C9A',
  '#BE408F',
  '#8670FF',
  '#333275',
];

/**
 * RGB color object
 */
export type RGB = { r: number; g: number; b: number };

/**
 * convert a hex color to RGB
 */
export function hexToRgb(hex: string | null | undefined): RGB {
  const fallback = { r: 0, g: 0, b: 0 };
  if (!hex) return fallback;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : fallback;
}

/**
 * Check if a color is dark color or not.
 * 
 * For example:
 * 
 * ```javascript
 * const textColor = isDark(someColor) ? 'white' : 'black';
 * ```
 */
export function isDark(rgb: string | null | undefined | RGB) {
  if (typeof rgb === 'string' || rgb === null || rgb === undefined) {
    rgb = hexToRgb(rgb);
  }
  const { r, g, b } = rgb;
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;
  return brightness < 150;
}