// tslint:disable: ordered-imports
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  TabView,
  TabBar,
  SceneMap,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import Albums from './Shared/Albums';
import Article from './Shared/Article';
import Contacts from './Shared/Contacts';

interface Route {
  key: string;
  icon: string;
  color: [number, number, number];
  testID: string;
}

type State = NavigationState<Route>;

export default class CustomIndicatorExample extends React.Component<{}, State> {
  public static title = 'Custom indicator';
  public static backgroundColor = '#263238';
  public static appbarElevation = 4;

  public state: State = {
    index: 0,
    routes: [
      {
        key: 'article',
        icon: 'ios-paper',
        color: [244, 67, 54],
        testID: 'article-tab',
      },
      {
        key: 'contacts',
        icon: 'ios-people',
        color: [0, 132, 255],
        testID: 'contacts-tab',
      },
      {
        key: 'albums',
        icon: 'ios-albums',
        color: [76, 175, 80],
        testID: 'albums-tab',
      },
    ],
  };

  private renderScene = SceneMap({
    article: Article,
    contacts: Contacts,
    albums: Albums,
  });

  private handleIndexChange = (index: number) =>
    this.setState({
      index,
    });

  private renderIndicator = (
    props: SceneRendererProps & { navigationState: State; width: number }
  ) => {
    const { width, position, navigationState } = props;
    const inputRange = [
      0,
      0.48,
      0.49,
      0.51,
      0.52,
      1,
      1.48,
      1.49,
      1.51,
      1.52,
      2,
    ];

    const scale = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map(x => (Math.trunc(x) === x ? 2 : 0.1)),
    });

    const opacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map(x => {
        const d = x - Math.trunc(x);
        return d === 0.49 || d === 0.51 ? 0 : 1;
      }),
    });

    const translateX = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map(x => Math.round(x) * width),
    });

    const backgroundColor = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map(x =>
        Animated.color(...navigationState.routes[Math.round(x)].color)
      ),
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
          style={[
            styles.indicator,
            { opacity, backgroundColor, transform: [{ scale }] } as any,
          ]}
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

  // tslint:disable-next-line: member-ordering
  public render() {
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
