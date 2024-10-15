import React from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import tw from 'twrnc';
import { Tile as TileType } from '../@types';
import { COLORS } from '../constants';
import { useConnectionsContext } from '../context';
import { useResponsiveFontSize } from '../hooks';

type TileProps = {
  word: TileType['word'];
};

const TILE_HEIGHT = 84;
const MAX_TILE_WIDTH = 112;

export const Tile = ({ word }: TileProps) => {
  const { tileWidth, tileTextOpacity, selectedTiles, handleTilePress } = useConnectionsContext();
  const fontSize = useResponsiveFontSize({ word, tileWidth });

  const isSelected = selectedTiles.has(word);

  const onTilePress = () => handleTilePress(word);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: tileTextOpacity.value,
  }));

  return (
    <Pressable
      style={tw`py-4 ${isSelected ? `bg-[${COLORS.surface.dark}]` : `bg-[${COLORS.surface.light}]`} items-center justify-center rounded-lg px-2 w-[${tileWidth}px] max-w-[${MAX_TILE_WIDTH}px] h-[${TILE_HEIGHT}px]`}
      onPress={onTilePress}
    >
      <Animated.Text
        style={[
          animatedStyle,
          tw`text-center font-bold uppercase text-[${fontSize}px] tracking-tight ${isSelected ? 'text-white' : 'text-black'}`,
        ]}
      >
        {word}
      </Animated.Text>
    </Pressable>
  );
};
