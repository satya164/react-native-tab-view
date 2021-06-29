import * as React from 'react';
import { NavigationState } from 'react-native-tab-view';
declare type State = NavigationState<{
    key: string;
    title: string;
}>;
export default class ScrollableTabBarExample extends React.Component<{}, State> {
    static title: string;
    static backgroundColor: string;
    static appbarElevation: number;
    state: {
        index: number;
        routes: {
            key: string;
            title: string;
        }[];
    };
    private handleIndexChange;
    private renderTabBar;
    private renderScene;
    render(): JSX.Element;
}
export {};
