import * as React from 'react';
import { StyleSheet, I18nManager, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import memoize from './memoize';
import { Route, SceneRendererProps, NavigationState } from './types';

export type GetTabWidth = (tabIndex: number) => number;

export type Props<T extends Route> = SceneRendererProps & {
  navigationState: NavigationState<T>;
  style?: StyleProp<ViewStyle>;
  getTabWidth: GetTabWidth;
};

const { multiply } = Animated;

export default class TabBarIndicator<T extends Route> extends React.Component<
  Props<T>
> {
  private getTranslateX = memoize(
    (
      position: Animated.Node<number>,
      routes: Route[],
      getTabWidth: GetTabWidth
    ) => {
      const inputRange = routes.map((_, i) => i);

      // every index contains widths at all previous indices
      const accumulatedWidths = routes.reduce<number[]>((acc, _, i) => {
        if (i === 0) return [0];
        return [...acc, acc[i - 1] + getTabWidth(i - 1)];
      }, []);
      const outputRange = routes.reduce<number[]>(
        (acc, _, i) => [...acc, accumulatedWidths[i]],
        []
      );

      const transalteX = Animated.interpolate(position, {
        inputRange,
        outputRange,
      });

      return multiply(transalteX, I18nManager.isRTL ? -1 : 1);
    }
  );

  private getScaleX = memoize(
    (
      position: Animated.Node<number>,
      routes: Route[],
      getTabWidth: GetTabWidth
    ) => {
      const inputRange = routes.map((_, i) => i);
      const outputRange = routes.reduce<number[]>(
        (acc, _, i) => [...acc, getTabWidth(i)],
        []
      );

      return Animated.interpolate(position, {
        inputRange,
        outputRange,
      });
    }
  );

  render() {
    const {
      position,
      navigationState,
      style,
      getTabWidth,
      layout,
    } = this.props;
    const { routes } = navigationState;

    const translateX = this.getTranslateX(position, routes, getTabWidth);
    const scaleX = this.getScaleX(position, routes, getTabWidth);
    return (
      <Animated.View
        style={[
          styles.indicator,
          // If layout is not available, use `left` property for positioning the indicator
          // This avoids rendering delay until we are able to calculate translateX
          { width: scaleX },
          layout.width
            ? [{ transform: [{ translateX }] as any }]
            : { left: `${(100 / routes.length) * navigationState.index}%` },
          style,
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: '#ffeb3b',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 2,
  },
});
