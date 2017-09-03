/* @flow */

import { PureComponent } from 'react'
import { SceneRendererProps, Route, RouteBase } from './TabViewTypeDefinitions'

type PageScrollEvent = {
  nativeEvent: {
    position: number
    offset: number
  }
}

type PageScrollState = 'dragging' | 'settling' | 'idle'

type Props<T extends RouteBase> = SceneRendererProps<T> & {
  animationEnabled?: boolean
  swipeEnabled?: boolean
  children?: React.ReactNode
}

export default class TabViewPagerAndroid<
  T extends Route<RouteBase>
> extends PureComponent<Props<T>, void> {
  constructor(props: Props<T>)
}
