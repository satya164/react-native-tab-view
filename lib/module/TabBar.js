function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import { Animated, StyleSheet, View, I18nManager, Platform } from 'react-native';
import TabBarItem from './TabBarItem';
import TabBarIndicator from './TabBarIndicator';
export default class TabBar extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      layout: {
        width: 0,
        height: 0
      },
      tabWidths: {}
    });

    _defineProperty(this, "measuredTabWidths", {});

    _defineProperty(this, "scrollAmount", new Animated.Value(0));

    _defineProperty(this, "scrollViewRef", /*#__PURE__*/React.createRef());

    _defineProperty(this, "getFlattenedTabWidth", style => {
      const tabStyle = StyleSheet.flatten(style);
      return tabStyle ? tabStyle.width : undefined;
    });

    _defineProperty(this, "getComputedTabWidth", (index, layout, routes, scrollEnabled, tabWidths, flattenedWidth) => {
      if (flattenedWidth === 'auto') {
        return tabWidths[routes[index].key] || 0;
      }

      switch (typeof flattenedWidth) {
        case 'number':
          return flattenedWidth;

        case 'string':
          if (flattenedWidth.endsWith('%')) {
            const width = parseFloat(flattenedWidth);

            if (Number.isFinite(width)) {
              return layout.width * (width / 100);
            }
          }

      }

      if (scrollEnabled) {
        return layout.width / 5 * 2;
      }

      return layout.width / routes.length;
    });

    _defineProperty(this, "getMaxScrollDistance", (tabBarWidth, layoutWidth) => tabBarWidth - layoutWidth);

    _defineProperty(this, "getTabBarWidth", (props, state) => {
      const {
        layout,
        tabWidths
      } = state;
      const {
        scrollEnabled,
        tabStyle
      } = props;
      const {
        routes
      } = props.navigationState;
      return routes.reduce((acc, _, i) => acc + this.getComputedTabWidth(i, layout, routes, scrollEnabled, tabWidths, this.getFlattenedTabWidth(tabStyle)), 0);
    });

    _defineProperty(this, "normalizeScrollValue", (props, state, value) => {
      const {
        layout
      } = state;
      const tabBarWidth = this.getTabBarWidth(props, state);
      const maxDistance = this.getMaxScrollDistance(tabBarWidth, layout.width);
      const scrollValue = Math.max(Math.min(value, maxDistance), 0);

      if (Platform.OS === 'android' && I18nManager.isRTL) {
        // On Android, scroll value is not applied in reverse in RTL
        // so we need to manually adjust it to apply correct value
        return maxDistance - scrollValue;
      }

      return scrollValue;
    });

    _defineProperty(this, "getScrollAmount", (props, state, index) => {
      const {
        layout,
        tabWidths
      } = state;
      const {
        scrollEnabled,
        tabStyle
      } = props;
      const {
        routes
      } = props.navigationState;
      const centerDistance = Array.from({
        length: index + 1
      }).reduce((total, _, i) => {
        const tabWidth = this.getComputedTabWidth(i, layout, routes, scrollEnabled, tabWidths, this.getFlattenedTabWidth(tabStyle)); // To get the current index centered we adjust scroll amount by width of indexes
        // 0 through (i - 1) and add half the width of current index i

        return total + (index === i ? tabWidth / 2 : tabWidth);
      }, 0);
      const scrollAmount = centerDistance - layout.width / 2;
      return this.normalizeScrollValue(props, state, scrollAmount);
    });

    _defineProperty(this, "resetScroll", index => {
      if (this.props.scrollEnabled) {
        var _this$scrollViewRef$c;

        (_this$scrollViewRef$c = this.scrollViewRef.current) === null || _this$scrollViewRef$c === void 0 ? void 0 : _this$scrollViewRef$c.scrollTo({
          x: this.getScrollAmount(this.props, this.state, index),
          animated: true
        });
      }
    });

    _defineProperty(this, "handleLayout", e => {
      const {
        height,
        width
      } = e.nativeEvent.layout;

      if (this.state.layout.width === width && this.state.layout.height === height) {
        return;
      }

      this.setState({
        layout: {
          height,
          width
        }
      });
    });

    _defineProperty(this, "getTranslateX", (scrollAmount, maxScrollDistance) => Animated.multiply(Platform.OS === 'android' && I18nManager.isRTL ? Animated.add(maxScrollDistance, Animated.multiply(scrollAmount, -1)) : scrollAmount, I18nManager.isRTL ? 1 : -1));
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      navigationState
    } = this.props;
    const {
      layout,
      tabWidths
    } = this.state;

    if (prevProps.navigationState.routes.length !== navigationState.routes.length || prevProps.navigationState.index !== navigationState.index || prevState.layout.width !== layout.width || prevState.tabWidths !== tabWidths) {
      if (this.getFlattenedTabWidth(this.props.tabStyle) === 'auto' && !(layout.width && navigationState.routes.every(r => typeof tabWidths[r.key] === 'number'))) {
        // When tab width is dynamic, only adjust the scroll once we have all tab widths and layout
        return;
      }

      this.resetScroll(navigationState.index);
    }
  } // to store the layout.width of each tab
  // when all onLayout's are fired, this would be set in state


  render() {
    const {
      position,
      navigationState,
      jumpTo,
      scrollEnabled,
      bounces,
      getAccessibilityLabel,
      getAccessible,
      getLabelText,
      getTestID,
      renderBadge,
      renderIcon,
      renderLabel,
      renderTabBarItem,
      activeColor,
      inactiveColor,
      pressColor,
      pressOpacity,
      onTabPress,
      onTabLongPress,
      tabStyle,
      labelStyle,
      indicatorStyle,
      contentContainerStyle,
      style,
      indicatorContainerStyle
    } = this.props;
    const {
      layout,
      tabWidths
    } = this.state;
    const {
      routes
    } = navigationState;
    const isWidthDynamic = this.getFlattenedTabWidth(tabStyle) === 'auto';
    const tabBarWidth = this.getTabBarWidth(this.props, this.state);
    const tabBarWidthPercent = `${routes.length * 40}%`;
    const translateX = this.getTranslateX(this.scrollAmount, this.getMaxScrollDistance(tabBarWidth, layout.width));
    return /*#__PURE__*/React.createElement(Animated.View, {
      onLayout: this.handleLayout,
      style: [styles.tabBar, style]
    }, /*#__PURE__*/React.createElement(Animated.View, {
      pointerEvents: "none",
      style: [styles.indicatorContainer, scrollEnabled ? {
        transform: [{
          translateX
        }]
      } : null, tabBarWidth ? {
        width: tabBarWidth
      } : scrollEnabled ? {
        width: tabBarWidthPercent
      } : null, indicatorContainerStyle]
    }, this.props.renderIndicator({
      position,
      layout,
      navigationState,
      jumpTo,
      width: isWidthDynamic ? 'auto' : `${100 / routes.length}%`,
      style: indicatorStyle,
      getTabWidth: i => this.getComputedTabWidth(i, layout, routes, scrollEnabled, tabWidths, this.getFlattenedTabWidth(tabStyle))
    })), /*#__PURE__*/React.createElement(View, {
      style: styles.scroll
    }, /*#__PURE__*/React.createElement(Animated.ScrollView, {
      horizontal: true,
      accessibilityRole: "tablist",
      keyboardShouldPersistTaps: "handled",
      scrollEnabled: scrollEnabled,
      bounces: bounces,
      alwaysBounceHorizontal: false,
      scrollsToTop: false,
      showsHorizontalScrollIndicator: false,
      automaticallyAdjustContentInsets: false,
      overScrollMode: "never",
      contentContainerStyle: [styles.tabContent, scrollEnabled ? {
        width: tabBarWidth || tabBarWidthPercent
      } : styles.container, contentContainerStyle],
      scrollEventThrottle: 16,
      onScroll: Animated.event([{
        nativeEvent: {
          contentOffset: {
            x: this.scrollAmount
          }
        }
      }], {
        useNativeDriver: true
      }),
      ref: this.scrollViewRef
    }, routes.map(route => {
      const props = {
        key: route.key,
        position: position,
        route: route,
        navigationState: navigationState,
        getAccessibilityLabel: getAccessibilityLabel,
        getAccessible: getAccessible,
        getLabelText: getLabelText,
        getTestID: getTestID,
        renderBadge: renderBadge,
        renderIcon: renderIcon,
        renderLabel: renderLabel,
        activeColor: activeColor,
        inactiveColor: inactiveColor,
        pressColor: pressColor,
        pressOpacity: pressOpacity,
        onLayout: isWidthDynamic ? e => {
          this.measuredTabWidths[route.key] = e.nativeEvent.layout.width; // When we have measured widths for all of the tabs, we should updates the state
          // We avoid doing separate setState for each layout since it triggers multiple renders and slows down app

          if (routes.every(r => typeof this.measuredTabWidths[r.key] === 'number')) {
            this.setState({
              tabWidths: { ...this.measuredTabWidths
              }
            });
          }
        } : undefined,
        onPress: () => {
          const event = {
            route,
            defaultPrevented: false,
            preventDefault: () => {
              event.defaultPrevented = true;
            }
          };
          onTabPress === null || onTabPress === void 0 ? void 0 : onTabPress(event);

          if (event.defaultPrevented) {
            return;
          }

          this.props.jumpTo(route.key);
        },
        onLongPress: () => onTabLongPress === null || onTabLongPress === void 0 ? void 0 : onTabLongPress({
          route
        }),
        labelStyle: labelStyle,
        style: tabStyle
      };
      return renderTabBarItem ? renderTabBarItem(props) : /*#__PURE__*/React.createElement(TabBarItem, props);
    }))));
  }

}

_defineProperty(TabBar, "defaultProps", {
  getLabelText: ({
    route
  }) => typeof route.title === 'string' ? route.title.toUpperCase() : route.title,
  getAccessible: ({
    route
  }) => typeof route.accessible !== 'undefined' ? route.accessible : true,
  getAccessibilityLabel: ({
    route
  }) => typeof route.accessibilityLabel === 'string' ? route.accessibilityLabel : typeof route.title === 'string' ? route.title : undefined,
  getTestID: ({
    route
  }) => route.testID,
  renderIndicator: props => /*#__PURE__*/React.createElement(TabBarIndicator, props)
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scroll: {
    overflow: Platform.select({
      default: 'scroll',
      web: undefined
    })
  },
  tabBar: {
    backgroundColor: '#2196f3',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
      width: 0
    },
    zIndex: 1
  },
  tabContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});
//# sourceMappingURL=TabBar.js.map