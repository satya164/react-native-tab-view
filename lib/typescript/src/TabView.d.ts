import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Layout, NavigationState, Route, SceneRendererProps, PagerProps } from './types';
export declare type Props<T extends Route> = PagerProps & {
    onIndexChange: (index: number) => void;
    navigationState: NavigationState<T>;
    renderScene: (props: SceneRendererProps & {
        route: T;
    }) => React.ReactNode;
    renderLazyPlaceholder?: (props: {
        route: T;
    }) => React.ReactNode;
    renderTabBar?: (props: SceneRendererProps & {
        navigationState: NavigationState<T>;
    }) => React.ReactNode;
    tabBarPosition?: 'top' | 'bottom';
    initialLayout?: Partial<Layout>;
    lazy?: ((props: {
        route: T;
    }) => boolean) | boolean;
    lazyPreloadDistance?: number;
    sceneContainerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
};
export default function TabView<T extends Route>({ onIndexChange, navigationState, renderScene, initialLayout, keyboardDismissMode, lazy, lazyPreloadDistance, onSwipeStart, onSwipeEnd, renderLazyPlaceholder, renderTabBar, sceneContainerStyle, style, swipeEnabled, tabBarPosition, }: Props<T>): JSX.Element;
