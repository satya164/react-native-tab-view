function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
export default class SceneView extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      loading: Math.abs(this.props.navigationState.index - this.props.index) > this.props.lazyPreloadDistance
    });

    _defineProperty(this, "unsubscribe", null);

    _defineProperty(this, "handleEnter", value => {
      const {
        index
      } = this.props; // If we're entering the current route, we need to load it

      if (value === index) {
        this.setState(prevState => {
          if (prevState.loading) {
            return {
              loading: false
            };
          }

          return null;
        });
      }
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (state.loading && Math.abs(props.navigationState.index - props.index) <= props.lazyPreloadDistance) {
      // Always render the route when it becomes focused
      return {
        loading: false
      };
    }

    return null;
  }

  componentDidMount() {
    if (this.props.lazy) {
      // If lazy mode is enabled, listen to when we enter screens
      this.unsubscribe = this.props.addEnterListener(this.handleEnter);
    } else if (this.state.loading) {
      // If lazy mode is not enabled, render the scene with a delay if not loaded already
      // This improves the initial startup time as the scene is no longer blocking
      setTimeout(() => this.setState({
        loading: false
      }), 0);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.lazy !== prevProps.lazy || this.state.loading !== prevState.loading) {
      // We only need the listener if the tab hasn't loaded yet and lazy is enabled
      if (this.props.lazy && this.state.loading) {
        var _this$unsubscribe;

        (_this$unsubscribe = this.unsubscribe) === null || _this$unsubscribe === void 0 ? void 0 : _this$unsubscribe.call(this);
        this.unsubscribe = this.props.addEnterListener(this.handleEnter);
      } else {
        var _this$unsubscribe2;

        (_this$unsubscribe2 = this.unsubscribe) === null || _this$unsubscribe2 === void 0 ? void 0 : _this$unsubscribe2.call(this);
      }
    }
  }

  componentWillUnmount() {
    var _this$unsubscribe3;

    (_this$unsubscribe3 = this.unsubscribe) === null || _this$unsubscribe3 === void 0 ? void 0 : _this$unsubscribe3.call(this);
  }

  render() {
    const {
      navigationState,
      index,
      layout,
      containerStyle
    } = this.props;
    const {
      loading
    } = this.state;
    const focused = navigationState.index === index;
    return /*#__PURE__*/React.createElement(View, {
      accessibilityElementsHidden: !focused,
      importantForAccessibility: focused ? 'auto' : 'no-hide-descendants',
      style: [styles.route, // If we don't have the layout yet, make the focused screen fill the container
      // This avoids delay before we are able to render pages side by side
      layout.width ? {
        width: layout.width
      } : focused ? StyleSheet.absoluteFill : null, containerStyle]
    }, // Only render the route only if it's either focused or layout is available
    // When layout is not available, we must not render unfocused routes
    // so that the focused route can fill the screen
    focused || layout.width ? this.props.children({
      loading
    }) : null);
  }

}
const styles = StyleSheet.create({
  route: {
    flex: 1,
    overflow: 'hidden'
  }
});
//# sourceMappingURL=SceneView.js.map