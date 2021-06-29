function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import { Animated, Keyboard, StyleSheet } from 'react-native';
import ViewPager from 'react-native-pager-view';
import useAnimatedValue from './useAnimatedValue';
const AnimatedViewPager = Animated.createAnimatedComponent(ViewPager);
export default function Pager({
  keyboardDismissMode = 'auto',
  swipeEnabled = true,
  navigationState,
  onIndexChange,
  onSwipeStart,
  onSwipeEnd,
  children,
  style,
  ...rest
}) {
  const {
    index
  } = navigationState;
  const listenersRef = React.useRef([]);
  const pagerRef = React.useRef();
  const indexRef = React.useRef(index);
  const navigationStateRef = React.useRef(navigationState);
  const position = useAnimatedValue(index);
  const offset = useAnimatedValue(0);
  React.useEffect(() => {
    navigationStateRef.current = navigationState;
  });
  const jumpTo = React.useCallback(key => {
    var _pagerRef$current;

    const index = navigationStateRef.current.routes.findIndex(route => route.key === key);
    (_pagerRef$current = pagerRef.current) === null || _pagerRef$current === void 0 ? void 0 : _pagerRef$current.setPage(index);
  }, []);
  React.useEffect(() => {
    if (keyboardDismissMode === 'auto') {
      Keyboard.dismiss();
    }

    if (indexRef.current !== index) {
      var _pagerRef$current2;

      (_pagerRef$current2 = pagerRef.current) === null || _pagerRef$current2 === void 0 ? void 0 : _pagerRef$current2.setPage(index);
    }
  }, [keyboardDismissMode, index]);

  const onPageScrollStateChanged = state => {
    const {
      pageScrollState
    } = state.nativeEvent;

    switch (pageScrollState) {
      case 'idle':
        onSwipeEnd === null || onSwipeEnd === void 0 ? void 0 : onSwipeEnd();
        return;

      case 'dragging':
        {
          const subscription = offset.addListener(({
            value
          }) => {
            const next = index + (value > 0 ? Math.ceil(value) : Math.floor(value));

            if (next !== index) {
              listenersRef.current.forEach(listener => listener(next));
            }

            offset.removeListener(subscription);
          });
          onSwipeStart === null || onSwipeStart === void 0 ? void 0 : onSwipeStart();
          return;
        }
    }
  };

  const addEnterListener = React.useCallback(listener => {
    listenersRef.current.push(listener);
    return () => {
      const index = listenersRef.current.indexOf(listener);

      if (index > -1) {
        listenersRef.current.splice(index, 1);
      }
    };
  }, []);
  return children({
    position: Animated.add(position, offset),
    addEnterListener,
    jumpTo,
    render: children => /*#__PURE__*/React.createElement(AnimatedViewPager, _extends({}, rest, {
      ref: pagerRef,
      style: [styles.container, style],
      initialPage: index,
      keyboardDismissMode: keyboardDismissMode === 'auto' ? 'on-drag' : keyboardDismissMode,
      onPageScroll: Animated.event([{
        nativeEvent: {
          position: position,
          offset: offset
        }
      }], {
        useNativeDriver: true
      }),
      onPageSelected: e => {
        const index = e.nativeEvent.position;
        indexRef.current = index;
        onIndexChange(index);
      },
      onPageScrollStateChanged: onPageScrollStateChanged,
      scrollEnabled: swipeEnabled
    }), children)
  });
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
//# sourceMappingURL=Pager.native.js.map