const TILE_SIZES = {
  small: 90,
  medium: 104,
};

const FONT_SIZES = {
  small: [
    { maxChars: 9, size: 10 },
    { maxChars: 8, size: 12 },
    { maxChars: 6, size: 14 },
    { maxChars: 0, size: 16 }, // default
  ],
  medium: [
    { maxChars: 9, size: 12 },
    { maxChars: 6, size: 14 },
    { maxChars: 0, size: 16 }, // default
  ],
  large: [
    { maxChars: 9, size: 14 },
    { maxChars: 0, size: 16 }, // default
  ],
};

export const useResponsiveFontSize = ({ word, tileWidth }: { word: string; tileWidth: number }): number => {
  const characters = word.length;

  const getFontSize = (sizes: { maxChars: number; size: number }[]) =>
    sizes.find(({ maxChars }) => characters >= maxChars)?.size || 16;

  if (tileWidth < TILE_SIZES.small) {
    return getFontSize(FONT_SIZES.small);
  }

  if (tileWidth < TILE_SIZES.medium) {
    return getFontSize(FONT_SIZES.medium);
  }

  return getFontSize(FONT_SIZES.large);
};
