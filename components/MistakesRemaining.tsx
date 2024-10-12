import { Text, View } from 'react-native';
import { useConnectionsContext } from '../context';
import { Button } from './Button';
import tw from 'twrnc';

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

// TODO: extract colours
const Dot = () => <View style={tw`w-4 h-4 rounded-full bg-[#5a594e]`} />;
