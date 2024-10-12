import { Pressable, Text } from 'react-native';
import tw from 'twrnc';

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

const DISABLED_COLOR = '#7f7f7f';

export const Button = ({ label, onPress, disabled }: ButtonProps) => {
  return (
    <Pressable
      style={tw`rounded-full border ${disabled ? `border-[${DISABLED_COLOR}]` : 'border-black'} py-3 px-5`}
      onPress={onPress}
    >
      <Text style={tw`text-base font-semibold ${disabled ? `text-[${DISABLED_COLOR}]` : 'text-black'}`}>{label}</Text>
    </Pressable>
  );
};
