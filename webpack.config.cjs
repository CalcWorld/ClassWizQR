const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production' || false;

const minify = isProduction ? {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  minifyCSS: true,
  minifyJS: true,
} : false;

const config = {
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
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
