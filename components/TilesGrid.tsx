import chunk from 'lodash/chunk';
import React, { PropsWithChildren, useMemo } from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

import { Tile as TileType } from '../@types';
import { useConnectionsContext } from '../context';

import { Tile } from './Tile';

export const TilesGrid = () => {
  const { unguessedTiles } = useConnectionsContext();

  // TODO: animation on shuffle (fade out/in)
  const [row1, row2, row3, row4] = useMemo(() => chunk(unguessedTiles, 4), [unguessedTiles]);

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
      word={tile.word}
    />
  ));

const TileRow = ({ children }: PropsWithChildren) => <View style={tw`flex-row gap-2`}>{children}</View>;
