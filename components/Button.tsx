import { Pressable, Text } from 'react-native';
import tw from 'twrnc';
import { COLORS } from '../constants';

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export const Button = ({ label, onPress, disabled }: ButtonProps) => {
  return (
    <Pressable
      style={tw`rounded-full border ${disabled ? `border-[${COLORS.button.disabled}]` : 'border-black'} py-3 px-5`}
      onPress={onPress}
    >
      <Text style={tw`text-base font-semibold ${disabled ? `text-[${COLORS.button.disabled}]` : 'text-black'}`}>
        {label}
      </Text>
    </Pressable>
  );
};
