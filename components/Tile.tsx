import React from 'react';
import { LayoutChangeEvent, Pressable } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import tw from 'twrnc';
import { TilePosition, Tile as TileType } from '../@types';
import { COLORS } from '../constants';
import { useConnectionsContext } from '../context';
import { useResponsiveFontSize } from '../hooks';

// Constants
//-----------------------------------------------------

const TILE_HEIGHT = 84;
const MAX_TILE_WIDTH = 112;

// Animated components
//-----------------------------------------------------

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Types
//-----------------------------------------------------

type TileProps = {
  tile: TileType;
  onLayout: (position: TilePosition) => void;
};

export const Tile = ({ tile, onLayout }: TileProps) => {
  const { tileWidth, tileTextOpacity, selectedTiles, onTilePress } = useConnectionsContext();
  const fontSize = useResponsiveFontSize({ word: tile.word, tileWidth });
  const isSelected = selectedTiles.has(tile.word);

  // Animations
  //-----------------------------------------------------

  const tileScale = useSharedValue(1);

  const animatedTileStyle = useAnimatedStyle(() => ({
    transform: [{ scale: tileScale.value }, { translateY: tile.offset.value }],
    backgroundColor: interpolateColor(
      tile.backgroundColorProgress.value,
      [0, 1],
      [COLORS.surface.light, COLORS.surface.dark],
    ),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: tileTextOpacity.value,
  }));

  // Handlers
  //-----------------------------------------------------

  // TODO: May also need to track each tile slot's position on the screen for future animations, to move them between positions?
  const handleLayout = (event: LayoutChangeEvent) => {
    event.target.measure((x, y, _width, _height, pageX, pageY) => onLayout({ x: x + pageX, y: y + pageY }));
  };

  const handleTilePress = () => {
    onTilePress(tile);
  };

  const handleLongPress = () => {
    onTilePress(tile);

    // Scale down to 90% on long press (75ms)
    tileScale.value = withTiming(0.9);
  };

  const handlePressOut = () => {
    tileScale.value = withTiming(1); // Scale back to original when released
  };

  // Render
  //-----------------------------------------------------

  return (
    <AnimatedPressable
      style={[
        animatedTileStyle,
        tw`items-center justify-center rounded-lg px-2 py-4 w-[${tileWidth}px] max-w-[${MAX_TILE_WIDTH}px] h-[${TILE_HEIGHT}px]`,
      ]}
      onPress={handleTilePress}
      onLongPress={handleLongPress}
      // Overrides long press default threshold of 300ms
      delayLongPress={50}
      onPressOut={handlePressOut}
      onLayout={handleLayout}
    >
      <Animated.Text
        style={[
          animatedTextStyle,
          tw`text-center font-bold uppercase text-[${fontSize}px] tracking-tight ${isSelected ? 'text-white' : 'text-black'}`,
        ]}
      >
        {tile.word}
      </Animated.Text>
    </AnimatedPressable>
  );
};
