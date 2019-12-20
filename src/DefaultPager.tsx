import React from 'react';
import Pager, { Props as ChildProps } from './Pager';
import IOSPager from './IOSPager';
import { Platform, Animated } from 'react-native';

export default function DefaultPager(props: ChildProps<any>) {
  if (Platform.OS === 'ios' && props.enabledIOSScrollViewPager) {
    return (
      <IOSPager
        {...props}
        horizontal
        panX={new Animated.Value(0)}
        offsetX={
          new Animated.Value(props.navigationState.index * props.layout.width)
        }
        children={props.navigationState.routes.map(route => {
          let scene = props.renderScene({
            ...props,
            route,
          });
          if (React.isValidElement(scene)) {
            scene = React.cloneElement(scene, { key: route.key });
          }

          return scene;
        })}
      />
    );
  } else {
    return <Pager {...props} />;
  }
}
