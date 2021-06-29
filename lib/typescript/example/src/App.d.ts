import * as React from 'react';
declare type State = {
    title: string;
    index: number;
    restoring: boolean;
};
export default class ExampleList extends React.Component<any, State> {
    state: {
        title: string;
        index: number;
        restoring: boolean;
    };
    componentDidMount(): void;
    private persistNavigationState;
    private restoreNavigationState;
    private handleNavigate;
    private handleNavigateBack;
    private renderItem;
    render(): JSX.Element | null;
}
export {};
