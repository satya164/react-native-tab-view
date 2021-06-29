function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import { Animated, PanResponder, Keyboard, StyleSheet, I18nManager, View } from 'react-native';
import useAnimatedValue from './useAnimatedValue';
const DEAD_ZONE = 12;
const DefaultTransitionSpec = {
  timing: Animated.spring,
  stiffness: 1000,
  damping: 500,
  mass: 3,
  overshootClamping: true
};
export default function Pager({
  layout,
  keyboardDismissMode = 'auto',
  swipeEnabled = true,
  navigationState,
  onIndexChange,
  onSwipeStart,
  onSwipeEnd,
  children,
  style
}) {
  const {
    routes,
    index
  } = navigationState;
  const panX = useAnimatedValue(0);
  const listenersRef = React.useRef([]);
  const navigationStateRef = React.useRef(navigationState);
  const layoutRef = React.useRef(layout);
  const onIndexChangeRef = React.useRef(onIndexChange);
  const currentIndexRef = React.useRef(index);
  const pendingIndexRef = React.useRef();
  const swipeVelocityThreshold = 0.15;
  const swipeDistanceThreshold = layout.width / 1.75;
  const jumpToIndex = React.useCallback(index => {
    const offset = -index * layoutRef.current.width;
    const {
      timing,
      ...transitionConfig
    } = DefaultTransitionSpec;
    Animated.parallel([timing(panX, { ...transitionConfig,
      toValue: offset,
      useNativeDriver: false
    })]).start(({
      finished
    }) => {
      if (finished) {
        onIndexChangeRef.current(index);
        pendingIndexRef.current = undefined;
      }
    });
    pendingIndexRef.current = index;
  }, [panX]);
  React.useEffect(() => {
    navigationStateRef.current = navigationState;
    layoutRef.current = layout;
    onIndexChangeRef.current = onIndexChange;
  });
  React.useEffect(() => {
    const offset = -navigationStateRef.current.index * layout.width;
    panX.setValue(offset);
  }, [layout.width, panX]);
  React.useEffect(() => {
    if (keyboardDismissMode === 'auto') {
      Keyboard.dismiss();
    }

    if (layout.width && currentIndexRef.current !== index) {
      jumpToIndex(index);
    }
  }, [jumpToIndex, keyboardDismissMode, layout.width, index]);

  const isMovingHorizontally = (_, gestureState) => {
    return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2) && Math.abs(gestureState.vx) > Math.abs(gestureState.vy * 2);
  };

  const canMoveScreen = (event, gestureState) => {
    if (swipeEnabled === false) {
      return false;
    }

    return isMovingHorizontally(event, gestureState) && (gestureState.dx >= DEAD_ZONE && currentIndexRef.current > 0 || gestureState.dx <= -DEAD_ZONE && currentIndexRef.current < routes.length - 1);
  };

  const startGesture = () => {
    onSwipeStart === null || onSwipeStart === void 0 ? void 0 : onSwipeStart();

    if (keyboardDismissMode === 'on-drag') {
      Keyboard.dismiss();
    }

    panX.stopAnimation(); // @ts-expect-error: _value is private, but docs use it as well

    panX.setOffset(panX._value);
  };

  const respondToGesture = (_, gestureState) => {
    if ( // swiping left
    gestureState.dx > 0 && index <= 0 || // swiping right
    gestureState.dx < 0 && index >= routes.length - 1) {
      return;
    }

    if (layout.width) {
      // @ts-expect-error: _offset is private, but docs use it as well
      const position = (panX._offset + gestureState.dx) / -layout.width;
      const next = position > index ? Math.ceil(position) : Math.floor(position);

      if (next !== index) {
        listenersRef.current.forEach(listener => listener(next));
      }
    }

    panX.setValue(gestureState.dx);
  };

  const finishGesture = (_, gestureState) => {
    panX.flattenOffset();
    onSwipeEnd === null || onSwipeEnd === void 0 ? void 0 : onSwipeEnd();
    const currentIndex = typeof pendingIndexRef.current === 'number' ? pendingIndexRef.current : currentIndexRef.current;
    let nextIndex = currentIndex;

    if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.vx) > Math.abs(gestureState.vy) && (Math.abs(gestureState.dx) > swipeDistanceThreshold || Math.abs(gestureState.vx) > swipeVelocityThreshold)) {
      nextIndex = Math.round(Math.min(Math.max(0, currentIndex - gestureState.dx / Math.abs(gestureState.dx)), routes.length - 1));
      currentIndexRef.current = nextIndex;
    }

    if (!isFinite(nextIndex)) {
      nextIndex = currentIndex;
    }

    jumpToIndex(nextIndex);
  }; // TODO: use the listeners


  const addEnterListener = React.useCallback(listener => {
    listenersRef.current.push(listener);
    return () => {
      const index = listenersRef.current.indexOf(listener);

      if (index > -1) {
        listenersRef.current.splice(index, 1);
      }
    };
  }, []);
  const jumpTo = React.useCallback(key => {
    const index = navigationStateRef.current.routes.findIndex(route => route.key === key);
    jumpToIndex(index);
  }, [jumpToIndex]);
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: canMoveScreen,
    onMoveShouldSetPanResponderCapture: canMoveScreen,
    onPanResponderGrant: startGesture,
    onPanResponderMove: respondToGesture,
    onPanResponderTerminate: finishGesture,
    onPanResponderRelease: finishGesture,
    onPanResponderTerminationRequest: () => true
  });
  const maxTranslate = layout.width * (routes.length - 1);
  const translateX = Animated.multiply(panX.interpolate({
    inputRange: [-maxTranslate, 0],
    outputRange: [-maxTranslate, 0],
    extrapolate: 'clamp'
  }), I18nManager.isRTL ? -1 : 1);
  return children({
    position: layout.width ? Animated.divide(panX, -layout.width) : new Animated.Value(index),
    addEnterListener,
    jumpTo,
    render: children => /*#__PURE__*/React.createElement(Animated.View, _extends({
      style: [styles.sheet, layout.width ? {
        width: routes.length * layout.width,
        transform: [{
          translateX
        }]
      } : null, style]
    }, panResponder.panHandlers), React.Children.map(children, (child, i) => {
      const route = routes[i];
      const focused = i === index;
      return /*#__PURE__*/React.createElement(View, {
        key: route.key,
        style: layout.width ? {
          width: layout.width
        } : focused ? StyleSheet.absoluteFill : null
      }, focused || layout.width ? child : null);
    }))
  });
}
const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch'
  }
});
//# sourceMappingURL=Pager.js.map