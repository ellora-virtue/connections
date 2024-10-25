import { withDelay, withTiming } from 'react-native-reanimated';
import { Tile } from '../@types';

/**
 * @summary Animates the tile's background color progress
 * @description Animates between 0 (COLORS.surface.light) - 1 (COLORS.surface.dark) in components/Tile.tsx
 */
export const animateTileBgColorProgress = ({
  tile,
  newValue,
  duration,
  delay = 0,
}: {
  tile: Tile;
  newValue: number;
  duration: number;
  delay?: number;
}) => {
  const { backgroundColorProgress } = tile;
  backgroundColorProgress.value = withDelay(delay, withTiming(newValue, { duration }));
};
