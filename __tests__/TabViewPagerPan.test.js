/* @flow */

import React from 'react';
import { shallow } from 'enzyme';
import {
  Animated,
  View,
} from 'react-native';
import TabViewPagerPan from '../src/TabViewPagerPan';

it('renders all children', () => {
  const component = shallow(
    <TabViewPagerPan
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
    >
      <View />
      <View />
      <View />
    </TabViewPagerPan>
  );

  expect(component.children().length).toBe(3);
  expect(component.find({ testID: 'first' }).length).toBe(1);
  expect(component.find({ testID: 'second' }).length).toBe(1);
  expect(component.find({ testID: 'third' }).length).toBe(1);
});
