import { Dimensions, Pressable, Text, View } from 'react-native';
import tw from 'twrnc';
import { useConnectionsContext } from '../context';
import { Tile as TileType } from '../@types';
import { useMemo } from 'react';

type TileProps = {
  word: TileType['word'];
};

const TILE_HEIGHT = 84;
const MAX_TILE_WIDTH = 112;

export const Tile = ({ word }: TileProps) => {
  const { tileWidth, selectedTiles, handleTilePress } = useConnectionsContext();

  const isSelected = selectedTiles.has(word);

  const onTilePress = () => handleTilePress(word);

  return (
    <Pressable
      style={tw` py-4 px-2 ${isSelected ? 'bg-[#5a594e]' : 'bg-[#EFEEE6]'} rounded-lg items-center justify-center w-[${tileWidth}px] max-w-[${MAX_TILE_WIDTH}px] h-[${TILE_HEIGHT}px]`}
      onPress={onTilePress}
    >
      {/* TODO: make text size dynamic */}
      <Text style={tw`text-base font-bold tracking-tighter ${isSelected ? 'text-white' : 'text-black'} uppercase`}>
        {word}
      </Text>
    </Pressable>
  );
};
