import React from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';

import { SafeAreaView, View } from 'react-native';
import tw from 'twrnc';

// TODO: add actions to icons (currently don't do anything)
// TODO: make icon sizes larger at breakpoint for bigger screens

export const NavBar = () => (
  <SafeAreaView>
    <View style={tw`flex-row items-center justify-between border-b-2 border-gray-200 p-4`}>
      <Icon
        name="chevron-back"
        size={24}
      />
      <View style={tw`flex-row items-center gap-3`}>
        <FAIcon
          name="cog"
          size={20}
        />
        <Icon
          name="podium-outline"
          size={16}
        />
        <Icon
          name="help-circle-outline"
          size={20}
        />
      </View>
    </View>
  </SafeAreaView>
);
