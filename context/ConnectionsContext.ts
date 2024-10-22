import shuffle from 'lodash/shuffle';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  makeMutable,
  runOnJS,
  SharedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Tile, TileSlot } from '../@types';
import { GAME_DATA } from '../data/gameData';
import { useRequiredContext } from '../hooks';

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
  onTilePress: (tile: Tile) => void;

  mistakesRemaining: number;
  setMistakesRemaining: Dispatch<SetStateAction<number>>;

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
          offset: makeMutable(0),
        })),
      ),
    );

    return new Map(processedData.map((tile, index) => [tile.word, { ...tile, slot: index as TileSlot }]));
  });

  const [selectedTiles, setSelectedTiles] = useState<Map<Tile['word'], Tile>>(new Map());
  const [mistakesRemaining, setMistakesRemaining] = useState(4);

  const onTilePress = (tile: Tile) => {
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

  const animateSelectedTilesBgColor = ({ newValue }: { newValue: number }) => {
    selectedTiles.forEach((tile) => {
      const unguessedTile = unguessedTiles.get(tile.word);

      if (unguessedTile != null) {
        unguessedTile.backgroundColorProgress.value = withTiming(newValue, { duration: SHUFFLE_ANIMATION_IN_MS });
      }
    });
  };

  // TODO: Still a very slight jump in animation when selected tiles change positions. Come back to this?
  const shuffleUnguessedTiles = () => {
    // Animations
    animateSelectedTilesBgColor({ newValue: 0 });
    tileTextOpacity.value = withTiming(0, { duration: SHUFFLE_ANIMATION_IN_MS }, (isFinished) => {
      if (isFinished === true) runOnJS(shuffleTiles)();
    });
  };

  const shuffleTiles = () => {
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
    animateSelectedTilesBgColor({ newValue: 1 });
    tileTextOpacity.value = withTiming(1, { duration: SHUFFLE_ANIMATION_IN_MS });
  };

  const handleDeselectAll = () => {
    animateSelectedTilesBgColor({ newValue: 0 });

    setSelectedTiles(new Map());
  };

  const animateSubmit = () => {
    Array.from(selectedTiles.values()).forEach((t, index) => {
      const tile = unguessedTiles.get(t.word);

      if (tile == null || tile.offset == null) return;

      const delay = index * SUBMIT_ANIMATION_DELAY_IN_MS;
      tile.offset.value = withDelay(
        delay,
        withRepeat(withTiming(SUBMIT_VERTICAL_OFFSET, { duration: SUBMIT_ANIMATION_IN_MS }), 2, true),
      );
    });
  };

  const handleSubmit = () => {
    animateSubmit();

    // TODO: other submit functionality
  };

  return {
    tileWidth,
    tileTextOpacity,
    unguessedTiles,
    setUnguessedTiles,
    selectedTiles,
    onTilePress,
    mistakesRemaining,
    setMistakesRemaining,
    shuffleUnguessedTiles,
    handleDeselectAll,
    handleSubmit,
  };
};
