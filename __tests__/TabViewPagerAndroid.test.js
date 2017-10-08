/* @flow */

import * as React from 'react';
import { shallow } from 'enzyme';
import { Animated, View } from 'react-native';
import TabViewPagerAndroid from '../src/TabViewPagerAndroid';

it('renders all children', () => {
  const component = shallow(
    <TabViewPagerAndroid
      layout={{ height: 320, width: 240, measured: false }}
      navigationState={{
        index: 1,
        routes: [
          { key: 'first', testID: 'first' },
          { key: 'second', testID: 'second' },
          { key: 'third', testID: 'third' },
        ],
      }}
      position={new Animated.Value(1)}
      jumpToIndex={jest.fn()}
      getLastPosition={jest.fn()}
      subscribe={jest.fn()}
      panX={new Animated.Value(0)}
      offsetX={new Animated.Value(0)}
      useNativeDriver={false}
    >
      <View />
      <View />
      <View />
    </TabViewPagerAndroid>
  );

  expect(component.children().length).toBe(3);
  expect(component.find({ testID: 'first' }).length).toBe(1);
  expect(component.find({ testID: 'second' }).length).toBe(1);
  expect(component.find({ testID: 'third' }).length).toBe(1);
});

it('initial page is same as navigation state index', () => {
  const component = shallow(
    <TabViewPagerAndroid
      layout={{ height: 320, width: 240, measured: false }}
      navigationState={{
        index: 2,
        routes: [
          { key: 'first', testID: 'first' },
          { key: 'second', testID: 'second' },
          { key: 'third', testID: 'third' },
        ],
      }}
      position={new Animated.Value(1)}
      jumpToIndex={jest.fn()}
      getLastPosition={jest.fn()}
      subscribe={jest.fn()}
      panX={new Animated.Value(0)}
      offsetX={new Animated.Value(0)}
      useNativeDriver={false}
    >
      <View />
      <View />
      <View />
    </TabViewPagerAndroid>
  );

  expect(component.dive().instance().props.initialPage).toBe(2);
});
