import * as React from 'react';
import { Animated } from 'react-native';
export default function useAnimatedValue(initialValue) {
  const lazyRef = React.useRef();

  if (lazyRef.current === undefined) {
    lazyRef.current = new Animated.Value(initialValue);
  }

  return lazyRef.current;
}
//# sourceMappingURL=useAnimatedValue.js.map