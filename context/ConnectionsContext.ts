import shuffle from 'lodash/shuffle';
import { createContext, Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { makeMutable, runOnJS, SharedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { MistakesRemaining, Tile, TileSlot } from '../@types';
import {
  animateIncorrectGuess,
  animateMistakesRemaining,
  animateSelectedTilesBgColor,
  animateSubmit,
  animateTileBgColorProgress,
} from '../animations';
import { GAME_DATA } from '../data/gameData';
import { useRequiredContext } from '../hooks';
import { processSelectedTiles, validateGuess } from '../utils';

const TOTAL_HORIZONTAL_PADDING = 16;
const TOTAL_TILES_PADDING = 24;
const NUMBER_OF_TILES = 4;

// Animation constants
const TILE_BG_ANIMATION_IN_MS = 200;
const SHUFFLE_ANIMATION_IN_MS = 250;

export type ConnectionsContextValue = {
  tileWidth: number;
  tileTextOpacity: SharedValue<number>;

  unguessedTiles: Map<Tile['word'], Tile>;
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
    const { word } = tile;
    const isSelected = selectedTiles.has(word);

    if (isSelected) {
      // Tile is already selected - remove from selectedTiles map
      animateTileBgColorProgress({ tile, newValue: 0, duration: TILE_BG_ANIMATION_IN_MS });

      return setSelectedTiles((prev) => {
        const modifiedTiles = new Map(prev);
        modifiedTiles.delete(word);
        return modifiedTiles;
      });
    }

    // There are already 4 selected tiles - do nothing
    if (selectedTiles.size >= 4) return;

    // Tile is unselected - add to selectedTiles map
    animateTileBgColorProgress({ tile, newValue: 1, duration: TILE_BG_ANIMATION_IN_MS });

    return setSelectedTiles((prev) => {
      const modifiedTiles = new Map(prev);
      modifiedTiles.set(word, tile);

      return new Map(
        Array.from(modifiedTiles.entries()).sort(([_keyA, a], [_keyB, b]) => (a.slot ?? 0) - (b.slot ?? 0)),
      );
    });
  };

  const shuffleUnguessedTiles = () => {
    // TODO: Still a very slight jump in animation when selected tiles change positions. Come back to this?
    animateSelectedTilesBgColor({ selectedTiles, unguessedTiles, newValue: 0, duration: SHUFFLE_ANIMATION_IN_MS });
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
    animateSelectedTilesBgColor({ selectedTiles, unguessedTiles, newValue: 1, duration: SHUFFLE_ANIMATION_IN_MS });
    tileTextOpacity.value = withTiming(1, { duration: SHUFFLE_ANIMATION_IN_MS });
  };

  const handleDeselectAll = () => {
    animateSelectedTilesBgColor({ selectedTiles, unguessedTiles, newValue: 0, duration: SHUFFLE_ANIMATION_IN_MS });
    setSelectedTiles(new Map());
  };

  const handleIncorrectGuess = ({ isOneAway }: { isOneAway: boolean }) => {
    // Animations
    animateSelectedTilesBgColor({ selectedTiles, unguessedTiles, newValue: 0.8, duration: 0 });
    animateIncorrectGuess({
      selectedTiles,
      unguessedTiles,
      callback: () =>
        animateSelectedTilesBgColor({ selectedTiles, unguessedTiles, newValue: 1, duration: 0, delay: 500 }),
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
      animateMistakesRemaining({ mistakesRemaining });
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

    animateSubmit({ selectedTiles, unguessedTiles });

    if (matchingCategory == null) {
      // Incorrect guess

      // TODO: figure out nicer way of delaying this animation set
      setTimeout(() => {
        handleIncorrectGuess({ isOneAway });
      }, 1000); // 600ms + 400ms additional delay
    } else {
      // Correct guess
      // TODO:
      // - Move tiles into highest available row (swap non-guessed tiles in top row with guessed ones)
      // - Category reveal animation
    }
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
