/* @flow */

import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  TabView,
  TabBar,
  SceneMap,
  type Route,
  type NavigationState,
} from 'react-native-tab-view';
import Albums from './shared/Albums';
import Article from './shared/Article';
import Chat from './shared/Chat';

type State = NavigationState<
  Route<{
    key: string,
    title: string,
  }>
>;

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const SampleSection1 = () => (
  <View style={[styles.container, { backgroundColor: '#ff4081' }]} />
);

const SampleSection2 = () => (
  <View style={[styles.container, { backgroundColor: '#673ab7' }]} />
);

const SampleSection3 = () => (
  <View style={[styles.container, { backgroundColor: '#219a19' }]} />
);

export default class DynamicWidthExample extends React.Component<*, State> {
  static title = 'Dynamic Width Tab Bar';
  static backgroundColor = '#f44336';
  static appbarElevation = 0;

  state = {
    index: 1,
    routes: [
      { key: 'article', title: 'Article' },
      { key: 'albums', title: 'Albums' },
      { key: 'chat', title: 'Chat' },
      { key: 'l_title', title: 'Long Title' },
      { key: 'el_title', title: 'Extra Long Title' },
      { key: 'sel_title', title: 'Super Extra Long Title' },
    ],
  };

  _handleIndexChange = index =>
    this.setState({
      index,
    });

  _renderTabBar = props => (
    <TabBar
      {...props}
      style={styles.tabbar}
      labelStyle={styles.label}
      dynamicWidth
      scrollEnabled
    />
  );

  _renderScene = SceneMap({
    article: Article,
    albums: Albums,
    chat: Chat,
    l_title: SampleSection1,
    el_title: SampleSection2,
    sel_title: SampleSection3,
  });

  render() {
    return (
      <TabView
        style={[styles.container, this.props.style]}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#f44336',
  },
  label: {
    color: '#fff',
    fontWeight: '400',
  },
});
