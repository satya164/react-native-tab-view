const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    overflow: Platform.OS === 'web' ? 'auto' : 'scroll',
  },
  tabBar: {
    backgroundColor: '#191919',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    // We don't need zIndex on Android, disable it since it's buggy
    zIndex: Platform.OS === 'android' ? 0 : 1,
  },
  tabContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  tabLabel: {
    backgroundColor: 'transparent',
    color: 'white',
    fontWeight: 'bold',
    margin: 8,
  },
  tabItem: {
    flexGrow: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1,borderColor:'gray'
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  indicator: {
    backgroundColor: '#E50913',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: 4,
  },
});
