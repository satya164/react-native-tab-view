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

const animateOnIndexChange = (currentIndex: number, nextIndex: number) => {
  return Math.abs(currentIndex - nextIndex) === 1;
};

const CustomAnimationExample = () => {
  const [index, onIndexChange] = React.useState(1);
  const [routes] = React.useState([
    { key: 'article', title: 'Article' },
    { key: 'contacts', title: 'Contacts' },
    { key: 'albums', title: 'Albums' },
    { key: 'chat', title: 'Chat' },
  ]);

  const renderTabBar = (
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

  const renderScene = SceneMap({
    albums: Albums,
    contacts: Contacts,
    article: Article,
    chat: Chat,
  });

  return (
    <TabView
      lazy
      navigationState={{
        index,
        routes,
      }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={onIndexChange}
      animateOnIndexChange={animateOnIndexChange}
    />
  );
};

CustomAnimationExample.title = 'Custom Animation';
CustomAnimationExample.backgroundColor = '#3f51b5';
CustomAnimationExample.appbarElevation = 0;

export default CustomAnimationExample;

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#3f51b5',
  },
  tab: {
    width: 'auto',
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
  label: {
    fontWeight: '400',
  },
});
