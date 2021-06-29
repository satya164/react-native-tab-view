function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import { Animated, Easing, StyleSheet, I18nManager } from 'react-native';
export default class TabBarIndicator extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "fadeInIndicator", () => {
      const {
        navigationState,
        layout,
        width,
        getTabWidth
      } = this.props;

      if (!this.isIndicatorShown && width === 'auto' && layout.width && // We should fade-in the indicator when we have widths for all the tab items
      navigationState.routes.every((_, i) => getTabWidth(i))) {
        this.isIndicatorShown = true;
        Animated.timing(this.opacity, {
          toValue: 1,
          duration: 150,
          easing: Easing.in(Easing.linear),
          useNativeDriver: true
        }).start();
      }
    });

    _defineProperty(this, "isIndicatorShown", false);

    _defineProperty(this, "opacity", new Animated.Value(this.props.width === 'auto' ? 0 : 1));

    _defineProperty(this, "getTranslateX", (position, routes, getTabWidth) => {
      const inputRange = routes.map((_, i) => i); // every index contains widths at all previous indices

      const outputRange = routes.reduce((acc, _, i) => {
        if (i === 0) return [0];
        return [...acc, acc[i - 1] + getTabWidth(i - 1)];
      }, []);
      const translateX = position.interpolate({
        inputRange,
        outputRange,
        extrapolate: 'clamp'
      });
      return Animated.multiply(translateX, I18nManager.isRTL ? -1 : 1);
    });
  }

  componentDidMount() {
    this.fadeInIndicator();
  }

  componentDidUpdate() {
    this.fadeInIndicator();
  }

  render() {
    const {
      position,
      navigationState,
      getTabWidth,
      width,
      style,
      layout
    } = this.props;
    const {
      routes
    } = navigationState;
    const transform = [];

    if (layout.width) {
      const translateX = routes.length > 1 ? this.getTranslateX(position, routes, getTabWidth) : 0;
      transform.push({
        translateX
      });
    }

    if (width === 'auto') {
      const inputRange = routes.map((_, i) => i);
      const outputRange = inputRange.map(getTabWidth);
      transform.push({
        scaleX: routes.length > 1 ? position.interpolate({
          inputRange,
          outputRange,
          extrapolate: 'clamp'
        }) : outputRange[0]
      }, {
        translateX: 0.5
      });
    }

    return /*#__PURE__*/React.createElement(Animated.View, {
      style: [styles.indicator, {
        width: width === 'auto' ? 1 : width
      }, // If layout is not available, use `left` property for positioning the indicator
      // This avoids rendering delay until we are able to calculate translateX
      layout.width ? {
        left: 0
      } : {
        left: `${100 / routes.length * navigationState.index}%`
      }, {
        transform
      }, width === 'auto' ? {
        opacity: this.opacity
      } : null, style]
    });
  }

}
const styles = StyleSheet.create({
  indicator: {
    backgroundColor: '#ffeb3b',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 2
  }
});
//# sourceMappingURL=TabBarIndicator.js.map