import { Tile } from '../../@types';
import { processSelectedTiles } from '../processSelectedTiles';

describe('processSelectedTiles', () => {
  it('should process tiles by extracting words, sorting them and returning a JSON string', () => {
    const tiles = new Map([
      ['1', { word: 'banana' }],
      ['2', { word: 'apple' }],
      ['3', { word: 'cherry' }],
    ]) as Map<string, Tile>;

    const result = processSelectedTiles({ tiles });

    expect(result).toBe(JSON.stringify(['apple', 'banana', 'cherry']));
  });

  it('should handle unsorted words and return them sorted alphabetically as a JSON string', () => {
    const tiles = new Map([
      ['1', { word: 'orange' }],
      ['2', { word: 'grape' }],
      ['3', { word: 'apple' }],
    ]) as Map<string, Tile>;

    const result = processSelectedTiles({ tiles });

    expect(result).toBe(JSON.stringify(['apple', 'grape', 'orange']));
  });
});
