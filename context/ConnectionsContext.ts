import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { Dimensions } from 'react-native';
import { useRequiredContext } from '../hooks';
import { GAME_DATA } from '../data/gameData';
import { Tile } from '../@types';
import shuffle from 'lodash/shuffle';

const TOTAL_HORIZONTAL_PADDING = 16;
const TOTAL_TILES_PADDING = 24;
const NUMBER_OF_TILES = 4;

export type ConnectionsContextValue = {
  tileWidth: number;

  unguessedTiles: Tile[];

  selectedTiles: Set<Tile['word']>;
  handleTilePress: (word: string) => void;

  mistakesRemaining: number;
  setMistakesRemaining: Dispatch<SetStateAction<number>>;

  shuffleUnguessedTiles: () => void;
  handleDeselectAll: () => void;
};

export const ConnectionsContext = createContext<ConnectionsContextValue | null>(null);

export const useConnectionsContext = () => useRequiredContext(ConnectionsContext);

export const useProvideConnectionsState = (): ConnectionsContextValue => {
  const { width: screenWidth } = Dimensions.get('screen');
  const tileWidth = (screenWidth - TOTAL_HORIZONTAL_PADDING - TOTAL_TILES_PADDING) / NUMBER_OF_TILES;

  const [unguessedTiles, setUnguessedTiles] = useState<Tile[]>(
    shuffle(
      GAME_DATA.flatMap((category) =>
        category.words.map((word) => ({
          word,
          category: category.category,
          difficulty: category.difficulty,
        })),
      ),
    ),
  );

  const [selectedTiles, setSelectedTiles] = useState<Set<Tile['word']>>(new Set());
  const [mistakesRemaining, setMistakesRemaining] = useState(4);

  const handleTilePress = (word: Tile['word']) => {
    const isSelected = selectedTiles.has(word);

    if (isSelected) {
      return setSelectedTiles((prev) => {
        const modifiedTiles = new Set(prev);

        modifiedTiles.delete(word);

        return modifiedTiles;
      });
    }

    if (selectedTiles.size < 4) {
      return setSelectedTiles((prev) => {
        const modifiedTiles = new Set(prev);

        modifiedTiles.add(word);

        return modifiedTiles;
      });
    }
  };

  const handleDeselectAll = () => setSelectedTiles(new Set());

  const shuffleUnguessedTiles = () => setUnguessedTiles((prev) => shuffle(prev));

  return {
    tileWidth,
    unguessedTiles,
    selectedTiles,
    handleTilePress,
    mistakesRemaining,
    setMistakesRemaining,
    shuffleUnguessedTiles,
    handleDeselectAll,
  };
};