import { Text, View } from 'react-native';

import tw from 'twrnc';
import './styles.css';
import { NavBar } from './components';

const App = () => {
  return (
    <View style={tw`bg-white`}>
      <NavBar />
      <View style={tw`items-center justify-center`}>
        <Text style={tw`text-black text-lg`}>Hello!</Text>
      </View>
    </View>
  );
};

export default App;
