const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { NODE_ENV } = process.env;


const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',  
  disable: false,
  allChunks: true
});

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
  
  //stats: true,
  context: path.join(__dirname, '../src'),
  target: 'web',

  output: {

    filename: `[name].js`,
    path: path.join(__dirname, '../dist')
  },
  resolve: {
    extensions: [
      '.jsx',
      '.js',
      '.json',
      '.scss',
      '.css',
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
          /(node_modules)/
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
              cacheDirectory: true,
              plugins: ['react-hot-loader/babel']
            }
          }
        ]
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
        test: /\.s(a|c)ss$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: false,
                importLoaders: 1,
                minimize: true,
                sourceMap: true,
                localIdentName: '[path]___[name]___[local]___[hash:base64:5]'
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
    
    new webpack.ProvidePlugin({ 
      'Promise': 'es6-promise',
      'fetch': 'whatwg-fetch' 
    }), 

    //https://webpack.js.org/plugins/environment-plugin/#usage
    new webpack.EnvironmentPlugin({
      'NODE_ENV': NODE_ENV,
      'DEBUG': NODE_ENV !== 'production',
      'PRODUCTION': NODE_ENV === 'production',
      'BUILD_ID': process.env.BUILD_ID || Date.now(),
      'APP_NAME': pkg.name,
      'APP_VERSION': pkg.version
      
    })
  ],

  devtool: NODE_ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map'
});
