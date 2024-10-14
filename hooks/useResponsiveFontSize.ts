const TILE_SIZES = {
  SMALL: 90,
  MEDIUM: 104,
};

const fontSizes = {
  SMALL: [
    { maxChars: 9, size: 10 },
    { maxChars: 8, size: 12 },
    { maxChars: 6, size: 14 },
    { maxChars: 0, size: 16 }, // default
  ],
  MEDIUM: [
    { maxChars: 9, size: 12 },
    { maxChars: 6, size: 14 },
    { maxChars: 0, size: 16 }, // default
  ],
  LARGE: [
    { maxChars: 9, size: 14 },
    { maxChars: 0, size: 16 }, // default
  ],
};

export const useResponsiveFontSize = ({ word, tileWidth }: { word: string; tileWidth: number }): number => {
  const characters = word.length;

  const getFontSize = (sizes: { maxChars: number; size: number }[]) =>
    sizes.find(({ maxChars }) => characters >= maxChars)?.size || 16;

  if (tileWidth < TILE_SIZES.SMALL) {
    return getFontSize(fontSizes.SMALL);
  }

  if (tileWidth < TILE_SIZES.MEDIUM) {
    return getFontSize(fontSizes.MEDIUM);
  }

  return getFontSize(fontSizes.LARGE);
};
