import chunk from 'lodash/chunk';
import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

import { TilePosition, Tile as TileType } from '../@types';
import { useConnectionsContext } from '../context';

import { Tile } from './Tile';

export const TilesGrid = () => {
  const { unguessedTiles, setUnguessedTiles } = useConnectionsContext();

  const [row1, row2, row3, row4] = chunk(Array.from(unguessedTiles.values()), 4);

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
    <View style={tw`gap-2 px-2`}>
      <TileRow>{renderRow({ tiles: row1, onLayout })}</TileRow>
      <TileRow>{renderRow({ tiles: row2, onLayout })}</TileRow>
      <TileRow>{renderRow({ tiles: row3, onLayout })}</TileRow>
      <TileRow>{renderRow({ tiles: row4, onLayout })}</TileRow>
    </View>
  );
};

const renderRow = ({
  tiles,
  onLayout,
}: {
  tiles: TileType[];
  onLayout: ({ tileWord, position }: { tileWord: TileType['word']; position: TilePosition }) => void;
}) =>
  tiles.map((tile) => {
    const handleLayout = (position: TilePosition) => onLayout({ tileWord: tile.word, position });

    return (
      <Tile
        key={tile.word}
        tile={tile}
        onLayout={handleLayout}
      />
    );
  });

const TileRow = ({ children }: PropsWithChildren) => <View style={tw`flex-row gap-2`}>{children}</View>;
