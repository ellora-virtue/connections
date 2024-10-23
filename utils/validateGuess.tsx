import { Category, GameData, Tile } from '../@types';

// TODO: write unit test for this function

export const validateGuess = ({
  data,
  selectedTiles,
}: {
  data: GameData;
  selectedTiles: Tile['word'][];
}): {
  matchingCategory: Category['category'] | null;
  isOneAway: boolean;
} => {
  let matchingCategory: string | null = null;
  let isOneAway = false;

  data.forEach((category) => {
    const matchingWords = category.words.filter((word) => selectedTiles.includes(word));

    if (matchingWords.length === 4) {
      matchingCategory = category.category;
      return;
    }

    if (matchingWords.length === 3 && matchingCategory == null) {
      isOneAway = true;
    }
  });

  return {
    matchingCategory,
    isOneAway,
  };
};
