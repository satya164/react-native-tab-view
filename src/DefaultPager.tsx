import React from 'react';
import Pager, { Props as ChildProps } from './Pager';
import IOSPager from './IOSPager';
import { Platform } from 'react-native';

export default function DefaultPager({
  enabledIOSScrollViewPager,
  ...rest
}: ChildProps<any>) {
  return Platform.OS === 'ios' && enabledIOSScrollViewPager ? (
    <IOSPager {...rest} />
  ) : (
    <Pager {...rest} />
  );
}
