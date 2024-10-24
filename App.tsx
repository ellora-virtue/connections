import React from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

import tw from 'twrnc';
import { Game, NavBar } from './components';
import { ConnectionsContext, useProvideConnectionsState } from './context';
import './styles.css';
import { toastConfig } from './toastConfig';

const App = () => {
  const contextState = useProvideConnectionsState();

  return (
    <ConnectionsContext.Provider value={contextState}>
      <View style={tw`w-full flex-col`}>
        <NavBar />
        <View style={tw`bg-white py-6`}>
          <Game />
        </View>
      </View>
      <Toast
        config={toastConfig}
        type="base"
        topOffset={80}
      />
    </ConnectionsContext.Provider>
  );
};

export default App;
