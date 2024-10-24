import shuffle from 'lodash/shuffle';
import { createContext, Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  makeMutable,
  runOnJS,
  SharedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { MistakesRemaining, Tile, TileSlot } from '../@types';
import { GAME_DATA } from '../data/gameData';
import { useRequiredContext } from '../hooks';
import { processSelectedTiles, validateGuess } from '../utils';

const TOTAL_HORIZONTAL_PADDING = 16;
const TOTAL_TILES_PADDING = 24;
const NUMBER_OF_TILES = 4;

// Animation constants
const TILE_BG_ANIMATION_IN_MS = 200;
const SHUFFLE_ANIMATION_IN_MS = 250;
const SUBMIT_VERTICAL_OFFSET = -10;
const SUBMIT_ANIMATION_IN_MS = 150;
const SUBMIT_ANIMATION_DELAY_IN_MS = 100;

export type ConnectionsContextValue = {
  tileWidth: number;
  tileTextOpacity: SharedValue<number>;

  unguessedTiles: Map<string, Tile>;
  setUnguessedTiles: Dispatch<SetStateAction<Map<string, Tile>>>;

  selectedTiles: Map<Tile['word'], Tile>;
  handleTilePress: (tile: Tile) => void;

  mistakesRemaining: MistakesRemaining;

  shuffleUnguessedTiles: () => void;

  handleDeselectAll: () => void;

  handleSubmit: () => void;
};

export const ConnectionsContext = createContext<ConnectionsContextValue | null>(null);

export const useConnectionsContext = () => useRequiredContext(ConnectionsContext);

export const useProvideConnectionsState = (): ConnectionsContextValue => {
  const { width: screenWidth } = useWindowDimensions();
  const tileWidth = (screenWidth - TOTAL_HORIZONTAL_PADDING - TOTAL_TILES_PADDING) / NUMBER_OF_TILES;
  const tileTextOpacity = useSharedValue(1);

  const [unguessedTiles, setUnguessedTiles] = useState<Map<Tile['word'], Tile>>(() => {
    const processedData = shuffle(
      GAME_DATA.flatMap(({ words, category, difficulty }) =>
        words.map((word) => ({
          word,
          category,
          difficulty,
          backgroundColorProgress: makeMutable(0),
          offsetX: makeMutable(0),
          offsetY: makeMutable(0),
        })),
      ),
    );

    return new Map(processedData.map((tile, index) => [tile.word, { ...tile, slot: index as TileSlot }]));
  });

  // Incorrect guesses stored as alphabetised, stringified arrays for easy look-up
  const [incorrectGuesses, setIncorrectGuesses] = useState<Set<string>>(new Set());

  const [selectedTiles, setSelectedTiles] = useState<Map<Tile['word'], Tile>>(new Map());
  const mistakesRemaining: MistakesRemaining = useMemo(
    () => Array.from({ length: 4 }, () => ({ scale: makeMutable(1), opacity: makeMutable(1) })),
    [],
  );

  const handleTilePress = (tile: Tile) => {
    const { word, backgroundColorProgress } = tile;

    const isSelected = selectedTiles.has(word);

    if (isSelected) {
      // Tile is already selected - remove from selectedTiles map
      backgroundColorProgress.value = withTiming(0, { duration: TILE_BG_ANIMATION_IN_MS });

      return setSelectedTiles((prev) => {
        const modifiedTiles = new Map(prev);
        modifiedTiles.delete(word);
        return modifiedTiles;
      });
    }

    // There are already 4 selected tiles - do nothing
    if (selectedTiles.size >= 4) return;

    // Tile is unselected - add to selectedTiles map
    backgroundColorProgress.value = withTiming(1, { duration: TILE_BG_ANIMATION_IN_MS });

    return setSelectedTiles((prev) => {
      const modifiedTiles = new Map(prev);
      modifiedTiles.set(word, tile);

      return new Map(
        Array.from(modifiedTiles.entries()).sort(([_keyA, a], [_keyB, b]) => (a.slot ?? 0) - (b.slot ?? 0)),
      );
    });
  };

  /**
   * @summary Animates the selected tiles' background color progress
   * @description Animates between 0 (COLORS.surface.light) - 1 (COLORS.surface.dark) in components/Tile.tsx
   */
  const animateSelectedTilesBgColor = ({
    newValue,
    duration,
    delay = 0,
  }: {
    newValue: number;
    duration: number;
    delay?: number;
  }) => {
    selectedTiles.forEach((tile) => {
      const unguessedTile = unguessedTiles.get(tile.word);

      if (unguessedTile != null) {
        unguessedTile.backgroundColorProgress.value = withDelay(delay, withTiming(newValue, { duration }));
      }
    });
  };

  // TODO: Still a very slight jump in animation when selected tiles change positions. Come back to this?
  const shuffleUnguessedTiles = () => {
    animateSelectedTilesBgColor({ newValue: 0, duration: SHUFFLE_ANIMATION_IN_MS });
    tileTextOpacity.value = withTiming(0, { duration: SHUFFLE_ANIMATION_IN_MS }, (isFinished) => {
      if (isFinished === true) runOnJS(handleShuffleTiles)();
    });
  };

  const handleShuffleTiles = () => {
    setUnguessedTiles((prev) => {
      const newTilesArray = shuffle(Array.from(prev.values()));
      const newUnguessedTiles = new Map(
        newTilesArray.map((tile, index) => [
          tile.word,
          {
            ...tile,
            slot: index as TileSlot,
          },
        ]),
      );

      // Update selectedTiles based on the new slots
      setSelectedTiles((selected) => {
        const updatedSelectedTiles = new Map(
          Array.from(selected.entries()).map(([word, tile]) => {
            const updatedTile = newUnguessedTiles.get(word);
            return [word, { ...tile, slot: updatedTile?.slot ?? tile.slot }];
          }),
        );

        return new Map(
          // TODO: Extract sort function
          Array.from(updatedSelectedTiles.entries()).sort(([_keyA, a], [_keyB, b]) => (a.slot ?? 0) - (b.slot ?? 0)),
        );
      });

      return newUnguessedTiles;
    });

    // Animations
    animateSelectedTilesBgColor({ newValue: 1, duration: SHUFFLE_ANIMATION_IN_MS });
    tileTextOpacity.value = withTiming(1, { duration: SHUFFLE_ANIMATION_IN_MS });
  };

  const handleDeselectAll = () => {
    animateSelectedTilesBgColor({ newValue: 0, duration: SHUFFLE_ANIMATION_IN_MS });
    setSelectedTiles(new Map());
  };

  /**
   * @summary Wave animation - tiles move up and down once each (staggered)
   * @description Always happens when guess is submitted, regardless of if it's correct or incorrect
   * @description 600ms
   */
  const animateSubmit = () => {
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

  /**
   * @summary Animates the last mistakes remaining dot
   * @description Dot first becomes 20% larger, before shrinking to 0%. Simultaneously, color of dot animates to 50% opacity
   * @description 600ms
   */
  const animateMistakesRemaining = () => {
    const filteredDots = mistakesRemaining.filter((item) => item.scale.value === 1);
    const lastDot = filteredDots[filteredDots.length - 1];

    // Animations
    if (lastDot != null) {
      lastDot.scale.value = withSequence(withTiming(1.2), withTiming(0));
      lastDot.opacity.value = withTiming(0.5);
    }
  };

  /**
   * @summary Shake animation - tiles move side to side 4 times simultaneously
   * @description Happens when guess is incorrect
   * @description 300ms
   */
  const animateIncorrectGuessShake = ({ callback }: { callback: () => void }) => {
    const OFFSET = 4;
    const DURATION = 100;

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

  const handleIncorrectGuess = ({ isOneAway }: { isOneAway: boolean }) => {
    // Animations
    animateSelectedTilesBgColor({ newValue: 0.8, duration: 0 });
    animateIncorrectGuessShake({
      callback: () => animateSelectedTilesBgColor({ newValue: 1, duration: 0, delay: 500 }),
    });

    const processedIncorrectGuess = processSelectedTiles({ tiles: selectedTiles });
    const isAlreadyGuessed = incorrectGuesses.has(processedIncorrectGuess);

    if (mistakesRemaining.every((item) => item.scale.value === 0)) {
      Toast.show({ text1: 'Next time' });
      // TODO: handle no guesses left case (reveal answers)
    } else if (isAlreadyGuessed) {
      Toast.show({ text1: 'Already guessed!' });
    } else if (isOneAway) {
      Toast.show({ text1: 'One away...' });
    }

    if (!isAlreadyGuessed) {
      animateMistakesRemaining();
    }

    setIncorrectGuesses((prev) => {
      const modifiedSet = new Set(prev);
      modifiedSet.add(processedIncorrectGuess);
      return modifiedSet;
    });
  };

  const handleSubmit = () => {
    const { matchingCategory, isOneAway } = validateGuess({
      data: GAME_DATA,
      selectedTiles: Array.from(selectedTiles.values()).map((tile) => tile.word),
    });

    animateSubmit();

    if (matchingCategory == null) {
      // Incorrect guess

      // TODO: figure out nicer way of delaying this animation set
      setTimeout(() => {
        handleIncorrectGuess({ isOneAway });
      }, 1000); // 600ms + 400ms additional delay
    } else {
      // Correct guess
    }

    // Correct guess:
    // - Move tiles into highest available row (swap non-guessed tiles in top row with guessed ones)
    // - Category reveal animation
  };

  return {
    tileWidth,
    tileTextOpacity,
    unguessedTiles,
    setUnguessedTiles,
    selectedTiles,
    handleTilePress,
    mistakesRemaining,
    shuffleUnguessedTiles,
    handleDeselectAll,
    handleSubmit,
  };
};
