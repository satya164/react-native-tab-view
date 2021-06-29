import * as React from 'react';
import type { SceneRendererProps } from './types';
export default function SceneMap<T extends any>(scenes: {
    [key: string]: React.ComponentType<T>;
}): ({ route, jumpTo, position }: SceneRendererProps & {
    route: any;
}) => JSX.Element;
