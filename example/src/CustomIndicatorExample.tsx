import * as React from 'react';
import { Animated, View, Text, StyleSheet, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  TabView,
  TabBar,
  SceneMap,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';
import Albums from './Shared/Albums';
import Article from './Shared/Article';
import Contacts from './Shared/Contacts';

type Route = {
  key: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

type State = NavigationState<Route>;

export default class CustomIndicatorExample extends React.Component<{}, State> {
  // eslint-disable-next-line react/sort-comp
  static title = 'Custom indicator';
  static backgroundColor = '#263238';
  static appbarElevation = 4;

  state: State = {
    index: 0,
    routes: [
      {
        key: 'article',
        icon: 'ios-document',
      },
      {
        key: 'contacts',
        icon: 'ios-people',
      },
      {
        key: 'albums',
        icon: 'ios-albums',
      },
    ],
  };

  private handleIndexChange = (index: number) =>
    this.setState({
      index,
    });

  private renderIndicator = (
    props: SceneRendererProps & {
      navigationState: State;
      getTabWidth: (i: number) => number;
    }
  ) => {
    const { position, navigationState, getTabWidth } = props;
    const inputRange = [
      0, 0.48, 0.49, 0.51, 0.52, 1, 1.48, 1.49, 1.51, 1.52, 2,
    ];

    const scale = position.interpolate({
      inputRange,
      outputRange: inputRange.map((x) => (Math.trunc(x) === x ? 2 : 0.1)),
    });

    const opacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map((x) => {
        const d = x - Math.trunc(x);
        return d === 0.49 || d === 0.51 ? 0 : 1;
      }),
    });

    const translateX = position.interpolate({
      inputRange: inputRange,
      outputRange: inputRange.map((x) => {
        const i = Math.round(x);
        return i * getTabWidth(i) * (I18nManager.isRTL ? -1 : 1);
      }),
    });

    return (
      <Animated.View
        style={[
          styles.container,
          {
            width: `${100 / navigationState.routes.length}%`,
            transform: [{ translateX }] as any,
          },
        ]}
      >
        <Animated.View
          style={[styles.indicator, { opacity, transform: [{ scale }] } as any]}
        />
      </Animated.View>
    );
  };

  private renderIcon = ({ route }: { route: Route }) => (
    <Ionicons name={route.icon} size={24} style={styles.icon} />
  );

  private renderBadge = ({ route }: { route: Route }) => {
    if (route.key === 'albums') {
      return (
        <View style={styles.badge}>
          <Text style={styles.count}>42</Text>
        </View>
      );
    }
    return null;
  };

  private renderTabBar = (
    props: SceneRendererProps & { navigationState: State }
  ) => (
    <TabBar
      {...props}
      renderIcon={this.renderIcon}
      renderBadge={this.renderBadge}
      renderIndicator={this.renderIndicator}
      style={styles.tabbar}
    />
  );

  private renderScene = SceneMap({
    article: Article,
    contacts: Contacts,
    albums: Albums,
  });

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this.renderScene}
        renderTabBar={this.renderTabBar}
        tabBarPosition="bottom"
        onIndexChange={this.handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#263238',
    overflow: 'hidden',
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    backgroundColor: 'rgb(0, 132, 255)',
    width: 48,
    height: 48,
    borderRadius: 24,
    margin: 6,
  },
  badge: {
    marginTop: 4,
    marginRight: 32,
    backgroundColor: '#f44336',
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
