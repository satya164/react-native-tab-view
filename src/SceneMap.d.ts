/* @flow */

import { RouteBase } from './TabViewTypeDefinitions'

export default function SceneMap(scenes: {
  [key: string]: React.SFC<any>
}): React.SFC<RouteBase>
