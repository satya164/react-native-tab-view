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
  testID: string;
  accessibilityLabel: string;
}>;

export default class ScrollableTabBarExample extends React.Component<
  {},
  State
> {
  static title = 'Scrollable top bar';
  static backgroundColor = '#3f51b5';
  static appbarElevation = 0;

  state = {
    index: 1,
    routes: [
      {
        key: 'article',
        title: 'Article',
        testID: 'article-tab',
        accessibilityLabel: 'article-tab',
      },
      {
        key: 'contacts',
        title: 'Contacts',
        testID: 'contacts-tab',
        accessibilityLabel: 'contacts-tab',
      },
      {
        key: 'albums',
        title: 'Albums',
        testID: 'albums-tab',
        accessibilityLabel: 'albums-tab',
      },
      {
        key: 'chat',
        title: 'Chat',
        testID: 'chat-tab',
        accessibilityLabel: 'chat-tab',
      },
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
      scrollEnabled
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabStyle={styles.tab}
      labelStyle={styles.label}
    />
  );

  // tslint:disable-next-line: member-ordering
  private renderScene = SceneMap({
    albums: Albums,
    contacts: Contacts,
    article: Article,
    chat: Chat,
  });

  // tslint:disable-next-line: member-ordering
  public render() {
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
  tab: {
    width: 120,
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
  label: {
    fontWeight: '400',
  },
});
