import { Text, View } from 'react-native';
import tw from 'twrnc';
import { Actions } from './Actions';
import { TilesGrid } from './TilesGrid';
import { MistakesRemaining } from './MistakesRemaining';

export const Game = () => {
  return (
    <View style={tw`items-center gap-6`}>
      <Text style={tw`text-base`}>Create four groups of four!</Text>
      <TilesGrid />
      <MistakesRemaining />
      <Actions />
    </View>
  );
};