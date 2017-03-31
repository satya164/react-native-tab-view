/* @flow */
/* eslint-disable import/no-commonjs */

module.exports = {
  get TabViewAnimated() { return require('./src/TabViewAnimated').default; },
  get TabViewPagerPan() { return require('./src/TabViewPagerPan').default; },
  get TabViewPagerScroll() { return require('./src/TabViewPagerScroll').default; },
  get TabViewPagerAndroid() { return require('./src/TabViewPagerAndroid').default; },
  get TabBar() { return require('./src/TabBar').default; },
};
