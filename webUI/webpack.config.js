const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  resolve: {
    fallback: {
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert'),
    },
  },
};

