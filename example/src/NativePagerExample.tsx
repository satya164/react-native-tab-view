import React, { useState } from 'react';
import { TabView, SceneMap, ViewPagerBackend } from 'react-native-tab-view';
import Albums from './Shared/Albums';
import Article from './Shared/Article';
import Contacts from './Shared/Contacts';
export default function MyPager() {
  const [navigation, setNavigation] = useState({
    index: 0,
    routes: [
      {
        key: 'article',
        icon: 'ios-paper',
        color: [244, 67, 54],
      },
      {
        key: 'contacts',
        icon: 'ios-people',
        color: [0, 132, 255],
      },
      {
        key: 'albums',
        icon: 'ios-albums',
        color: [76, 175, 80],
      },
    ],
  });

  const renderScene = SceneMap({
    article: Article,
    contacts: Contacts,
    albums: Albums,
  });

  return (
    <TabView
      navigationState={navigation}
      renderScene={renderScene}
      renderTabBar={() => null}
      onIndexChange={index => {
        setNavigation({ ...navigation, index: index });
      }}
      renderPager={props => (
        <ViewPagerBackend {...props} transitionStyle="curl" />
      )}
    />
  );
}

MyPager.title = 'Native Pager';
MyPager.backgroundColor = '#263238';
