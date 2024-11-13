const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Import the plugin

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack Boilerplate',
      template: path.resolve(__dirname, './src/pages/index.html'),
      filename: 'index.html',
      chunks: ['main'],
    }),
    ...glob.sync('./src/pages/*.html').map(file => {
      const basename = path.basename(file, path.extname(file));
      if (basename === 'index') return null;

      return new HtmlWebpackPlugin({
        template: file,
        filename: `${basename}.html`,
        inject: 'body',
        excludeChunks: ['main'],
      });
    }).filter(Boolean),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/images'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    open: true,
    hot: true,
  },
};

console.log(glob.sync('./src/assets/images/*'));
console.log(glob.sync('./src/pages/*.html'));
