import React from 'react';
import { Pressable } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Tile = ({ word }: TileProps) => {
  const { tileWidth, tileTextOpacity, selectedTiles, onTilePress } = useConnectionsContext();
  const fontSize = useResponsiveFontSize({ word, tileWidth });

  const tileScale = useSharedValue(1);
  const tileColorProgress = useSharedValue(0);

  const animatedTileStyle = useAnimatedStyle(() => ({
    transform: [{ scale: tileScale.value }],
    backgroundColor: interpolateColor(tileColorProgress.value, [0, 1], [COLORS.surface.light, COLORS.surface.dark]),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: tileTextOpacity.value,
  }));

  const isSelected = selectedTiles.has(word);

  const handleTilePress = () => onTilePress(word);

  // TODO: fix color animation on tile press
  // Works but first time color doesn't change?
  // Should I also animate the text color changing?

  const handleLongPress = () => {
    onTilePress(word);

    // Scale down to 90% on long press (75ms)
    tileScale.value = withTiming(0.9);

    tileColorProgress.value = withTiming(isSelected ? 1 : 0);
  };

  const handlePressOut = () => {
    tileScale.value = withTiming(1); // Scale back to original when released
  };

  return (
    <AnimatedPressable
      style={[
        animatedTileStyle,
        tw`items-center justify-center rounded-lg px-2 py-4 w-[${tileWidth}px] max-w-[${MAX_TILE_WIDTH}px] h-[${TILE_HEIGHT}px]`,
      ]}
      onPress={handleTilePress}
      onLongPress={handleLongPress}
      // Overrides long press default threshold of 300ms
      delayLongPress={75}
      onPressOut={handlePressOut}
    >
      <Animated.Text
        style={[
          animatedTextStyle,
          tw`text-center font-bold uppercase text-[${fontSize}px] tracking-tight ${isSelected ? 'text-white' : 'text-black'}`,
        ]}
      >
        {word}
      </Animated.Text>
    </AnimatedPressable>
  );
};
