import React from 'react';
import CollapsibleTabView from './CollapsibleTabViewExample';

export default class CollapsibleTabViewExample extends React.Component<{}, {}> {
  static title = 'Collapsible Tab View no snap';
  static backgroundColor = '#3f51b5';
  static appbarElevation = 0;

  render() {
    return <CollapsibleTabView disableSnap />;
  }
}
