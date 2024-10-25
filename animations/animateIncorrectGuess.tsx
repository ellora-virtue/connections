import { runOnJS, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { Tile } from '../@types';

const OFFSET = 4;
const DURATION = 100;

/**
 * @summary Shake animation - tiles quickly move side to side 4 times simultaneously
 * @description Occurs when guess is incorrect
 * @description 300ms
 */
export const animateIncorrectGuess = ({
  selectedTiles,
  unguessedTiles,
  callback,
}: {
  selectedTiles: Map<string, Tile>;
  unguessedTiles: Map<string, Tile>;
  callback: () => void;
}) => {
  Array.from(selectedTiles.values()).forEach((t) => {
    const tile = unguessedTiles.get(t.word);

    if (tile == null || tile.offsetX == null) return;

    tile.offsetX.value = withSequence(
      withTiming(-OFFSET, { duration: DURATION / 2 }),
      withRepeat(withTiming(OFFSET, { duration: DURATION }), 2, true),
      withTiming(0, { duration: DURATION / 2 }, (isFinished) => {
        if (isFinished === true) runOnJS(callback)();
      }),
    );
  });
};
