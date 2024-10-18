import chunk from 'lodash/chunk';
import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

import { Tile as TileType } from '../@types';
import { useConnectionsContext } from '../context';

import { Tile } from './Tile';

export const TilesGrid = () => {
  const { unguessedTiles } = useConnectionsContext();

  const [row1, row2, row3, row4] = chunk(Array.from(unguessedTiles.values()), 4);

  return (
    <View style={tw`gap-2 px-2`}>
      <TileRow>{renderRow(row1)}</TileRow>
      <TileRow>{renderRow(row2)}</TileRow>
      <TileRow>{renderRow(row3)}</TileRow>
      <TileRow>{renderRow(row4)}</TileRow>
    </View>
  );
};

const renderRow = (tiles: TileType[]) =>
  tiles.map((tile) => (
    <Tile
      key={tile.word}
      tile={tile}
    />
  ));

const TileRow = ({ children }: PropsWithChildren) => <View style={tw`flex-row gap-2`}>{children}</View>;
