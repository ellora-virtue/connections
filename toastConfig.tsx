import React from 'react';
import { Text, View } from 'react-native';
import { BaseToastProps, ToastConfig } from 'react-native-toast-message';
import tw from 'twrnc';

export const toastConfig: ToastConfig = {
  base: ({ text1 }: Partial<BaseToastProps>) => (
    <View style={tw`flex rounded-md bg-black p-4`}>
      <Text style={tw`font-semibold text-white`}>{text1}</Text>
    </View>
  ),
};
