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
        disabled={selectedTiles.size === 0}
      />
      <Button
        onPress={handleDeselectAll}
        label="Submit"
        disabled={selectedTiles.size !== 4}
      />
    </View>
  );
};
