import React from 'react';
import { Pressable, Text } from 'react-native';
import tw from 'twrnc';
import { COLORS } from '../constants';

type ButtonStyles = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};

type ButtonMode = 'default' | 'active' | 'disabled';

type ButtonProps = {
  label: string;
  onPress: () => void;
  mode?: ButtonMode;
};

export const Button = ({ label, onPress, mode = 'default' }: ButtonProps) => {
  const { backgroundColor, borderColor, textColor } = getButtonStyles(mode);

  return (
    <Pressable
      style={tw`rounded-full border border-[${borderColor}] bg-[${backgroundColor}] py-3 px-5`}
      onPress={mode !== 'disabled' ? onPress : undefined}
    >
      <Text style={tw`text-base font-semibold text-[${textColor}]`}>{label}</Text>
    </Pressable>
  );
};

const getButtonStyles = (mode: ButtonMode): ButtonStyles => {
  switch (mode) {
    case 'active':
      return {
        backgroundColor: COLORS.surface.black,
        borderColor: COLORS.surface.black,
        textColor: COLORS.surface.white,
      };
    case 'disabled':
      return {
        backgroundColor: COLORS.surface.white,
        borderColor: COLORS.button.disabled,
        textColor: COLORS.button.disabled,
      };
    default:
      return {
        backgroundColor: COLORS.surface.white,
        borderColor: COLORS.surface.black,
        textColor: COLORS.surface.black,
      };
  }
};
