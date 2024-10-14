import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import tw from 'twrnc';
import { Tile as TileType } from '../@types';
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: tileTextOpacity.value,
    };
  });

  return (
    <Pressable
      style={tw` py-4 px-2 ${isSelected ? 'bg-[#5a594e]' : 'bg-[#EFEEE6]'} rounded-lg items-center justify-center w-[${tileWidth}px] max-w-[${MAX_TILE_WIDTH}px] h-[${TILE_HEIGHT}px]`}
      onPress={onTilePress}
    >
      <Animated.Text
        style={[
          tw`text-[${fontSize}px] text-center font-bold tracking-tight ${isSelected ? 'text-white' : 'text-black'} uppercase`,
          animatedStyle,
        ]}
      >
        {word}
      </Animated.Text>
    </Pressable>
  );
};
