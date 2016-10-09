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
    this._jumpListener = this.props.subscribe('jump', this._jumpToPage);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.navigationState === nextProps.navigationState) {
      return;
    }
    const { index } = nextProps.navigationState;
    if (nextProps.swipeEnabled !== false) {
      this._viewPager.setPage(index);
    } else {
      this._viewPager.setPageWithoutAnimation(index);
    }
  }

  componentWillUnmount() {
    this._jumpListener.remove();
  }

  _jumpListener: Object;
  _viewPager: Object;
  _isManualScroll: boolean = false;
  _nextIndex: ?number;

  _jumpToPage = (index: number) => {
    if (this.props.swipeEnabled !== false) {
      this._viewPager.setPage(index);
    } else {
      this._viewPager.setPageWithoutAnimation(index);
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
