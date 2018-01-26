const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({filename: '[name].[contenthash].css', disable: false});

const pkg = require('../package.json');
const config = require('../config.js');

//https://www.npmjs.com/package/webpack-bundle-analyzer
const bundleAnalyzer = new BundleAnalyzerPlugin({
  generateStatsFile: true,
  openAnalyzer: false,
  reportFilename: './report.html',
  statsFilename: './stats.json',
  analyzerMode: 'static'
});
// File: ./.webpack/base.js
module.exports = () => ({
  stats: true,
  context: path.resolve(__dirname, '../src'),

  output: {
    filename: `[name].js`,
    path: path.resolve(__dirname, '../dist')
  },
  resolve: {
    extensions: [
      '.jsx',
      '.js',
      '.json',
      '.scss',
      '.html'
    ],
    modules: config.paths.modules,
    alias: config.paths.alias
  },
  module: {
    rules: [
      //.js
      {
        test: /\.js$/,
        include: config.modules,
        exclude: [
          /(bower_components|node_modules)/, /(\*.spec)/
        ],
        use: ['babel-loader']
      },
      //.txt
      {
        test: /\.(xml|html|txt|md)$/,
        use: ['raw-loader']
      },
      //.svg
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        use: ['url-loader']
      },
      //.scss
      {
        test: /\.scss$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            //'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                importer: require('node-sass-import-once'),
                importOnce: {
                  index: true,
                  css: true,
                  bower: true
                },
                includePaths: ['node_modules', 'bower_components']
              }
            }
          ]
        })
      },
    ]
  },
  plugins: [
    extractSass,
    //bundleAnalyzer,
    new webpack.optimize.OccurrenceOrderPlugin(),
    //
    new webpack.NamedModulesPlugin(),
    //
    new webpack.NoEmitOnErrorsPlugin(),

    //https://webpack.js.org/plugins/environment-plugin/#usage
    new webpack.EnvironmentPlugin({
      'NODE_ENV': process.env.NODE_ENV,
      'PRODUCTION': process.env.NODE_ENV === 'production'
    })
  ],

  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map'
});