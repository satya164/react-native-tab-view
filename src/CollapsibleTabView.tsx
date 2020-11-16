import React from 'react';
import {
  StyleSheet,
  Animated,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from 'react-native';

import TabView, { Props as TabViewProps } from './TabView';
import TabBar, { Props as TabBarProps } from './TabBar';
import { NavigationState, Route, SceneRendererProps } from './types';

type ScrollableView = {
  scrollTo: (params: { x?: number; y?: number; animated?: boolean }) => void;
  scrollToOffset?: never;
};

type ScrollableList = {
  scrollTo?: never;
  scrollToOffset: (params: { offset: number; animated?: boolean }) => void;
};

type ScrollRef = ScrollableView | ScrollableList;

// TODO:
// see GetRef notes below
// interface ScrollableComponent {
//   new (any): ScrollRef
// }

// TODO:
// work to be done in @types/react-native
// It should be `(instance: ScrollableComponent | null): void` [see above]
// instead of `(instance: any | null): void`
// but @types has wrong types for Animated.[FlatList | ScrollView]
// without class methods definitions. If we were using non Animated components,
// just a regular FlatList for example, it would work with the commented code
// above.
type GetRef = (instance: any | null) => void;

type Context = {
  /**
   * Current focused route.
   */
  activeRouteKey: string;
  /**
   * Animated value to track scroll position.
   */
  scrollY: Animated.Value;
  /**
   * Function to build the function a function to get
   * ref of the scrollable component for a specific route.
   */
  buildGetRef: (routeKey: string) => GetRef;
  headerHeight: number;
  tabBarHeight: number;
  onMomentumScrollBegin: (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => void;
  onScrollEndDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onMomentumScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

const CollapsibleTabViewContext = React.createContext<Context>({
  activeRouteKey: '',
  scrollY: new Animated.Value(0),
  buildGetRef: () => () => {},
  headerHeight: 0,
  tabBarHeight: 49,
  onMomentumScrollBegin: () => {},
  onScrollEndDrag: () => {},
  onMomentumScrollEnd: () => {},
});

type SceneProps = {
  /**
   * Disable scroll for unfocused routes is optional,
   * but prevents weird/delayed animations if the user changes tabs
   * and quickly start scrolling the new tab, before
   * the scrollY starting to track the new focused route.
   */
  scrollEnabled: boolean;
  /**
   * Scroll event, enabled only for the focused route.
   */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /**
   * Function to get ref from scrollable components
   * inside the scene, and track in the Tab View.
   */
  ref: GetRef;
  /**
   * Content container style with top padding with the same height
   * as the tab bar + header heights.
   */
  contentContainerStyle: {
    paddingTop: number;
  };
} & Pick<
  Context,
  'onMomentumScrollBegin' | 'onScrollEndDrag' | 'onMomentumScrollEnd'
>;

/**
 *
 * @param routeKey key of the current scene
 *
 * Get all props for the animated component
 * in order to make the collapsible tabs work.
 *
 * Works with:
 *
 * - Animated.ScrollView
 * - Animated.FlatList
 *
 * ```js
 * const sceneProps = useSceneProps('routeKey')
 * <Animated.FlatList
 *    {...sceneProps}
 *    data={data}
 *    renderItem={renderItem}
 * />
 * ```
 */
export const useSceneProps = <T extends Route>(
  routeKey: T['key']
): SceneProps => {
  const context = React.useContext(CollapsibleTabViewContext);
  if (!context) {
    throw new Error('useSceneProps must be inside a CollapsibleTabView');
  }

  const {
    activeRouteKey,
    scrollY,
    buildGetRef,
    headerHeight,
    tabBarHeight,
    ...rest
  } = context;

  const scrollEnabled = routeKey === activeRouteKey;

  const onScroll = scrollEnabled
    ? Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
      })
    : undefined;

  return {
    scrollEnabled,
    onScroll,
    ref: buildGetRef(routeKey),
    contentContainerStyle: {
      paddingTop: headerHeight + tabBarHeight,
    },
    ...rest,
  };
};

/**
 * Utility function to perform scroll on:
 * - FlatList
 * - ScrollView
 */
const scrollScene = ({
  ref,
  offset,
  animated,
}: {
  ref?: ScrollRef;
  offset: number;
  animated: boolean;
}): void => {
  if (ref?.scrollToOffset) {
    ref.scrollToOffset({
      offset,
      animated,
    });
  } else if (ref?.scrollTo) {
    ref.scrollTo({
      y: offset,
      animated,
    });
  }
};

export type Props<T extends Route> = Partial<TabViewProps<T>> &
  Pick<TabViewProps<T>, 'onIndexChange' | 'navigationState' | 'renderScene'> & {
    /**
     * Optionally controlled animated value.
     * Default is `new Animated.Value(0)`.
     */
    animatedValue?: Animated.Value;
    /**
     * Header height, default is 0.
     */
    headerHeight?: number;
    /**
     * Tab bar height, default is 49.
     */
    tabBarHeight?: number;
    /**
     * Props passed to the tab bar component.
     */
    tabBarProps?: Partial<TabBarProps<T>>;
    /**
     * Header rendered on top of the tab bar. Defaul is `() => null`
     */
    renderHeader?: () => React.ReactNode;
    /**
     * tabBarContainerStyle
     */
    tabBarContainerStyle?: Animated.WithAnimatedValue<ViewStyle>;
    /**
     * Prevent tab press if screen is gliding. Default is `true`
     */
    preventTabPressOnGliding?: boolean;
    /**
     * Disable the snap animation.
     */
    disableSnap?: boolean;
    /**
     * Same as `renderTab` of `TabViewProps`, but with the additional
     * `isGliding` property.
     */
    renderTabBar?: (
      props: SceneRendererProps & {
        navigationState: NavigationState<T>;
        isGliding: boolean;
      }
    ) => React.ReactNode;
    /**
     * Callback fired on every `renderTabBar` call,
     * useful to call layout animations if you know
     * that the height of the header or tabbar will
     * be changing often.
     *
     * Example:
     *
     * ```js
     * const renderTabBarCallback = (info) => {
     *  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
     * }
     * ```
     */
    renderTabBarCallback?: () => void;
    /**
     * Callback fired when the `headerHeight` state value inside
     * `CollapsibleTabView` will be updated in the `onLayout` event
     * from the tab/header container. Useful to be used with
     * `renderTabBarCallback` prop.
     */
    onHeaderHeightChange?: () => void;
    /**
     * Percentage of header height to make the snap effect. A number between
     * 0 and 1. Default is 0.5.
     */
    snapThreshold?: number;
  };

/**
 * `CollapsibleTabView` wraps the `TabView` and take care of animations /
 * scroll value computations. It should be used with `useSceneProps`.
 */
const CollapsibleTabView = <T extends Route>({
  animatedValue = new Animated.Value(0),
  navigationState: { index, routes },
  renderHeader = () => null,
  headerHeight: initialHeaderHeight = 0,
  tabBarHeight = 49,
  tabBarProps,
  tabBarContainerStyle,
  preventTabPressOnGliding = true,
  disableSnap = false,
  renderTabBar: customRenderTabBar,
  renderTabBarCallback,
  onHeaderHeightChange,
  snapThreshold = 0.5,
  ...tabViewProps
}: React.PropsWithoutRef<Props<T>>): React.ReactElement => {
  const [headerHeight, setHeaderHeight] = React.useState(initialHeaderHeight);
  const scrollY = React.useRef<Animated.Value>(animatedValue).current;
  const listRefArr = React.useRef<{ key: T['key']; value?: ScrollRef }[]>([]);
  const listOffset = React.useRef<{ [key: string]: number }>({});
  const isGliding = React.useRef(false);

  const [translateY, setTranslateY] = React.useState(
    headerHeight === 0
      ? 0
      : scrollY.interpolate({
          inputRange: [0, headerHeight],
          outputRange: [0, -headerHeight],
          extrapolateRight: 'clamp',
        })
  );

  React.useEffect(() => {
    scrollY.addListener(({ value }) => {
      const curRoute = routes[index].key;
      listOffset.current[curRoute] = value;
    });
    return () => {
      scrollY.removeAllListeners();
    };
  }, [routes, index, scrollY]);

  /**
   * Sync the scroll of unfocused routes to the current focused route,
   * the default behavior is to snap to 0 or the `headerHeight`, it
   * can be disabled with `disableSnap` prop.
   */
  const syncScrollOffset = React.useCallback(() => {
    const curRouteKey = routes[index].key;
    const offset = listOffset.current[curRouteKey];

    const newOffset: number | null =
      offset >= 0 && offset <= headerHeight
        ? disableSnap
          ? offset
          : offset <= headerHeight * snapThreshold
          ? 0
          : offset > headerHeight * snapThreshold
          ? headerHeight
          : null
        : null;

    listRefArr.current.forEach((item) => {
      if (newOffset !== null) {
        if ((disableSnap && item.key !== curRouteKey) || !disableSnap) {
          scrollScene({
            ref: item.value,
            offset: newOffset,
            animated: item.key === curRouteKey,
          });
        }
        if (item.key !== curRouteKey) {
          listOffset.current[item.key] = newOffset;
        }
      } else if (
        item.key !== curRouteKey &&
        (listOffset.current[item.key] < headerHeight ||
          !listOffset.current[item.key])
      ) {
        scrollScene({
          ref: item.value,
          offset: headerHeight,
          animated: false,
        });
      }
    });
  }, [routes, index, headerHeight, disableSnap, snapThreshold]);

  const onMomentumScrollBegin = () => {
    isGliding.current = true;
  };

  const onMomentumScrollEnd = () => {
    isGliding.current = false;
    syncScrollOffset();
  };

  const onScrollEndDrag = () => {
    syncScrollOffset();
  };

  /**
   * Function to be passed as ref for the scrollable animated
   * component inside the tab scene.
   *
   * One of: Animated.[SrcollView | FlatList]
   *
   * It is exposed in the context.
   */
  const buildGetRef = React.useCallback(
    (routeKey: string): GetRef => (ref) => {
      if (ref) {
        const found = listRefArr.current.find((e) => e.key === routeKey);
        if (!found) {
          listRefArr.current.push({
            key: routeKey,
            value: ref,
          });
        }
      }
    },
    []
  );

  /**
   * Get header height on layout mount/change,
   * if different from the current `headerHeight`,
   * update both the `headerHeight` and the
   * `translateY`.
   */
  const getHeaderHeight = React.useCallback(
    (event: LayoutChangeEvent) => {
      const value = event.nativeEvent.layout.height - tabBarHeight;
      if (Math.round(value * 10) / 10 !== Math.round(headerHeight * 10) / 10) {
        onHeaderHeightChange?.();
        setHeaderHeight(value);
        setTranslateY(
          headerHeight === 0
            ? 0
            : scrollY.interpolate({
                inputRange: [0, value],
                outputRange: [0, -value],
                extrapolateRight: 'clamp',
              })
        );
      }
    },
    [headerHeight, onHeaderHeightChange, scrollY, tabBarHeight]
  );

  /**
   *
   * Wraps the tab bar with `Animated.View` to
   * control the translateY property.
   *
   * Render the header with `renderHeader` prop if
   * the header height is greater than 0.
   *
   * Render the default `<TabBar />` with additional
   * `tabBarProps`, or a custom tab bar from the
   * `renderTabBar` prop, inside the Animated wrapper.
   */
  const renderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<T>;
    }
  ): React.ReactNode => {
    renderTabBarCallback?.();

    return (
      <Animated.View
        style={[
          styles.header,
          styles.tabBarContainer,
          { transform: [{ translateY }] },
          tabBarContainerStyle,
        ]}
        onLayout={getHeaderHeight}
      >
        {headerHeight > 0 && renderHeader()}
        {customRenderTabBar ? (
          customRenderTabBar({
            ...props,
            ...tabBarProps,
            isGliding: isGliding.current,
          })
        ) : (
          <TabBar
            {...props}
            {...tabBarProps}
            onTabPress={(event) => {
              if (isGliding.current && preventTabPressOnGliding) {
                event.preventDefault();
              }
              tabBarProps?.onTabPress && tabBarProps.onTabPress(event);
            }}
            style={[styles.tabBar, tabBarProps?.style]}
          />
        )}
      </Animated.View>
    );
  };

  return (
    <CollapsibleTabViewContext.Provider
      value={{
        activeRouteKey: routes[index].key,
        scrollY,
        buildGetRef,
        headerHeight,
        tabBarHeight,
        onMomentumScrollBegin,
        onScrollEndDrag,
        onMomentumScrollEnd,
      }}
    >
      <TabView
        {...tabViewProps}
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
      />
    </CollapsibleTabViewContext.Provider>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    top: 0,
    zIndex: 10000,
    position: 'absolute',
    width: '100%',
  },
  // copy from ./TabBar without background color.
  header: {
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
  tabBar: {
    elevation: undefined,
    shadowColor: undefined,
    shadowOpacity: undefined,
    shadowRadius: undefined,
    shadowOffset: undefined,
  },
});

export default CollapsibleTabView;
