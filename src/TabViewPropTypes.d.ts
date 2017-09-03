/* @flow */

import { Requireable } from 'prop-types'
import { Animated } from 'react-native'

export type NavigationRouteType = {
  title: string
  key: string
}
export const NavigationRoutePropType: Requireable<NavigationRouteType>

type NavigationStateType = {
  routes: Array<NavigationRouteType>
  index: number
}
export const NavigationStatePropType: Requireable<NavigationStateType>

export const SceneRendererPropType: {
  layout: Requireable<{
    measured: boolean
    height: number
    width: number
  }>
  navigationState: Requireable<NavigationStateType>
  position: Requireable<Animated.Value>
  jumpToIndex: Requireable<(index: number) => void>
  getLastPosition: Requireable<() => number>
  subscribe: Requireable<() => void>
}
