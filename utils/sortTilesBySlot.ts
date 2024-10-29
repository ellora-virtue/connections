import { Tile } from '../@types';

export const sortTilesBySlot = ({ tiles }: { tiles: Map<Tile['word'], Tile> }): [Tile['word'], Tile][] =>
  Array.from(tiles.entries()).sort(([_keyA, a], [_keyB, b]) => (a.slot ?? 0) - (b.slot ?? 0));
