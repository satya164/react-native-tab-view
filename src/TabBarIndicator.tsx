import * as React from 'react';
import { StyleSheet, I18nManager, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import memoize from './memoize';
import { Route, SceneRendererProps, NavigationState } from './types';

export type Props<T extends Route> = SceneRendererProps & {
  dynamicWidth?: boolean;
  navigationState: NavigationState<T>;
  tabWidths: number[];
  width: number;
  style?: StyleProp<ViewStyle>;
};

const { max, min, multiply } = Animated;

export default class TabBarIndicator<
  T extends Route
> extends React.PureComponent<Props<T>> {
  private getTranslateX = memoize(
    (
      position: Animated.Node<number>,
      routes: Route[],
      tabWidths: number[],
      width: number,
      dynamicWidth?: boolean
    ) => {
      if (dynamicWidth) {
        let inputRange: number[] = [];
        let outputRange: number[] = [];
        let totalWidth = 0;
        routes.forEach((_route: Route, i: number) => {
          if (i !== 0) {
            totalWidth += tabWidths[i - 1];
          }
          inputRange.push(i);
          outputRange.push(totalWidth + tabWidths[i] * 0.5);
        });

        return Animated.interpolate(position, {
          inputRange,
          outputRange,
        });
      }
      return multiply(
        max(min(position, routes.length - 1), 0),
        width * (I18nManager.isRTL ? -1 : 1)
      );
    }
  );

  private getScaleX = memoize(
    (
      position: Animated.Node<number>,
      routes: Route[],
      tabWidths: number[],
      dynamicWidth?: boolean
    ) => {
      if (dynamicWidth) {
        const inputRange = routes.map((_, i) => i);
        const outputRange = routes.reduce<number[]>(
          (acc, _, i) => [...acc, tabWidths[i]],
          []
        );
        return Animated.interpolate(position, {
          inputRange,
          outputRange,
        });
      }
      return 1;
    }
  );

  private getStyle = memoize((routes: Route[], dynamicWidth?: boolean) =>
    dynamicWidth ? { width: 1 } : { width: `${100 / routes.length}%` }
  );

  render() {
    const {
      dynamicWidth,
      width,
      position,
      navigationState,
      tabWidths,
      style,
    } = this.props;
    const { routes } = navigationState;

    const translateX = this.getTranslateX(
      position,
      routes,
      tabWidths,
      width,
      dynamicWidth
    );
    const scaleX = this.getScaleX(position, routes, tabWidths, dynamicWidth);
    const dynamicStyle = this.getStyle(routes, dynamicWidth);

    return (
      <Animated.View
        style={[
          styles.indicator,
          dynamicStyle,
          // If layout is not available, use `left` property for positioning the indicator
          // This avoids rendering delay until we are able to calculate translateX
          layout.width
            ? { transform: [{ translateX }] as any }
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
