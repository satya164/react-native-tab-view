/* @flow */

import { PureComponent } from 'react'
import { SceneRendererProps, Route, RouteBase } from './TabViewTypeDefinitions'

type ScrollEvent = {
  nativeEvent: {
    contentOffset: {
      x: number
      y: number
    }
  }
}

type State = {
  initialOffset: { x: number; y: number }
}

type Props<T extends RouteBase> = SceneRendererProps<T> & {
  animationEnabled?: boolean
  swipeEnabled?: boolean
  children?: React.ReactNode
}

export default class TabViewPagerScroll<
  T extends Route<RouteBase>
> extends PureComponent<Props<T>, State> {
  constructor(props: Props<T>)
  state: State
}
