"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TabView;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _TabBar = _interopRequireDefault(require("./TabBar"));

var _SceneView = _interopRequireDefault(require("./SceneView"));

var _Pager = _interopRequireDefault(require("./Pager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function TabView({
  onIndexChange,
  navigationState,
  renderScene,
  initialLayout,
  keyboardDismissMode = 'auto',
  lazy = false,
  lazyPreloadDistance = 0,
  onSwipeStart,
  onSwipeEnd,
  renderLazyPlaceholder = () => null,
  renderTabBar = props => /*#__PURE__*/React.createElement(_TabBar.default, props),
  sceneContainerStyle,
  style,
  swipeEnabled = true,
  tabBarPosition = 'top'
}) {
  const [layout, setLayout] = React.useState({
    width: 0,
    height: 0,
    ...initialLayout
  });

  const jumpToIndex = index => {
    if (index !== navigationState.index) {
      onIndexChange(index);
    }
  };

  const handleLayout = e => {
    const {
      height,
      width
    } = e.nativeEvent.layout;
    setLayout(prevLayout => {
      if (prevLayout.width === width && prevLayout.height === height) {
        return prevLayout;
      }

      return {
        height,
        width
      };
    });
  };

  return /*#__PURE__*/React.createElement(_reactNative.View, {
    onLayout: handleLayout,
    style: [styles.pager, style]
  }, /*#__PURE__*/React.createElement(_Pager.default, {
    layout: layout,
    navigationState: navigationState,
    keyboardDismissMode: keyboardDismissMode,
    swipeEnabled: swipeEnabled,
    onSwipeStart: onSwipeStart,
    onSwipeEnd: onSwipeEnd,
    onIndexChange: jumpToIndex
  }, ({
    position,
    render,
    addEnterListener,
    jumpTo
  }) => {
    // All of the props here must not change between re-renders
    // This is crucial to optimizing the routes with PureComponent
    const sceneRendererProps = {
      position,
      layout,
      jumpTo
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, tabBarPosition === 'top' && renderTabBar({ ...sceneRendererProps,
      navigationState
    }), render(navigationState.routes.map((route, i) => {
      return /*#__PURE__*/React.createElement(_SceneView.default, _extends({}, sceneRendererProps, {
        addEnterListener: addEnterListener,
        key: route.key,
        index: i,
        lazy: typeof lazy === 'function' ? lazy({
          route
        }) : lazy,
        lazyPreloadDistance: lazyPreloadDistance,
        navigationState: navigationState,
        containerStyle: sceneContainerStyle
      }), ({
        loading
      }) => loading ? renderLazyPlaceholder({
        route
      }) : renderScene({ ...sceneRendererProps,
        route
      }));
    })), tabBarPosition === 'bottom' && renderTabBar({ ...sceneRendererProps,
      navigationState
    }));
  }));
}

const styles = _reactNative.StyleSheet.create({
  pager: {
    flex: 1,
    overflow: 'hidden'
  }
});
//# sourceMappingURL=TabView.js.map