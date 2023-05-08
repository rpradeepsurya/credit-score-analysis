const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    // {
    //   apply: (compiler) => {
    //     compiler.hooks.compilation.tap('CspHtmlWebpackPlugin', (compilation) => {
    //       compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
    //         'CspHtmlWebpackPlugin',
    //         (data, cb) => {
    //           data.headTags.push({
    //             tagName: 'meta',
    //             voidTag: true,
    //             attributes: {
    //               'http-equiv': 'Content-Security-Policy',
    //               content: "default-src 'self' 'unsafe-inline' 'unsafe-eval' http: ws:; connect-src 'self' 'unsafe-inline' 'unsafe-eval' http: ws:;",
    //             },
    //           });

    //           cb(null, data);
    //         }
    //       );
    //     });
    //   },
    // },
  ],
  resolve: {
    fallback: {
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert'),
    },
  },
};

