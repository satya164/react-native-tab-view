/* eslint-disable no-unused-vars */
import * as React from 'react';
import { Animated, StyleSheet, I18nManager, StyleProp, ViewStyle } from 'react-native';
import type { Route, SceneRendererProps, NavigationState } from './types';

export type GetTabWidth = (index: number) => number;

export type Props<T extends Route> = SceneRendererProps & {
  navigationState: NavigationState<T>;
  width: string | number;
  style?: StyleProp<ViewStyle>;
  getTabWidth: GetTabWidth;
};

export default class TabBarIndicator<T extends Route> extends React.Component<Props<T>> {
  private getTranslateX = (position: Animated.AnimatedInterpolation, routes: Route[], getTabWidth: GetTabWidth) => {
    const inputRange = routes.map((_, i) => i);

    const outputRange = routes.reduce<number[]>((acc, _, i) => {
      const innerLeft = x => (getTabWidth(x) - 24) / 2;
      if (i === 0) return [0 + innerLeft(i)];
      return [...acc, acc[i - 1] + getTabWidth(i - 1) - innerLeft(i - 1) + innerLeft(i)];
    }, []);

    const translateX = position.interpolate({
      inputRange,
      outputRange,
      extrapolate: "clamp"
    });

    return Animated.multiply(translateX, I18nManager.isRTL ? -1 : 1);
  };

  render() {
    const { position, navigationState, getTabWidth, style, layout, width } = this.props;
    const { routes } = navigationState;

    const transform = [];

    if (layout.width) {
      const translateX = routes.length > 1 ? this.getTranslateX(position, routes, getTabWidth) : 0;

      transform.push({ translateX });
    }

    return <Animated.View style={[styles.indicator, { transform }, style, { width }]} />;
  }
}

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: "#ffeb3b",
    position: "absolute",
    bottom: 2,
    height: 2,
    borderRadius: 1
  }
});
