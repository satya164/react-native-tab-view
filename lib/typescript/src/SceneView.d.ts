import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SceneRendererProps, EventEmitterProps, NavigationState, Route } from './types';
declare type Props<T extends Route> = SceneRendererProps & EventEmitterProps & {
    navigationState: NavigationState<T>;
    lazy: boolean;
    lazyPreloadDistance: number;
    index: number;
    children: (props: {
        loading: boolean;
    }) => React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
};
declare type State = {
    loading: boolean;
};
export default class SceneView<T extends Route> extends React.Component<Props<T>, State> {
    static getDerivedStateFromProps(props: Props<Route>, state: State): {
        loading: boolean;
    } | null;
    state: {
        loading: boolean;
    };
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props<T>, prevState: State): void;
    componentWillUnmount(): void;
    private unsubscribe;
    private handleEnter;
    render(): JSX.Element;
}
export {};
