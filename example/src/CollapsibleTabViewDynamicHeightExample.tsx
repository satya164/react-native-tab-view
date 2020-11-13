import React from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import CollapsibleTabView, {
  HEADER_HEIGHT as INITIAL_HEADER_HEIGHT,
} from './CollapsibleTabViewExample';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Header: React.FC<{ height: number; onPress: () => void }> = ({
  height,
  onPress,
}) => {
  return (
    <View style={[styles.header, { height }]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.headerText}>Press to resize</Text>
      </TouchableOpacity>
    </View>
  );
};

const configureNextLayoutAnimation = () =>
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

const CollapsibleTabViewExampleComponent: React.FC<object> = () => {
  const [height, setHeight] = React.useState(INITIAL_HEADER_HEIGHT);

  const renderHeader = () => (
    <Header
      height={height}
      onPress={() => {
        configureNextLayoutAnimation();
        if (height > INITIAL_HEADER_HEIGHT) {
          setHeight(INITIAL_HEADER_HEIGHT);
        } else {
          setHeight(height + 100);
        }
      }}
    />
  );

  return (
    <CollapsibleTabView
      renderHeader={renderHeader}
      onHeaderHeightChange={configureNextLayoutAnimation}
    />
  );
};

export default class CollapsibleTabViewExample extends React.Component<{}, {}> {
  static title = 'Collapsible Tab View dynamic height';
  static backgroundColor = '#3f51b5';
  static appbarElevation = 0;

  render() {
    return <CollapsibleTabViewExampleComponent />;
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#3f51b5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
  },
});
