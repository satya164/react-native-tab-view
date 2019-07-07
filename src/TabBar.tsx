import * as React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent,
  I18nManager,
  Platform,
} from 'react-native';
import Animated from 'react-native-reanimated';
import TabBarItem from './TabBarItem';
import TabBarIndicator, { Props as IndicatorProps } from './TabBarIndicator';
import memoize from './memoize';
import {
  Route,
  Scene,
  SceneRendererProps,
  NavigationState,
  Layout,
} from './types';

export type Props<T extends Route> = SceneRendererProps & {
  navigationState: NavigationState<T>;
  scrollEnabled?: boolean;
  bounces?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  pressColor?: string;
  pressOpacity?: number;
  getLabelText: (scene: Scene<T>) => string | undefined;
  getAccessible: (scene: Scene<T>) => boolean | undefined;
  getAccessibilityLabel: (scene: Scene<T>) => string | undefined;
  getTestID: (scene: Scene<T>) => string | undefined;
  renderLabel?: (
    scene: Scene<T> & {
      focused: boolean;
      color: string;
    }
  ) => React.ReactNode;
  renderIcon?: (
    scene: Scene<T> & {
      focused: boolean;
      color: string;
    }
  ) => React.ReactNode;
  renderBadge?: (scene: Scene<T>) => React.ReactNode;
  renderIndicator: (props: IndicatorProps<T>) => React.ReactNode;
  onTabPress?: (scene: Scene<T>) => void;
  onTabLongPress?: (scene: Scene<T>) => void;
  tabStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  indicatorContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

type State = {
  layout: Layout;
  tabWidths: number[];
};

export default class TabBar<T extends Route> extends React.Component<
  Props<T>,
  State
> {
  static defaultProps = {
    getLabelText: ({ route }: Scene<Route>) =>
      typeof route.title === 'string' ? route.title.toUpperCase() : route.title,
    getAccessible: ({ route }: Scene<Route>) =>
      typeof route.accessible !== 'undefined' ? route.accessible : true,
    getAccessibilityLabel: ({ route }: Scene<Route>) =>
      typeof route.accessibilityLabel === 'string'
        ? route.accessibilityLabel
        : typeof route.title === 'string'
        ? route.title
        : undefined,
    getTestID: ({ route }: Scene<Route>) => route.testID,
    renderIndicator: (props: IndicatorProps<Route>) => (
      <TabBarIndicator {...props} />
    ),
  };

  state = {
    layout: { width: 0, height: 0 },
    tabWidths: this.props.navigationState.routes.map(() => 0),
  };

  componentDidUpdate(prevProps: Props<T>, prevState: State) {
    if (
      prevProps.navigationState.routes.length !==
        this.props.navigationState.routes.length ||
      prevProps.navigationState.index !== this.props.navigationState.index ||
      prevState.layout.width !== this.state.layout.width ||
      prevState.tabWidths !== this.state.tabWidths ||
      this.isWidthDynamic(prevProps) !== this.isWidthDynamic(this.props)
    ) {
      this.resetScroll(this.props.navigationState.index);
    }
  }

  // to store the layout.width of each tab
  // when all onLayout's are fired, this would be set in state
  private actualTabWidths: number[] = [];

  private scrollAmount = new Animated.Value(0);

  private scrollView: ScrollView | undefined;

  private isWidthDynamic = (props: Props<T>) => {
    const tabStyle = StyleSheet.flatten(props.tabStyle || {});
    return tabStyle.width === 'auto';
  };

  private getTabWidth = (props: Props<T>, state: State, index: number) => {
    const { layout } = state;
    const { navigationState, tabStyle } = props;
    const flattened = StyleSheet.flatten(tabStyle);
    if (this.isWidthDynamic(props)) {
      // what if scrollEnabled? what's 2/5?
      const width = state.tabWidths[index] || this.actualTabWidths[index] || 0;
      return width;
    }

    if (flattened) {
      switch (typeof flattened.width) {
        case 'number':
          return flattened.width;
        case 'string':
          if (flattened.width.endsWith('%')) {
            const width = parseFloat(flattened.width);
            if (Number.isFinite(width)) {
              return layout.width * (width / 100);
            }
          }
      }
    }

    if (props.scrollEnabled) {
      return (layout.width / 5) * 2;
    }

    return layout.width / navigationState.routes.length;
  };

  private getMaxScrollDistance = (tabBarWidth: number, layoutWidth: number) =>
    tabBarWidth - layoutWidth;

  private getTabBarWidth = (props: Props<T>, state: State) => {
    const { layout } = state;
    const {
      navigationState: { routes },
    } = props;
    return Math.max(
      routes.reduce<number>(
        (acc, _, i) => acc + this.getTabWidth(props, state, i),
        0
      ),
      layout.width
    );
  };

  private normalizeScrollValue = (
    props: Props<T>,
    state: State,
    value: number
  ) => {
    const { layout } = state;
    const tabBarWidth = this.getTabBarWidth(props, state);
    const maxDistance = this.getMaxScrollDistance(tabBarWidth, layout.width);
    const scrollValue = Math.max(Math.min(value, maxDistance), 0);

    if (Platform.OS === 'android' && I18nManager.isRTL) {
      // On Android, scroll value is not applied in reverse in RTL
      // so we need to manually adjust it to apply correct value
      return maxDistance - scrollValue;
    }

    return scrollValue;
  };

  private getScrollAmount = (props: Props<T>, state: State, i: number) => {
    const { layout } = state;
    const centerDistance = Array.from({ length: i }).reduce<number>(
      (total, _, index) => {
        const tabWidth = this.getTabWidth(props, state, i);
        // To get the current index centered we adjust scroll amount by width of indexes
        // 0 through (i - 1) and add half the width of current index i
        return total + (index === i ? tabWidth / 2 : tabWidth);
      },
      0
    );
    const scrollAmount = centerDistance - layout.width / 2;
    return this.normalizeScrollValue(props, state, scrollAmount);
  };

  private resetScroll = (value: number) => {
    if (this.props.scrollEnabled) {
      this.scrollView &&
        this.scrollView.scrollTo({
          x: this.getScrollAmount(this.props, this.state, value),
          animated: true,
        });
    }
  };

  private handleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    if (
      this.state.layout.width === width &&
      this.state.layout.height === height
    ) {
      return;
    }

    this.setState({
      layout: {
        height,
        width,
      },
    });
  };

  private getTranslateX = memoize(
    (scrollAmount: Animated.Node<number>, maxScrollDistance: number) =>
      Animated.multiply(
        Platform.OS === 'android' && I18nManager.isRTL
          ? Animated.sub(maxScrollDistance, scrollAmount)
          : scrollAmount,
        I18nManager.isRTL ? 1 : -1
      )
  );

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
      indicatorContainerStyle,
    } = this.props;
    const { layout } = this.state;
    const { routes, index } = navigationState;
    const tabWidth = this.getTabWidth(this.props, this.state, index);
    const tabBarWidth = this.getTabBarWidth(this.props, this.state);
    const translateX = this.getTranslateX(
      this.scrollAmount,
      this.getMaxScrollDistance(tabBarWidth, layout.width)
    );

    return (
      <Animated.View
        onLayout={this.handleLayout}
        style={[styles.tabBar, style]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicatorContainer,
            scrollEnabled ? { transform: [{ translateX }] as any } : null,
            tabBarWidth
              ? { width: tabBarWidth }
              : scrollEnabled
              ? { width: tabBarWidthPercent }
              : null,
            indicatorContainerStyle,
          ]}
        >
          {this.props.renderIndicator({
            position,
            layout,
            navigationState,
            jumpTo,
            style: indicatorStyle,
            getTabWidth: i => this.getTabWidth(this.props, this.state, i),
          })}
        </Animated.View>
        <View style={styles.scroll}>
          <Animated.ScrollView
            horizontal
            keyboardShouldPersistTaps="handled"
            scrollEnabled={scrollEnabled}
            bounces={bounces}
            alwaysBounceHorizontal={false}
            scrollsToTop={false}
            showsHorizontalScrollIndicator={false}
            automaticallyAdjustContentInsets={false}
            overScrollMode="never"
            contentContainerStyle={[
              styles.tabContent,
              scrollEnabled
                ? { width: tabBarWidth || tabBarWidthPercent }
                : styles.container,
              contentContainerStyle,
            ]}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { x: this.scrollAmount },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
            ref={el => {
              // @ts-ignore
              this.scrollView = el && el.getNode();
            }}
          >
            {routes.map((route: T, i: number) => (
              <TabBarItem
                onLayout={({ nativeEvent: { layout } }) => {
                  if (!this.isWidthDynamic(this.props)) return;

                  this.actualTabWidths[i] = layout.width || tabWidth;

                  // check if this is the last onLayout call
                  const allOnLayoutsFired =
                    this.actualTabWidths.length === routes.length &&
                    Array.from(this.actualTabWidths).every(Boolean);
                  if (!allOnLayoutsFired) return;

                  // all onLayout's have been fired
                  this.setState({ tabWidths: [...this.actualTabWidths] });
                }}
                key={route.key}
                position={position}
                route={route}
                navigationState={navigationState}
                getAccessibilityLabel={getAccessibilityLabel}
                getAccessible={getAccessible}
                getLabelText={getLabelText}
                getTestID={getTestID}
                renderBadge={renderBadge}
                renderIcon={renderIcon}
                renderLabel={renderLabel}
                activeColor={activeColor}
                inactiveColor={inactiveColor}
                pressColor={pressColor}
                pressOpacity={pressOpacity}
                onPress={() => {
                  onTabPress && onTabPress({ route });
                  this.props.jumpTo(route.key);
                }}
                onLongPress={() => onTabLongPress && onTabLongPress({ route })}
                labelStyle={labelStyle}
                style={tabStyle}
              />
            ))}
          </Animated.ScrollView>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    overflow: 'scroll',
  },
  tabBar: {
    backgroundColor: '#2196f3',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
      width: 0,
    },
    zIndex: 1,
  },
  tabContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
