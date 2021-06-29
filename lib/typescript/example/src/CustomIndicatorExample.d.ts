import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationState } from 'react-native-tab-view';
declare type Route = {
    key: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
};
declare type State = NavigationState<Route>;
export default class CustomIndicatorExample extends React.Component<{}, State> {
    static title: string;
    static backgroundColor: string;
    static appbarElevation: number;
    state: State;
    private handleIndexChange;
    private renderIndicator;
    private renderIcon;
    private renderBadge;
    private renderTabBar;
    private renderScene;
    render(): JSX.Element;
}
export {};
