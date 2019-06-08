// eslint-disable-next-line import/no-commonjs
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          'react-native-tab-view': './src/index.tsx',
        },
        cwd: 'babelrc',
      },
    ],
  ],
};
