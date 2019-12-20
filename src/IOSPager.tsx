import * as React from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';

import { Route, PagerCommonProps } from './types';

type ScrollEvent = {
  nativeEvent: {
    contentOffset: {
      x: number;
      y: number;
    };
    contentSize: {
      height: number;
      width: number;
    };
  };
};

type State = {
  initialOffset: { x: number; y: number };
};

type Scene<T> = {
  route: T;
};

type Layout = {
  height: number;
  width: number;
};

type NavigationState<T> = {
  index: number;
  routes: Array<T>;
};

type Props<T extends Route> = PagerCommonProps & {
  animationEnabled?: boolean;
  swipeEnabled?: boolean;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  onAnimationEnd?: () => void;
  canJumpToTab: (scene: Scene<T>) => boolean;
  bounces: boolean;
  layout: Layout;
  navigationState: NavigationState<T>;
  panX: Animated.Value;
  offsetX: Animated.Value;
  useNativeDriver?: boolean;
  onIndexChange: (index: number) => void;
  children: JSX.Element[];
  horizontal: boolean;
};

export default class IOSPager<T extends Route> extends React.Component<
  Props<T>,
  State
> {
  static defaultProps = {
    canJumpToTab: () => true,
    bounces: true,
  };

  constructor(props: Props<T>) {
    super(props);

    const { navigationState, layout } = this.props;

    this.state = {
      initialOffset: {
        x: navigationState.index * layout.width,
        y: 0,
      },
    };
  }

  componentDidMount() {
    this._mounted = true;
    this.setInitialPage();
  }

  componentDidUpdate(prevProps: Props<T>) {
    const amount = this.props.navigationState.index * this.props.layout.width;

    if (
      prevProps.navigationState.routes.length !==
        this.props.navigationState.routes.length ||
      prevProps.layout.width !== this.props.layout.width
    ) {
      this.scrollTo(amount, false);
    } else if (
      prevProps.navigationState.index !== this.props.navigationState.index
    ) {
      this.scrollTo(amount);
    }
  }

  _scrollView: ScrollView;
  _idleCallback: any;
  _isIdle: boolean = true;
  _isInitial: boolean = true;
  _mounted: boolean = false;

  private jumpTo = (key: string) => {
    if (!this._mounted) {
      // We are no longer mounted, this is a no-op
      return;
    }

    const { canJumpToTab, navigationState } = this.props;
    const index = navigationState.routes.findIndex(route => route.key === key);

    if (!canJumpToTab) {
      return;
    }

    if (index !== navigationState.index) {
      this.props.onIndexChange(index);
    }
  };

  private setInitialPage = () => {
    if (this.props.layout.width) {
      this._isInitial = true;
      this.scrollTo(
        this.props.navigationState.index * this.props.layout.width,
        false
      );
    }

    setTimeout(() => {
      this._isInitial = false;
    }, 50);
  };

  private scrollTo = (x: number, animated = true) => {
    if (this._isIdle && this._scrollView) {
      this._scrollView.scrollTo({
        x,
        animated: animated && this.props.animationEnabled !== false,
      });
    }
  };

  private handleMomentumScrollEnd = (e: ScrollEvent) => {
    let nextIndex = Math.round(
      e.nativeEvent.contentOffset.x / this.props.layout.width
    );

    const nextRoute = this.props.navigationState.routes[nextIndex];

    if (this.props.canJumpToTab({ route: nextRoute })) {
      this.jumpTo(nextRoute.key);
      this.props.onAnimationEnd && this.props.onAnimationEnd();
    } else {
      requestAnimationFrame(() => {
        this.scrollTo(
          this.props.navigationState.index * this.props.layout.width
        );
      });
    }
  };

  private handleScroll = (e: ScrollEvent) => {
    if (this._isInitial || e.nativeEvent.contentSize.width === 0) {
      return;
    }

    const { navigationState, layout } = this.props;
    const offset = navigationState.index * layout.width;

    this.props.offsetX.setValue(-offset);
    this.props.panX.setValue(offset - e.nativeEvent.contentOffset.x);

    cancelAnimationFrame(this._idleCallback);

    this._isIdle = false;
    this._idleCallback = requestAnimationFrame(() => {
      this._isIdle = true;
    });
  };

  render() {
    const {
      children,
      layout,
      navigationState,
      onSwipeStart,
      onSwipeEnd,
      bounces,
    } = this.props;

    return (
      <ScrollView
        horizontal={this.props.horizontal}
        pagingEnabled
        directionalLockEnabled
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        overScrollMode="never"
        scrollEnabled={this.props.swipeEnabled}
        automaticallyAdjustContentInsets={false}
        bounces={bounces}
        alwaysBounceHorizontal={bounces}
        scrollsToTop={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={1}
        onScroll={this.handleScroll}
        onScrollBeginDrag={onSwipeStart}
        onScrollEndDrag={onSwipeEnd}
        onMomentumScrollEnd={this.handleMomentumScrollEnd}
        contentOffset={this.state.initialOffset}
        style={styles.container}
        contentContainerStyle={layout.width ? null : styles.container}
        ref={el => (this._scrollView = el)}
      >
        {React.Children.map(children, (child, i) => {
          const route = navigationState.routes[i];
          const focused = i === navigationState.index;

          return (
            <View
              key={route.key}
              // testID={this.props.getTestID({ route })}
              accessibilityElementsHidden={!focused}
              importantForAccessibility={
                focused ? 'auto' : 'no-hide-descendants'
              }
              style={
                layout.width
                  ? { width: layout.width, overflow: 'hidden' }
                  : focused
                  ? styles.page
                  : null
              }
            >
              {focused || layout.width ? child : null}
            </View>
          );
        })}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    overflow: 'hidden',
  },
});
