// eslint-disable-next-line import/no-commonjs
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          'react-native-tab-view': './lib/module/index.js',
        },
        cwd: 'babelrc',
      },
    ],
  ],
};
