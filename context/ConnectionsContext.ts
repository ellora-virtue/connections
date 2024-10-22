import shuffle from 'lodash/shuffle';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { makeMutable, runOnJS, SharedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { Tile } from '../@types';
import { GAME_DATA } from '../data/gameData';
import { useRequiredContext } from '../hooks';

const TOTAL_HORIZONTAL_PADDING = 16;
const TOTAL_TILES_PADDING = 24;
const NUMBER_OF_TILES = 4;
const TILE_BG_ANIMATION_IN_MS = 200;
const SHUFFLE_ANIMATION_IN_MS = 250;

export type ConnectionsContextValue = {
  tileWidth: number;
  tileTextOpacity: SharedValue<number>;

  unguessedTiles: Map<string, Tile>;

  selectedTiles: Set<Tile['word']>;
  onTilePress: (tile: Tile) => void;

  mistakesRemaining: number;
  setMistakesRemaining: Dispatch<SetStateAction<number>>;

  shuffleUnguessedTiles: () => void;

  handleDeselectAll: () => void;
};

export const ConnectionsContext = createContext<ConnectionsContextValue | null>(null);

export const useConnectionsContext = () => useRequiredContext(ConnectionsContext);

export const useProvideConnectionsState = (): ConnectionsContextValue => {
  const { width: screenWidth } = useWindowDimensions();
  const tileWidth = (screenWidth - TOTAL_HORIZONTAL_PADDING - TOTAL_TILES_PADDING) / NUMBER_OF_TILES;
  const tileTextOpacity = useSharedValue(1);

  const [unguessedTiles, setUnguessedTiles] = useState<Map<string, Tile>>(
    () =>
      new Map(
        GAME_DATA.flatMap((category) =>
          category.words.map((word) => [
            word,
            {
              word,
              category: category.category,
              difficulty: category.difficulty,
              backgroundColorProgress: makeMutable(0),
            },
          ]),
        ),
      ),
  );

  const [selectedTiles, setSelectedTiles] = useState<Set<Tile['word']>>(new Set());
  const [mistakesRemaining, setMistakesRemaining] = useState(4);

  const onTilePress = (tile: Tile) => {
    const { word, backgroundColorProgress } = tile;

    const isSelected = selectedTiles.has(word);

    if (isSelected) {
      backgroundColorProgress.value = withTiming(0, { duration: TILE_BG_ANIMATION_IN_MS });

      return setSelectedTiles((prev) => {
        const modifiedTiles = new Set(prev);

        modifiedTiles.delete(word);

        return modifiedTiles;
      });
    }

    if (selectedTiles.size < 4) {
      backgroundColorProgress.value = withTiming(1, { duration: TILE_BG_ANIMATION_IN_MS });

      return setSelectedTiles((prev) => {
        const modifiedTiles = new Set(prev);

        modifiedTiles.add(word);

        return modifiedTiles;
      });
    }
  };

  const animateSelectedTilesBgColor = ({ newValue }: { newValue: number }) => {
    selectedTiles.forEach((tile) => {
      const unguessedTile = unguessedTiles.get(tile);

      if (unguessedTile != null) {
        unguessedTile.backgroundColorProgress.value = withTiming(newValue, { duration: SHUFFLE_ANIMATION_IN_MS });
      }
    });
  };

  const shuffleUnguessedTiles = () => {
    // Animations
    animateSelectedTilesBgColor({ newValue: 0 });
    tileTextOpacity.value = withTiming(0, { duration: SHUFFLE_ANIMATION_IN_MS }, (isFinished) => {
      if (isFinished === true) runOnJS(shuffleTiles)();
    });
  };

  const shuffleTiles = () => {
    setUnguessedTiles((prev) => new Map(shuffle(Array.from(prev.entries()))));

    // Animations
    animateSelectedTilesBgColor({ newValue: 1 });
    tileTextOpacity.value = withTiming(1, { duration: SHUFFLE_ANIMATION_IN_MS });
  };

  const handleDeselectAll = () => {
    animateSelectedTilesBgColor({ newValue: 0 });

    setSelectedTiles(new Set());
  };

  return {
    tileWidth,
    tileTextOpacity,
    unguessedTiles,
    selectedTiles,
    onTilePress,
    mistakesRemaining,
    setMistakesRemaining,
    shuffleUnguessedTiles,
    handleDeselectAll,
  };
};
