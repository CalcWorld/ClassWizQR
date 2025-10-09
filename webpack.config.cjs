const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production' || false;

const minify = isProduction ? {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  minifyCSS: true,
  minifyJS: true,
} : false;

const configs = [];

configs.push({
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cwqr.js',
    library: 'cwqr',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  devServer: {
    open: true,
    host: '0.0.0.0',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: "./src/favicon.ico",
      minify,
    }),
    new HtmlWebpackPlugin({
      template: './src/404.html',
      filename: '404.html',
      inject: false,
      minify,
    }),
    new HtmlWebpackPlugin({
      template: './src/api.html',
      filename: 'api.html',
      inject: false,
      minify,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/i18n-res',
          to: 'i18n-res',
          filter: (filepath) => {
            const s = filepath.split(/[.\/\\]/).reverse();
            return s[0] === 'json' && s[1].length === 2;
          },
          transform(content) {
            return JSON.stringify(JSON.parse(content.toString()));
          },
        },
      ]
    }),
  ],
  optimization: {
    // concatenateModules: false, // 临时禁用模块拼接
    // minimize: false,          // 临时禁用压缩
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.json$/i,
        type: 'json',
      },
    ],
  },
  devtool: isProduction ? false : 'eval-source-map',
  mode: isProduction ? 'production' : 'development',
});

if (isProduction) {
  configs.push({
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'cwqr.cjs',
      library: {
        type: 'commonjs2',
      },
    },
    target: 'node',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/i,
          loader: 'babel-loader',
        },
      ],
    },
    mode: isProduction ? 'production' : 'development',
  });
  configs.push({
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'cwqr.mjs',
      library: {
        type: 'module',
      },
    },
    experiments: {
      outputModule: true,
    },
    target: ['web', 'es2020'],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/i,
          loader: 'babel-loader',
        },
      ],
    },
    mode: isProduction ? 'production' : 'development',
  });
}

module.exports = configs;
