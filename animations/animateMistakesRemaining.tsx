import { withSequence, withTiming } from 'react-native-reanimated';
import { MistakesRemaining } from '../@types';

/**
 * @summary Animates the last mistakes remaining dot
 * @description Dot first becomes 20% larger, before shrinking to 0%. Simultaneously, color of dot animates to 50% opacity
 * @description 600ms
 */
export const animateMistakesRemaining = ({ mistakesRemaining }: { mistakesRemaining: MistakesRemaining }) => {
  const filteredDots = mistakesRemaining.filter((item) => item.scale.value === 1);
  const lastDot = filteredDots[filteredDots.length - 1];

  // Animations
  if (lastDot != null) {
    lastDot.scale.value = withSequence(withTiming(1.2), withTiming(0));
    lastDot.opacity.value = withTiming(0.5);
  }
};
