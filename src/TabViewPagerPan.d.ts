/* @flow */

import { PureComponent } from 'react'
import { Animated } from 'react-native'
import {
  SceneRendererProps,
  Route,
  TransitionConfigurator,
  RouteBase
} from './TabViewTypeDefinitions'

type GestureEvent = {
  nativeEvent: {
    changedTouches: Array<any>
    identifier: number
    locationX: number
    locationY: number
    pageX: number
    pageY: number
    target: number
    timestamp: number
    touches: Array<any>
  }
}

type GestureState = {
  stateID: number
  moveX: number
  moveY: number
  x0: number
  y0: number
  dx: number
  dy: number
  vx: number
  vy: number
  numberActiveTouches: number
}

type GestureHandler = (event: GestureEvent, state: GestureState) => void

type DefaultProps = {
  configureTransition: TransitionConfigurator
  swipeDistanceThreshold: number
  swipeVelocityThreshold: number
}

type Props<T extends RouteBase> = SceneRendererProps<T> & {
  configureTransition?: TransitionConfigurator
  animationEnabled?: boolean
  swipeEnabled?: boolean
  swipeDistanceThreshold?: number
  swipeVelocityThreshold?: number
  onSwipeStart?: GestureHandler
  onSwipeEnd?: GestureHandler
  children?: React.ReactNode
}

type DefaultTransitionSpec = {
  timing: typeof Animated.spring
  tension: 300
  friction: 35
}

export default class TabViewPagerPan<
  T extends Route<RouteBase>
> extends PureComponent<Props<T>, void> {
  static defaultProps: {
    configureTransition: () => DefaultTransitionSpec
    initialLayout: {
      height: 0
      width: 0
    }
    swipeDistanceThreshold: 120
    swipeVelocityThreshold: 0.25
  }
}
