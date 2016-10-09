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

export default class TabViewPagerAndroid extends Component<void, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    swipeEnabled: PropTypes.bool,
    children: PropTypes.node,
  };

  componentWillMount() {
    this._jumpListener = this.props.subscribe('jump', this._handleJump);
  }

  componentDidUpdate() {
    global.requestAnimationFrame(() => {
      const { index } = this.props.navigationState;
      if (this._isTransitioning || !this._viewPager) {
        this._nextIndex = index;
        return;
      }
      this._viewPager.setPage(index);
    });
  }

  componentWillUnmount() {
    this._jumpListener.remove();
  }

  _jumpListener: Object;
  _viewPager: Object;
  _isTransitioning: boolean = false;
  _isManualScroll: boolean = false;
  _nextIndex: ?number;

  _handleJump = (index: number) => {
    this._nextIndex = null;
    if (this._viewPager) {
      this._viewPager.setPage(index);
    }
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
    this._isTransitioning = e !== 'idle';
    if (e === 'dragging') {
      this._nextIndex = null;
      this._isManualScroll = true;
    } else {
      if (e === 'settling') {
        return;
      }
      if (typeof this._nextIndex === 'number') {
        this.props.jumpToIndex(this._nextIndex);
        this._nextIndex = null;
      }
      this._isManualScroll = false;
    }
  };

  _handlePageSelected = (e) => {
    this._nextIndex = e.nativeEvent.position;
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
        onPageSelected={this._handlePageSelected}
        style={styles.container}
        ref={this._setRef}
      >
        {this.props.children}
      </ViewPagerAndroid>
    );
  }
}
