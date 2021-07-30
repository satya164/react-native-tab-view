import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { TabView } from 'react-native-tab-view';
import * as React from 'react';

const ChildDictateHeightExmple = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: '1', title: 'Tab 1' },
    { key: '2', title: 'Tab 2' },
  ]);

  const renderScene = React.useCallback(({ route }) => Scenes({ route }), []);
  return (
    <ScrollView>
      <View style={styles.topView}>
        <Text>Some Content Top (not a tabview content)</Text>
      </View>
      <TabView
        style={styles.tabView}
        lazy
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />

      <View style={styles.bottomView}>
        <Text>Some Content Bottom (not a tabview content)</Text>
      </View>
    </ScrollView>
  );
};

const Scenes = ({ route }: any) => {
  switch (route.key) {
    case '1':
      return <Text>TabView Tab 1 content: Simple short text</Text>;

    case '2':
      return (
        <Text>
          TabView Tab 2 content: Lorem Ipsum is simply dummy text of the
          printing and typesetting industry. Lorem Ipsum has been the industrys
          standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book.{' '}
        </Text>
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  tabView: {
    backgroundColor: 'white',
  },
  topView: {
    height: 250,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomView: {
    minHeight: 300,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

ChildDictateHeightExmple.title = 'Child Dictate Height';
ChildDictateHeightExmple.backgroundColor = '#000';
ChildDictateHeightExmple.appbarElevation = 0;

export default ChildDictateHeightExmple;
