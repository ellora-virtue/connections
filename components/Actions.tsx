import { View } from 'react-native';
import { useConnectionsContext } from '../context';
import { Button } from './Button';
import tw from 'twrnc';

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
