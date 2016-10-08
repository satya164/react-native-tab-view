/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  ViewPagerAndroid,
  StyleSheet,
} from 'react-native';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { SceneRendererProps } from './TabViewTypeDefinitions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Props = SceneRendererProps & {
  swipeEnabled?: boolean;
  children?: any;
}

export default class TabViewAndroidViewPager extends Component<void, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    swipeEnabled: PropTypes.bool,
    children: PropTypes.node,
  };

  componentWillMount() {
    this._jumpListener = this.props.subscribe('jump', this._jumpToPage);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.navigationState !== nextProps.navigationState) {
      this._jumpToPage(nextProps.navigationState.index);
    }
  }

  componentWillUnmount() {
    this._jumpListener.remove();
  }

  _jumpListener: Object;
  _viewPager: Object;
  _isManualScroll: boolean = false;

  _jumpToPage = (value: number) => {
    this._viewPager.setPage(value);
  };

  _handlePageScroll = (e) => {
    if (!this._isManualScroll) {
      return;
    }
    this.props.position.setValue(
      e.nativeEvent.position + e.nativeEvent.offset
    );
  };

  _handlePageScrollStateChanged = (e) => {
    if (e === 'dragging') {
      this._isManualScroll = true;
    } else {
      if (e === 'settling') {
        return;
      }
      this._isManualScroll = false;
    }
  };

  _setRef = (el: Object) => (this._viewPager = el);

  render() {
    return (
      <ViewPagerAndroid
        key={this.props.navigationState.routes.length}
        keyboardDismissMode='on-drag'
        initialPage={this.props.navigationState.index}
        scrollEnabled={this.props.swipeEnabled !== false}
        onPageScroll={this._handlePageScroll}
        onPageScrollStateChanged={this._handlePageScrollStateChanged}
        style={styles.container}
        ref={this._setRef}
      >
        {this.props.children}
      </ViewPagerAndroid>
    );
  }
}
