import * as React from 'react';
import { NavigationState } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';
declare type Route = {
    key: string;
    title: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
};
declare type State = NavigationState<Route>;
export default class CustomTabBarExample extends React.Component<{}, State> {
    static title: string;
    static backgroundColor: string;
    static tintColor: string;
    static appbarElevation: number;
    static statusBarStyle: "dark-content";
    state: State;
    private handleIndexChange;
    private renderItem;
    private renderTabBar;
    private renderScene;
    render(): JSX.Element;
}
export {};
