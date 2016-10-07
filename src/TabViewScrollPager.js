/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
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

export default class TabViewScrollPager extends Component<void, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    swipeEnabled: PropTypes.bool,
    children: PropTypes.node,
  };

  componentDidMount() {
    this._positionListener = this.props.position.addListener(this._updatePosition);
  }

  componentWillUnmount() {
    this.props.position.removeListener(this._positionListener);
  }

  _positionListener: string;
  _scrollView: Object;
  _isManualScroll: boolean = false;
  _isMomentumScroll: boolean = false;

  _updatePosition = (e: { value: number }) => {
    if (this._isManualScroll) {
      return;
    }
    this._scrollView.scrollTo({
      x: e.value * this.props.layout.width,
      animated: false,
    });
  };

  _handleBeginDrag = () => {
    // onScrollBeginDrag fires when user touches the ScrollView
    this._isManualScroll = true;
    this._isMomentumScroll = false;
  };

  _handleEndDrag = () => {
    // onScrollEndDrag fires when user lifts his finger
    // onMomentumScrollBegin fires after touch end
    // run the logic in next frame so we get onMomentumScrollBegin first
    global.requestAnimationFrame(() => {
      if (this._isMomentumScroll) {
        return;
      }
      this._isManualScroll = false;
    });
  };

  _handleMomentumScrollBegin = () => {
    // onMomentumScrollBegin fires on flick, as well as programmatic scroll
    this._isMomentumScroll = true;
  };

  _handleMomentumScrollEnd = () => {
    // onMomentumScrollEnd fires when the scroll finishes
    this._isMomentumScroll = false;
    this._isManualScroll = false;
  };

  _handleScroll = (e) => {
    if (!this._isManualScroll) {
      return;
    }
    this.props.position.setValue(
      e.nativeEvent.contentOffset.x / this.props.layout.width
    );
  };

  _setRef = (el: Object) => (this._scrollView = el);

  render() {
    return (
      <ScrollView
        horizontal
        pagingEnabled
        directionalLockEnabled
        scrollEnabled={this.props.swipeEnabled}
        automaticallyAdjustContentInsets={false}
        bounces={false}
        scrollsToTop={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={this._handleScroll}
        onScrollBeginDrag={this._handleBeginDrag}
        onScrollEndDrag={this._handleEndDrag}
        onMomentumScrollBegin={this._handleMomentumScrollBegin}
        onMomentumScrollEnd={this._handleMomentumScrollEnd}
        style={styles.container}
        ref={this._setRef}
      >
        {this.props.children}
      </ScrollView>
    );
  }
}
