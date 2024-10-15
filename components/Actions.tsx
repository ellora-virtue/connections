import { View } from 'react-native';
import tw from 'twrnc';
import { useConnectionsContext } from '../context';
import { Button } from './Button';

export const Actions = () => {
  const { selectedTiles, shuffleUnguessedTiles, handleDeselectAll } = useConnectionsContext();

  return (
    <View style={tw`flex-row gap-3`}>
      <Button
        onPress={shuffleUnguessedTiles}
        label="Shuffle"
      />
      <Button
        onPress={handleDeselectAll}
        label="Deselect all"
        mode={selectedTiles.size === 0 ? 'disabled' : 'default'}
      />
      <Button
        onPress={handleDeselectAll}
        label="Submit"
        mode={selectedTiles.size !== 4 ? 'disabled' : 'active'}
      />
    </View>
  );
};
