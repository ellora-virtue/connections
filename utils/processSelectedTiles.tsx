import { Tile } from '../@types';

/**
 * @summary Processes selected tiles for comparison by extracting words, sorting alphabetically and stringifying array
 */
export const processSelectedTiles = ({ tiles }: { tiles: Map<string, Tile> }): string => {
  const sortedTileWordsArray = Array.from(tiles.values())
    .map((t) => t.word)
    .sort();

  return JSON.stringify(sortedTileWordsArray);
};
