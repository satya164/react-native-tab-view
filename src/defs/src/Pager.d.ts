import * as React from 'react';
import { Animated } from 'react-native';
import { NavigationState, Route, Layout, EventEmitterProps, PagerProps } from './types';
declare type Props<T extends Route> = PagerProps & {
    layout: Layout;
    onIndexChange: (index: number) => void;
    navigationState: NavigationState<T>;
    children: (props: EventEmitterProps & {
        position: Animated.AnimatedInterpolation;
        render: (children: React.ReactNode) => React.ReactNode;
        jumpTo: (key: string) => void;
    }) => React.ReactElement;
};
export default function Pager<T extends Route>({ layout, keyboardDismissMode, swipeEnabled, navigationState, onIndexChange, onSwipeStart, onSwipeEnd, children, style, }: Props<T>): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
export {};
