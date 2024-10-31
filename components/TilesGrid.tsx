import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

import { TilePosition, Tile as TileType } from '../@types';
import { useConnectionsContext } from '../context';

import { Tile } from './Tile';

export const TilesGrid = () => {
  const { unguessedTiles, setUnguessedTiles } = useConnectionsContext();

  const onLayout = ({ tileWord, position }: { tileWord: TileType['word']; position: TilePosition }) => {
    setUnguessedTiles((prevTiles) => {
      const updatedTiles = new Map(prevTiles);
      const tileToUpdate = updatedTiles.get(tileWord);

      if (tileToUpdate != null) {
        updatedTiles.set(tileWord, {
          ...tileToUpdate,
          position,
        });
      }

      return updatedTiles;
    });
  };

  return (
    <View style={tw`flex-row flex-wrap items-start justify-center gap-2 px-2`}>
      {Array.from(unguessedTiles.values()).map((tile) => {
        const handleLayout = (position: TilePosition) => onLayout({ tileWord: tile.word, position });

        return (
          <Tile
            key={tile.word}
            onLayout={handleLayout}
            tile={tile}
          />
        );
      })}
    </View>
  );
};
