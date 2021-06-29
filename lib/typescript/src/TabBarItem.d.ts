import * as React from 'react';
import { Animated, StyleProp, LayoutChangeEvent, TextStyle, ViewStyle } from 'react-native';
import { Scene, Route, NavigationState } from './types';
export declare type Props<T extends Route> = {
    position: Animated.AnimatedInterpolation;
    route: T;
    navigationState: NavigationState<T>;
    activeColor?: string;
    inactiveColor?: string;
    pressColor?: string;
    pressOpacity?: number;
    getLabelText: (scene: Scene<T>) => string | undefined;
    getAccessible: (scene: Scene<T>) => boolean | undefined;
    getAccessibilityLabel: (scene: Scene<T>) => string | undefined;
    getTestID: (scene: Scene<T>) => string | undefined;
    renderLabel?: (scene: {
        route: T;
        focused: boolean;
        color: string;
    }) => React.ReactNode;
    renderIcon?: (scene: {
        route: T;
        focused: boolean;
        color: string;
    }) => React.ReactNode;
    renderBadge?: (scene: Scene<T>) => React.ReactNode;
    onLayout?: (event: LayoutChangeEvent) => void;
    onPress: () => void;
    onLongPress: () => void;
    labelStyle?: StyleProp<TextStyle>;
    style: StyleProp<ViewStyle>;
};
export default class TabBarItem<T extends Route> extends React.Component<Props<T>> {
    private getActiveOpacity;
    private getInactiveOpacity;
    render(): JSX.Element;
}
