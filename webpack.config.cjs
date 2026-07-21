const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production' || false;

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
  plugins: [
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
