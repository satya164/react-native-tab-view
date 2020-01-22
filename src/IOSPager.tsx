import * as React from 'react';
import { StyleSheet, Keyboard, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Route, PagerCommonProps, EventEmitterProps, Listener } from './types';
import { Props } from '../lib/typescript/src/Pager';

const { ScrollView, event, divide } = Animated;

type State = {
  initialOffset: { x: number; y: number };
};

export default class IOSPager<T extends Route> extends React.Component<
  Props<T>,
  State
> {
  static defaultProps = {
    bounces: true,
  };

  private initialOffset = {
    x: this.props.navigationState.index * this.props.layout.width,
    y: 0,
  };

  componentDidMount() {
    if (this.props.layout.width) {
      this.scrollTo(
        this.props.navigationState.index * this.props.layout.width,
        false
      );
    }
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

  private scrollViewRef: React.RefObject<
    Animated.ScrollView
  > = React.createRef();

  private jumpTo = (key: string) => {
    const { navigationState, keyboardDismissMode, onIndexChange } = this.props;

    const index = navigationState.routes.findIndex(route => route.key === key);

    if (navigationState.index === index) {
      this.scrollTo(index * this.props.layout.width);
    } else {
      onIndexChange(index);
      if (keyboardDismissMode === 'auto') {
        Keyboard.dismiss();
      }
    }
  };

  private scrollTo = (x: number, animated = true) => {
    if (this.scrollViewRef.current) {
      this.scrollViewRef.current.getNode().scrollTo({
        x,
        animated: animated,
      });
    }
  };

  private enterListeners: Listener[] = [];

  private addListener = (type: 'enter', listener: Listener) => {
    switch (type) {
      case 'enter':
        this.enterListeners.push(listener);
        break;
    }
  };

  private removeListener = (type: 'enter', listener: Listener) => {
    switch (type) {
      case 'enter': {
        const index = this.enterListeners.indexOf(listener);

        if (index > -1) {
          this.enterListeners.splice(index, 1);
        }

        break;
      }
    }
  };

  private position = new Animated.Value(this.props.navigationState.index);

  private onScroll = event([
    {
      nativeEvent: {
        contentOffset: {
          x: this.position,
        },
      },
    },
  ]);

  render() {
    const {
      children,
      layout,
      onSwipeStart,
      onSwipeEnd,
      bounces,
      navigationState,
    } = this.props;

    return children({
      position: divide(this.position, layout.width),
      addListener: this.addListener,
      removeListener: this.removeListener,
      jumpTo: this.jumpTo,
      render: children => (
        <ScrollView
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
          onScroll={this.onScroll}
          onScrollBeginDrag={onSwipeStart}
          onScrollEndDrag={onSwipeEnd}
          onMomentumScrollEnd={this.onScroll}
          contentOffset={this.initialOffset}
          style={styles.container}
          contentContainerStyle={
            layout.width
              ? {
                  flexDirection: 'row',
                  width: layout.width * navigationState.routes.length,
                }
              : null
          }
          ref={this.scrollViewRef}
        >
          {children}
        </ScrollView>
      ),
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
});
