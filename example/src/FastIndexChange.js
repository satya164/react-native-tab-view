/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { TabView, TabBar, type NavigationState } from 'react-native-tab-view';

const FirstRoute = ({ active }) => (
  <View style={[styles.scene, { backgroundColor: active ? 'pink' : '#fff' }]} />
);

const SecondRoute = ({ active }) => (
  <View style={[styles.scene, { backgroundColor: active ? 'pink' : '#fff' }]} />
);

const ThirdScene = ({ active }) => (
  <View style={[styles.scene, { backgroundColor: active ? 'pink' : '#fff' }]} />
);

type State = NavigationState<{
  key: string,
  title: string,
}>;

export default class FastIndexChangeExample extends React.Component<*, State> {
  static title = 'Fast index change';
  static backgroundColor = '#2196f3';
  static tintColor = '#fff';
  static appbarElevation = 0;
  static statusBarStyle = 'light-content';

  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'First' },
      { key: 'second', title: 'Second' },
      { key: 'third', title: 'Third' },
    ],
  };

  _renderScene = ({ route }) => {
    if (route.key === 'first') {
      return <FirstRoute active={this.state.index === 0} />;
    }
    if (route.key === 'second') {
      return <SecondRoute active={this.state.index === 1} />;
    }
    if (route.key === 'third') {
      return <ThirdScene active={this.state.index === 2} />;
    }
  };

  _handleIndexChange = index => this.setState({ index });

  _renderTabBar = props => <TabBar {...props} scrollEnabled />;

  render() {
    return (
      <TabView
        style={this.props.style}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
