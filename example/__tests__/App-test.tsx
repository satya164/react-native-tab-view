/**
 * @format
 */

import React from 'react';
import 'react-native';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// @ts-ignore
it('renders correctly', () => {
  renderer.create(<App />);
});
