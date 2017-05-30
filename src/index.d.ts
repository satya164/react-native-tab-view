// Type definitions for react-native-tab-view
// Project: https://github.com/react-native-community/react-native-tab-view
// Definitions by: Kyle Roach <https://github.com/iRoachie>
// TypeScript Version: 2.3.3

import React from 'react'
import { ViewProperties, TextStyle, ViewStyle } from 'react-native'

interface TabViewAnimatedProps extends ViewProperties {
  navigationState: any
  renderScene(scene: any): JSX.Element
  renderHeader(props: any): JSX.Element
  onRequestChangeTab(index: number): void
}

interface TabBarProps {
  labelStyle: TextStyle
  indicatorStyle: ViewStyle
  renderBadge?(scene: any): JSX.Element
  renderLabel?(scene: any): JSX.Element
  style: object
}

export class TabViewAnimated extends React.Component<TabViewAnimatedProps, any> { }
export class TabBar extends React.Component<TabBarProps, any> { }
