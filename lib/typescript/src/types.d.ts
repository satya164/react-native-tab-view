import type { Animated } from 'react-native';
import type { PagerViewProps } from 'react-native-pager-view';
export declare type Route = {
    key: string;
    icon?: string;
    title?: string;
    accessible?: boolean;
    accessibilityLabel?: string;
    testID?: string;
};
export declare type Event = {
    defaultPrevented: boolean;
    preventDefault(): void;
};
export declare type Scene<T extends Route> = {
    route: T;
};
export declare type NavigationState<T extends Route> = {
    index: number;
    routes: T[];
};
export declare type Layout = {
    width: number;
    height: number;
};
export declare type Listener = (value: number) => void;
export declare type SceneRendererProps = {
    layout: Layout;
    position: Animated.AnimatedInterpolation;
    jumpTo: (key: string) => void;
};
export declare type EventEmitterProps = {
    addEnterListener: (listener: Listener) => () => void;
};
export declare type PagerProps = Omit<PagerViewProps, 'initialPage' | 'scrollEnabled' | 'onPageScroll' | 'onPageSelected' | 'onPageScrollStateChanged' | 'keyboardDismissMode' | 'children'> & {
    keyboardDismissMode?: 'none' | 'on-drag' | 'auto';
    swipeEnabled?: boolean;
    onSwipeStart?: () => void;
    onSwipeEnd?: () => void;
};
