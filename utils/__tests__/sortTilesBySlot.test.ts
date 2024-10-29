import { sortTilesBySlot } from '../sortTilesBySlot';
import { Tile } from '../../@types';

describe('sortTilesBySlot', () => {
  it('sorts tiles by slot in ascending order', () => {
    const tiles = new Map([
      ['tile1', { word: 'tile1', slot: 2 }],
      ['tile2', { word: 'tile2', slot: 1 }],
      ['tile3', { word: 'tile3', slot: 3 }],
    ]) as Map<Tile['word'], Tile>;

    const sortedTiles = sortTilesBySlot({ tiles });

    expect(sortedTiles).toEqual([
      ['tile2', { word: 'tile2', slot: 1 }],
      ['tile1', { word: 'tile1', slot: 2 }],
      ['tile3', { word: 'tile3', slot: 3 }],
    ]);
  });

  it('handles an empty map of tiles', () => {
    const tiles = new Map<Tile['word'], Tile>();

    const sortedTiles = sortTilesBySlot({ tiles });

    expect(sortedTiles).toEqual([]);
  });

  it('does not mutate the original tiles map', () => {
    const tiles = new Map([
      ['tile1', { word: 'tile1', slot: 2 }],
      ['tile2', { word: 'tile2', slot: 1 }],
    ]) as Map<Tile['word'], Tile>;

    sortTilesBySlot({ tiles });

    expect(tiles).toEqual(
      new Map([
        ['tile1', { word: 'tile1', slot: 2 }],
        ['tile2', { word: 'tile2', slot: 1 }],
      ]),
    );
  });
});
