/* @flow */

import React from 'react';
import { View } from 'react-native';
import { shallow } from 'enzyme';
import TabViewAnimated from '../src/TabViewAnimated';

it('lazyloads pages on position change', () => {
  const component = shallow(
    <TabViewAnimated
      lazy
      navigationState={{
        index: 1,
        routes: [
          { key: 'first', testID: 'first' },
          { key: 'second', testID: 'second' },
          { key: 'third', testID: 'third' },
        ],
      }}
      onIndexChange={jest.fn()}
      renderPager={() => <View testID="pager" />}
      renderHeader={() => <View testID="header" />}
      renderFooter={() => <View testID="footer" />}
      renderScene={jest.fn()}
    />
  );

  expect(component.state('loaded')).toEqual([1]);

  /* $FlowFixMe */
  component.instance()._handlePositionChange(1.3);

  expect(component.state('loaded')).toEqual([1, 2]);

  /* $FlowFixMe */
  component.instance()._handlePositionChange(0.1);

  expect(component.state('loaded')).toEqual([1, 2, 0]);
});
