/* @flow */

import * as React from 'react';
import { shallow } from 'enzyme';
import { Animated, View } from 'react-native';
import TabViewPagerScroll from '../src/TabViewPagerScroll';

it('renders only focused child until layout', () => {
  /* $FlowFixMe */
  console.error = jest.fn(); // suppress propType warnings

  const component = shallow(
    <TabViewPagerScroll
      layout={{ height: 0, width: 0, measured: false }}
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
    </TabViewPagerScroll>
  );

  expect(
    component
      .find({ testID: 'first' })
      .first()
      .props().children
  ).toBe(null);
  expect(
    component
      .find({ testID: 'second' })
      .first()
      .props().children
  ).not.toBe(null);
  expect(
    component
      .find({ testID: 'third' })
      .first()
      .props().children
  ).toBe(null);

  component.setProps({
    layout: { height: 320, width: 240, measured: false },
  });

  expect(
    component
      .find({ testID: 'first' })
      .first()
      .props().children
  ).not.toBe(null);
  expect(
    component
      .find({ testID: 'second' })
      .first()
      .props().children
  ).not.toBe(null);
  expect(
    component
      .find({ testID: 'third' })
      .first()
      .props().children
  ).not.toBe(null);
});

it('sets initial scroll position according to navigation state index', () => {
  /* $FlowFixMe */
  console.error = jest.fn(); // suppress propType warnings

  const component = shallow(
    <TabViewPagerScroll
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
    </TabViewPagerScroll>
  );

  expect(component.dive().instance().props.contentOffset).toEqual({
    x: 240 * 2,
    y: 0,
  });
});
