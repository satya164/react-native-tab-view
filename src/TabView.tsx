import * as React from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import TabBar, { Props as TabBarProps } from './TabBar';
import SceneView from './SceneView';
import {
  Layout,
  NavigationState,
  Route,
  SceneRendererProps,
  EventEmitterProps,
  PagerCommonProps,
} from './types';
import Pager, { Props as ChildProps } from './Pager';

export type ChildProps<
  T extends Route,
  ExtraBackendProps
> = PagerCommonProps & {
  onIndexChange: (index: number) => void;
  navigationState: NavigationState<T>;
  layout: Layout;
  // Clip unfocused views to improve memory usage
  // Don't enable this on iOS where this is buggy and views don't re-appear
  removeClippedSubviews?: boolean;
  children: (
    props: EventEmitterProps & {
      // Animated value which represents the state of current index
      // It can include fractional digits as it represents the intermediate value
      position: Animated.Node<number>;
      // Function to actually render the content of the pager
      // The parent component takes care of rendering
      render: (children: React.ReactNode) => React.ReactNode;
      // Callback to call when switching the tab
      // The tab switch animation is performed even if the index in state is unchanged
      jumpTo: (key: string) => void;
    }
  ) => React.ReactNode;
  gestureHandlerProps: React.ComponentProps<typeof PanGestureHandler>;
  extraBackendProps?: ExtraBackendProps;
};

type Props<T extends Route, ExtraBackendProps extends {}> = PagerCommonProps & {
  position?: Animated.Value<number>;
  onIndexChange: (index: number) => void;
  navigationState: NavigationState<T>;
  renderScene: (
    props: SceneRendererProps & {
      route: T;
    }
  ) => React.ReactNode;
  renderLazyPlaceholder: (props: { route: T }) => React.ReactNode;
  renderTabBar: (
    props: SceneRendererProps & {
      navigationState: NavigationState<T>;
    }
  ) => React.ReactNode;
  tabBarPosition: 'top' | 'bottom';
  initialLayout?: { width?: number; height?: number };
  lazy: boolean;
  lazyPreloadDistance: number;
  removeClippedSubviews?: boolean;
  sceneContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  gestureHandlerProps: React.ComponentProps<typeof PanGestureHandler>;
  backend: React.ComponentType<ChildProps<T, ExtraBackendProps>>;
  extraBackendProps?: ExtraBackendProps;
};

type State = {
  layout: Layout;
};

export default class TabView<
  T extends Route,
  ExtraBackendProps
> extends React.Component<Props<T, ExtraBackendProps>, State> {
  static defaultProps = {
    tabBarPosition: 'top',
    renderTabBar: <P extends Route>(props: TabBarProps<P>) => (
      <TabBar {...props} />
    ),
    renderLazyPlaceholder: () => null,
    keyboardDismissMode: 'auto',
    swipeEnabled: true,
    lazy: false,
    lazyPreloadDistance: 0,
    removeClippedSubviews: false,
    springConfig: {},
    timingConfig: {},
    gestureHandlerProps: {},
    backend: Pager,
  };

  state = {
    layout: { width: 0, height: 0, ...this.props.initialLayout },
  };

  private jumpToIndex = (index: number) => {
    if (index !== this.props.navigationState.index) {
      this.props.onIndexChange(index);
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

  render() {
    const {
      position: positionListener,
      onSwipeStart,
      onSwipeEnd,
      navigationState,
      lazy,
      lazyPreloadDistance,
      removeClippedSubviews,
      keyboardDismissMode,
      swipeEnabled,
      swipeVelocityImpact,
      timingConfig,
      springConfig,
      tabBarPosition,
      renderTabBar,
      renderScene,
      renderLazyPlaceholder,
      sceneContainerStyle,
      style,
      gestureHandlerProps,
      springVelocityScale,
      backend: Backend,
      extraBackendProps,
    } = this.props;
    const { layout } = this.state;

    return (
      <View onLayout={this.handleLayout} style={[styles.pager, style]}>
        <Backend
          navigationState={navigationState}
          layout={layout}
          keyboardDismissMode={keyboardDismissMode}
          swipeEnabled={swipeEnabled}
          swipeVelocityImpact={swipeVelocityImpact}
          timingConfig={timingConfig}
          springConfig={springConfig}
          onSwipeStart={onSwipeStart}
          onSwipeEnd={onSwipeEnd}
          onIndexChange={this.jumpToIndex}
          springVelocityScale={springVelocityScale}
          removeClippedSubviews={removeClippedSubviews}
          gestureHandlerProps={gestureHandlerProps}
          extraBackendProps={extraBackendProps}
        >
          {({ position, render, addListener, removeListener, jumpTo }) => {
            // All of the props here must not change between re-renders
            // This is crucial to optimizing the routes with PureComponent
            const sceneRendererProps = {
              position,
              layout,
              jumpTo,
            };

            return (
              <React.Fragment>
                {positionListener ? (
                  <Animated.Code
                    exec={Animated.set(positionListener, position)}
                  />
                ) : null}
                {tabBarPosition === 'top' &&
                  renderTabBar({
                    ...sceneRendererProps,
                    navigationState,
                  })}
                {render(
                  navigationState.routes.map((route, i) => {
                    return (
                      <SceneView
                        {...sceneRendererProps}
                        addListener={addListener}
                        removeListener={removeListener}
                        key={route.key}
                        index={i}
                        lazy={lazy}
                        lazyPreloadDistance={lazyPreloadDistance}
                        navigationState={navigationState}
                        style={sceneContainerStyle}
                      >
                        {({ loading }) =>
                          loading
                            ? renderLazyPlaceholder({ route })
                            : renderScene({
                                ...sceneRendererProps,
                                route,
                              })
                        }
                      </SceneView>
                    );
                  })
                )}
                {tabBarPosition === 'bottom' &&
                  renderTabBar({
                    ...sceneRendererProps,
                    navigationState,
                  })}
              </React.Fragment>
            );
          }}
        </Backend>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pager: {
    flex: 1,
    overflow: 'hidden',
  },
});
