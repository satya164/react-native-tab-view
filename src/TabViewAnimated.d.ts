/* @flow */

import { PureComponent } from 'react'
import { Animated, StyleProp, ViewStyle } from 'react-native'
import {
  Scene,
  SceneRendererProps,
  NavigationState,
  Layout,
  Route,
  SubscriptionName,
  PagerProps,
  RouteBase
} from './TabViewTypeDefinitions'

type DefaultProps<T extends RouteBase> = {
  renderPager: (props: SceneRendererProps<T> & PagerProps) => React.ReactNode
}

type Props<T extends RouteBase> = PagerProps & {
  navigationState: NavigationState<T>
  onIndexChange: (index: number) => void
  onPositionChange?: ({ value: number }) => void
  initialLayout?: Layout
  canJumpToTab?: (route: T) => boolean
  renderPager: (props: SceneRendererProps<T> & PagerProps) => React.ReactNode
  renderScene: (props: SceneRendererProps<T> & Scene<T>) => React.ReactNode
  renderHeader?: (props: SceneRendererProps<T>) => React.ReactNode
  renderFooter?: (props: SceneRendererProps<T>) => React.ReactNode
  lazy?: boolean
  style?: StyleProp<ViewStyle>
}

type State = {
  loaded: Array<number>
  layout: Layout & {
    measured: boolean
  }
  position: Animated.Value
}

export default class TabViewAnimated<
  T extends Route<RouteBase>
> extends PureComponent<Props<T>, State> {
  constructor(props: Props<T>)

  state: State
}
