"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TabBarIndicator extends React.Component {
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

        _reactNative.Animated.timing(this.opacity, {
          toValue: 1,
          duration: 150,
          easing: _reactNative.Easing.in(_reactNative.Easing.linear),
          useNativeDriver: true
        }).start();
      }
    });

    _defineProperty(this, "isIndicatorShown", false);

    _defineProperty(this, "opacity", new _reactNative.Animated.Value(this.props.width === 'auto' ? 0 : 1));

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
      return _reactNative.Animated.multiply(translateX, _reactNative.I18nManager.isRTL ? -1 : 1);
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

    return /*#__PURE__*/React.createElement(_reactNative.Animated.View, {
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

exports.default = TabBarIndicator;

const styles = _reactNative.StyleSheet.create({
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