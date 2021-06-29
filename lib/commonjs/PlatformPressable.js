"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PlatformPressable;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_SUPPORTS_RIPPLE = _reactNative.Platform.OS === 'android' && _reactNative.Platform.Version >= ANDROID_VERSION_LOLLIPOP;
/**
 * PlatformPressable provides an abstraction on top of TouchableNativeFeedback and
 * TouchableOpacity to handle platform differences.
 *
 * On Android, you can pass the props of TouchableNativeFeedback.
 * On other platforms, you can pass the props of TouchableOpacity.
 */

function PlatformPressable({
  android_ripple,
  pressColor = 'rgba(0, 0, 0, .32)',
  pressOpacity,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(_reactNative.Pressable, _extends({
    android_ripple: ANDROID_SUPPORTS_RIPPLE ? {
      color: pressColor,
      ...android_ripple
    } : undefined,
    style: ({
      pressed
    }) => [{
      opacity: pressed && !ANDROID_SUPPORTS_RIPPLE ? pressOpacity : 1
    }, typeof style === 'function' ? style({
      pressed
    }) : style]
  }, rest));
}
//# sourceMappingURL=PlatformPressable.js.map