import React from 'react';
import { View, Text } from 'react-native';

export default function MyPager() {
  return (
    <View style={styles.viewPager} key="1">
      <Text>Second page</Text>
    </View>
  );
}

MyPager.title = 'Native Pager';
MyPager.backgroundColor = '#263238';

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
});
