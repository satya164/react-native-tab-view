/* @flow */

import * as React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import Article from './shared/Article';
import Albums from './shared/Albums';
import Chat from './shared/Chat';
import Contacts from './shared/Contacts';

import type { Route, NavigationState } from 'react-native-tab-view/types';

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

export default class TopBarTextExample extends React.Component<*, State> {
  static title = 'Scrollable top bar';
  static backgroundColor = '#3f51b5';
  static appbarElevation = 0;

  state = {
    index: 1,
    routes: [
      { key: 'article', title: 'Article' },
      { key: 'contacts', title: 'Contacts' },
      { key: 'albums', title: 'Albums' },
      { key: 'chat1', title: 'Chat' },
      { key: 'article2', title: 'Article' },
      { key: 'contacts3', title: 'Contacts' },
      { key: 'albums4', title: 'Albums' },
      { key: 'chat5', title: 'Chat' },
      { key: 'article6', title: 'Article' },
      { key: 'contacts7', title: 'Contacts' },
      { key: 'albums8', title: 'Albums' },
      { key: 'chat9', title: 'Chat' },
      { key: 'article11', title: 'Article' },
      { key: 'contacts12', title: 'Contacts' },
      { key: 'albums13', title: 'Albums' },
      { key: 'chat14', title: 'Chat' },
      { key: 'article15', title: 'Article' },
      { key: 'contacts21', title: 'Contacts' },
      { key: 'albums22', title: 'Albums' },
      { key: 'chat222', title: 'Chat' },
      { key: 'article23', title: 'Article' },
      { key: 'contacts24', title: 'Contacts' },
      { key: 'albums25', title: 'Albums' },
      { key: 'chat26', title: 'Chat' },
      { key: 'article27', title: 'Article' },
      { key: 'contacts233', title: 'Contacts' },
      { key: 'albums23322', title: 'Albums' },
      { key: 'chat222222', title: 'Chat' },
    ],
  };

  _handleIndexChange = index =>
    this.setState({
      index,
    });

  _renderHeader = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabStyle={styles.tab}
      labelStyle={styles.label}
    />
  );

  _renderScene = ({ route }: any) => {
    if (Math.abs(this.state.index - this.state.routes.indexOf(route)) > 2) {
      return null;
    }

    if (this.state.index == 0) {
    return (<Albums></Albums>);
    } else if (this.state.index == 1) {
    return (<Article></Article>);
    } else {
    return (<Chat></Chat>);
    }

  }

  render() {
    return (
      <TabViewAnimated
        style={[styles.container, this.props.style]}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    color: '#fff',
    fontWeight: '400',
  },
});
