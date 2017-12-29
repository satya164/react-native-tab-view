/* @flow */

import React, { PureComponent } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import SimplePage from './SimplePage';

import type { Route, NavigationState } from 'react-native-tab-view/types';

type State = NavigationState<
  Route<{
    key: string,
    title: string,
  }>
>;

const initialLayout = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
};

export default class TopBarTextExample extends PureComponent<*, State> {
  static title = 'Vertical';
  static appbarElevation = 0;

  state = {
    index: 1,
    routes: [
      { key: '1', title: 'First' },
      { key: '2', title: 'Second' },
      { key: '3', title: 'Third' },
      { key: '4', title: 'Fourth' },
      { key: '5', title: 'Fifth' },
      { key: '6', title: 'Sixth' },
      { key: '7', title: 'Seventh' },
      { key: '8', title: 'Eighth' },
      { key: '9', title: 'Nineth' },
      { key: '10', title: 'Tenth' },
      { key: '11', title: 'Eleventh' },
      { key: '12', title: 'Twelth' },
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

  _renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return (
          <SimplePage
            state={this.state}
            style={{ backgroundColor: '#ff4081' }}
          />
        );
      case '2':
        return (
          <SimplePage
            state={this.state}
            style={{ backgroundColor: '#673ab7' }}
          />
        );
      case '3':
        return (
          <SimplePage
            state={this.state}
            style={{ backgroundColor: '#4caf50' }}
          />
        );
      case '4':
        return (
          <SimplePage
            state={this.state}
            style={{ backgroundColor: '#2196f3' }}
          />
        );
      case '5':
        return (
          <SimplePage
            state={this.state}
            style={{ backgroundColor: '#ff4081' }}
          />
        );
      case '6':
        return (
          <SimplePage
            state={this.state}
            style={{ backgroundColor: '#673ab7' }}
          />
        );
      case '7':
        return (
          <SimplePage
            state={this.state}
            style={{ backgroundColor: '#4caf50' }}
          />
        );
      case '8':
        return (
          <SimplePage
            state={this.state}
            style={{ backgroundColor: '#2196f3' }}
          />
        );
      case '9':
        return (
          <SimplePage
            state={this.state}
            style={{ backgroundColor: '#ff4081' }}
          />
        );
      case '10':
        return (
          <SimplePage
            state={this.state}
            style={{ backgroundColor: '#673ab7' }}
          />
        );
      case '11':
        return (
          <SimplePage
            state={this.state}
            style={{ backgroundColor: '#4caf50' }}
          />
        );
      case '12':
        return (
          <SimplePage
            state={this.state}
            style={{ backgroundColor: '#2196f3' }}
          />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <TabViewAnimated
        style={[styles.container, this.props.style]}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
        vertical
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#222',
  },
  tab: {
    width: 120,
    height: 90,
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
  label: {
    color: '#fff',
    fontWeight: '400',
  },
});
