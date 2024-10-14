import { View } from 'react-native';

import tw from 'twrnc';
import { Game, NavBar } from './components';
import { ConnectionsContext, useProvideConnectionsState } from './context';
import './styles.css';

const App = () => {
  const contextState = useProvideConnectionsState();

  return (
    <ConnectionsContext.Provider value={contextState}>
      <View style={tw`flex-col w-full`}>
        <NavBar />
        <View style={tw`bg-white py-6 `}>
          <Game />
        </View>
      </View>
    </ConnectionsContext.Provider>
  );
};

export default App;
