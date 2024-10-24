import { validateGuess } from '../validateGuess';
import { GameData, Tile } from '../../@types';

describe('validateGuess', () => {
  const mockData = [
    {
      category: 'Fruits',
      words: ['apple', 'banana', 'orange', 'grape'],
    },
    {
      category: 'Colors',
      words: ['red', 'blue', 'green', 'yellow'],
    },
    {
      category: 'Animals',
      words: ['dog', 'cat', 'mouse', 'elephant'],
    },
  ] as unknown as GameData;

  it('should return matching category when all four words match', () => {
    const selectedTiles: Tile['word'][] = ['apple', 'banana', 'orange', 'grape'];

    const result = validateGuess({ data: mockData, selectedTiles });

    expect(result).toEqual({
      matchingCategory: 'Fruits',
      isOneAway: false,
    });
  });

  it('should return isOneAway true when three words match', () => {
    const selectedTiles: Tile['word'][] = ['red', 'banana', 'blue', 'yellow'];

    const result = validateGuess({ data: mockData, selectedTiles });

    expect(result).toEqual({
      matchingCategory: null,
      isOneAway: true,
    });
  });

  it('should handle an incorrect guess correctly', () => {
    const selectedTiles: Tile['word'][] = ['apple', 'cat', 'red', 'grape'];

    const result = validateGuess({ data: mockData, selectedTiles });

    expect(result).toEqual({
      matchingCategory: null,
      isOneAway: false,
    });
  });
});
