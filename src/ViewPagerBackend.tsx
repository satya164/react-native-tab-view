import * as React from 'react';
import { Keyboard } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import Animated from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

import {
  Layout,
  NavigationState,
  Route,
  Listener,
  PagerCommonProps,
  EventEmitterProps,
} from './types';

const AnimatedViewPager = Animated.createAnimatedComponent(ViewPager);

type Props<T extends Route> = PagerCommonProps & {
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
  orientation?: 'vertical' | 'horizontal';
  transitionStyle?: 'scroll' | 'curl';
};

const { event, add } = Animated;

export default class ViewPagerBackend<T extends Route> extends React.Component<
  Props<T>
> {
  static defaultProps = {
    onIndexChange: () => {},
    swipeEnabled: true,
  };

  private enterListeners: Listener[] = [];

  private jumpToIndex = (index: number) => {
    // If the index changed, we need to trigger a tab switch
    // this.isSwipeGesture.setValue(FALSE);
    this.ref.current.getNode().setPage(index);
  };

  private jumpTo = (key: string) => {
    const { navigationState, keyboardDismissMode, onIndexChange } = this.props;
    const index = navigationState.routes.findIndex(
      (route: { key: string }) => route.key === key
    );

    // A tab switch might occur when we're in the middle of a transition
    // In that case, the index might be same as before
    // So we conditionally make the pager to update the position
    if (navigationState.index !== index) {
      onIndexChange(index);
      this.jumpToIndex(index);

      // When the index changes, the focused input will no longer be in current tab
      // So we should dismiss the keyboard
      if (keyboardDismissMode === 'auto') {
        Keyboard.dismiss();
      }
    }
  };

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

  private currentIndex = new Animated.Value(this.props.navigationState.index);
  private offset = new Animated.Value(0);

  private onPageScroll = event([
    {
      nativeEvent: {
        position: this.currentIndex,
        offset: this.offset,
      },
    },
  ]);

  onPageScrollStateChanged = (state: 'Idle' | 'Dragging' | 'Settling') => {
    switch (state) {
      case 'Settling':
        this.props.onSwipeEnd && this.props.onSwipeEnd();
        return;
      case 'Dragging':
        this.props.onSwipeStart && this.props.onSwipeStart();
        return;
    }
  };

  ref = React.createRef<any>();

  render() {
    const {
      keyboardDismissMode,
      swipeEnabled,
      onIndexChange,
      children,
      orientation,
      transitionStyle,
    } = this.props;

    return children({
      position: add(this.currentIndex, this.offset),
      addListener: this.addListener,
      removeListener: this.removeListener,
      jumpTo: this.jumpTo,
      render: children => (
        <AnimatedViewPager
          ref={this.ref}
          lazy={false}
          style={{ flex: 1 }}
          initialPage={this.props.navigationState.index}
          keyboardDismissMode={
            // ViewPager does not accept auto mode
            keyboardDismissMode === 'auto' ? 'on-drag' : keyboardDismissMode
          }
          onPageScroll={this.onPageScroll}
          onPageSelected={(e: { nativeEvent: { position: number } }) =>
            onIndexChange(e.nativeEvent.position)
          }
          onPageScrollStateChanged={this.onPageScrollStateChanged}
          scrollEnabled={swipeEnabled}
          orientation={orientation}
          transitionStyle={transitionStyle}
        >
          {children}
        </AnimatedViewPager>
      ),
    });
  }
}
