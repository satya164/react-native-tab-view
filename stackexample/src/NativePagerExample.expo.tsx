import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ViewPager from '@react-native-community/viewpager';

export default function MyPager() {
  return (
    <ViewPager style={styles.viewPager} initialPage={0}>
      <View key="1">
        <Text>First page</Text>
      </View>
      <View key="2">
        <Text>Second page</Text>
      </View>
    </ViewPager>
  );
}

MyPager.title = 'Native Pager';
MyPager.backgroundColor = '#263238';
MyPager.appbarElevation = 4;

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
});
