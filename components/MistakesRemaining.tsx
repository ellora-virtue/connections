import React from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import tw from 'twrnc';
import { MistakesRemainingDot } from '../@types';
import { COLORS } from '../constants';
import { useConnectionsContext } from '../context';

export const MistakesRemaining = () => {
  const { mistakesRemaining } = useConnectionsContext();

  return (
    <View style={tw`flex-row items-center gap-3`}>
      <Text style={tw`text-base`}>Mistakes remaining:</Text>
      {mistakesRemaining.map((item, index) => (
        <Dot
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          scale={item.scale}
          opacity={item.opacity}
        />
      ))}
    </View>
  );
};

type DotProps = MistakesRemainingDot;

const Dot = ({ scale, opacity }: DotProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[animatedStyle, tw`h-4 w-4 rounded-full bg-[${COLORS.surface.dark}]`]} />;
};
