/* @flow */

import { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Animated, StyleProp, ViewStyle } from 'react-native'
import {
  Scene,
  SceneRendererProps,
  Route,
  RouteBase
} from './TabViewTypeDefinitions'

type IndicatorProps<T extends RouteBase> = SceneRendererProps<T> & {
  width: Animated.Value
}

type ScrollEvent = {
  nativeEvent: {
    contentOffset: {
      x: number
    }
  }
}

type DefaultProps<T> = {
  getLabelText: (scene: Scene<T>) => string | undefined | null
}

type Props<T extends RouteBase> = SceneRendererProps<T> & {
  scrollEnabled?: boolean
  pressColor?: string
  pressOpacity?: number
  getLabelText?: (scene: Scene<T>) => string | undefined | null
  renderLabel?: (scene: Scene<T>) => React.ReactNode
  renderIcon?: (scene: Scene<T>) => React.ReactNode
  renderBadge?: (scene: Scene<T>) => React.ReactNode
  renderIndicator?: (props: IndicatorProps<T>) => React.ReactNode
  onTabPress?: (scene: Scene<T>) => void
  tabStyle?: StyleProp<ViewStyle>
  indicatorStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
}

type State = {
  offset: Animated.Value
  visibility: Animated.Value
  initialOffset: { x: number; y: number }
}

export default class TabBar<T extends Route<RouteBase>> extends PureComponent<
  Props<T>,
  State
> {
  constructor(props: Props<T>)

  state: State
}
