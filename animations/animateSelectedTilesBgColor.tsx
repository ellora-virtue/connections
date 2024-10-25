import { Tile } from '../@types';
import { animateTileBgColorProgress } from './animateTileBgColorProgress';

/**
 * @summary Animates the selected tiles' background color progress
 * @description Animates between 0 (COLORS.surface.light) - 1 (COLORS.surface.dark) in components/Tile.tsx
 */
export const animateSelectedTilesBgColor = ({
  selectedTiles,
  unguessedTiles,
  newValue,
  duration,
  delay = 0,
}: {
  selectedTiles: Map<string, Tile>;
  unguessedTiles: Map<string, Tile>;
  newValue: number;
  duration: number;
  delay?: number;
}) => {
  selectedTiles.forEach((tile) => {
    const unguessedTile = unguessedTiles.get(tile.word);

    if (unguessedTile != null) {
      animateTileBgColorProgress({ tile: unguessedTile, newValue, duration, delay });
    }
  });
};
