import React from 'react';
import { Text, View } from 'react-native';
import tw from 'twrnc';
import { useConnectionsContext } from '../context';
import { COLORS } from '../constants';

export const MistakesRemaining = () => {
  const { mistakesRemaining } = useConnectionsContext();

  return (
    <View style={tw`flex-row items-center gap-3`}>
      <Text style={tw`text-base`}>Mistakes remaining:</Text>
      {Array.from({ length: mistakesRemaining }).map((item, index) => (
        <Dot key={index} />
      ))}
    </View>
  );
};

const Dot = () => <View style={tw`w-4 h-4 rounded-full bg-[${COLORS.surface.dark}]`} />;
