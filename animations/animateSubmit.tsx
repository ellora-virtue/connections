import { withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import { Tile } from '../@types';

const SUBMIT_VERTICAL_OFFSET = -10;
const SUBMIT_ANIMATION_IN_MS = 150;
const SUBMIT_ANIMATION_DELAY_IN_MS = 100;

/**
 * @summary Wave animation - tiles move up and down once each (staggered)
 * @description Always occurs when guess is submitted, regardless of if it's correct or incorrect
 * @description 600ms
 */
export const animateSubmit = ({
  selectedTiles,
  unguessedTiles,
}: {
  selectedTiles: Map<string, Tile>;
  unguessedTiles: Map<string, Tile>;
}) => {
  Array.from(selectedTiles.values()).forEach((t, index) => {
    const tile = unguessedTiles.get(t.word);

    if (tile == null || tile.offsetY == null) return;

    const delay = index * SUBMIT_ANIMATION_DELAY_IN_MS;
    tile.offsetY.value = withDelay(
      delay,
      withRepeat(withTiming(SUBMIT_VERTICAL_OFFSET, { duration: SUBMIT_ANIMATION_IN_MS }), 2, true),
    );
  });
};
