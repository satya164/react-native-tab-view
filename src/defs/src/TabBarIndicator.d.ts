import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Route, SceneRendererProps, NavigationState } from './types';
export declare type GetTabWidth = (index: number) => number;
export declare type Props<T extends Route> = SceneRendererProps & {
    navigationState: NavigationState<T>;
    width: string | number;
    style?: StyleProp<ViewStyle>;
    getTabWidth: GetTabWidth;
};
export default class TabBarIndicator<T extends Route> extends React.Component<Props<T>> {
    componentDidMount(): void;
    componentDidUpdate(): void;
    private fadeInIndicator;
    private isIndicatorShown;
    private opacity;
    private getTranslateX;
    render(): JSX.Element;
}
