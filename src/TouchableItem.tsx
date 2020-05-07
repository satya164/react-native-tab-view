import * as React from 'react';
import {
  TouchableOpacity,
  Platform,
  View,
  StyleProp,
  StyleSheet,
  ViewStyle,
  ViewProps,
} from 'react-native';
import { TouchableNativeFeedback as RNGHTouchableNativeFeedback } from 'react-native-gesture-handler';

type Props = ViewProps & {
  onPress: () => void;
  onLongPress?: () => void;
  delayPressIn?: number;
  borderless?: boolean;
  pressColor: string;
  pressOpacity?: number;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const LOLLIPOP = 21;

export default class TouchableItem extends React.Component<Props> {
  static defaultProps = {
    pressColor: 'rgba(255, 255, 255, .4)',
  };

  render() {
    const {
      style,
      pressOpacity,
      pressColor,
      borderless,
      children,
      ...rest
    } = this.props;

    if (Platform.OS === 'android' && Platform.Version >= LOLLIPOP) {
      return (
        <View style={styles.outerContainer}>
          <RNGHTouchableNativeFeedback
            {...rest}
            background={{
              borderless,
              color: pressColor,
              type: 'Ripple',
            }}
            containerStyle={styles.container}
            style={styles.button}
          >
            <View style={style}>{React.Children.only(children)}</View>
          </RNGHTouchableNativeFeedback>
        </View>
      );
    } else {
      return (
        <TouchableOpacity {...rest} style={style} activeOpacity={pressOpacity}>
          {children}
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  outerContainer: {
    borderRadius: 100,
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
});
