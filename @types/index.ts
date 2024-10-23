import { SharedValue } from 'react-native-reanimated';

export type TilePosition = { x: number; y: number };

// Slots:
// [ 0] [ 1] [ 2] [ 3]
// [ 4] [ 5] [ 6] [ 7]
// [ 8] [ 9] [10] [11]
// [12] [13] [14] [15]
export type TileSlot = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type Difficulty = 1 | 2 | 3 | 4;

export type Category = {
  category: string;
  words: [string, string, string, string];
  difficulty: Difficulty;
};

export type Tile = {
  word: string;
  category: string;
  difficulty: Difficulty;
  backgroundColorProgress: SharedValue<number>;
  offsetX: SharedValue<number>;
  offsetY: SharedValue<number>;
  position?: TilePosition;
  slot?: TileSlot;
};

export type GameData = [Category, Category, Category, Category];
