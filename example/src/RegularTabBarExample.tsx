import * as React from 'react';
import { StyleSheet } from 'react-native';
import {
  TabView,
  TabBar,
  SceneMap,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';
import Article from './Shared/Article';
import Albums from './Shared/Albums';
import Chat from './Shared/Chat';
import Contacts from './Shared/Contacts';

type State = NavigationState<{
  key: string;
  title: string;
}>;

export default class RegularTabBarExample extends React.Component<{}, State> {
  static title = 'Regular top bar';
  static backgroundColor = '#3f51b5';
  static appbarElevation = 0;

  state = {
    index: 0,
    routes: [
      { key: 'article', title: 'Article' },
      { key: 'contacts', title: 'Contacts' },
      { key: 'albums', title: 'Albums' },
    ],
  };

  private handleIndexChange = (index: number) =>
    this.setState({
      index,
    });

  private renderTabBar = (
    props: SceneRendererProps & { navigationState: State }
  ) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      labelStyle={styles.label}
    />
  );

  private renderScene = SceneMap({
    albums: Albums,
    contacts: Contacts,
    article: Article,
    chat: Chat,
  });

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this.renderScene}
        renderTabBar={this.renderTabBar}
        onIndexChange={this.handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#3f51b5',
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
  label: {
    fontWeight: '400',
  },
});
