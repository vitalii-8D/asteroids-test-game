const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const optimization = () => {
   let config = {
      minimize: isProd
   }

   if (isProd) {
      config.minimizer = [
         new OptimizeCssAssetsWebpackPlugin(),
         new TerserWebpackPlugin()
      ]
   }

   return config;
}

module.exports = {
   mode: 'development',
   entry: './src/index.js',
   output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'build'),
   },
   resolve: {
      alias: {
         '@static': path.resolve(__dirname, 'static')
      }
   },
   optimization: optimization(),
   // devServer: {
   //    port: 8080,
   //    contentBase: './build'
   // },
   devtool: 'source-map',
   plugins: [
      new HTMLWebpackPlugin({
         template: './static/index.html',
         minify: {
            collapseWhitespace: isProd
         },
         inject: 'body'
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
         patterns: [
            {
               from: path.resolve(__dirname, 'static/asteroid.ico'),
               to: path.resolve(__dirname, 'build')
            }
         ]
      }),
      new BrowserSyncPlugin({
         host: 'localhost',
         port: 8080,
         server: { baseDir: ['build'] }
      }),
      new MiniCssExtractPlugin({
         filename: '[name].css',

      })
   ],
   module: {
      rules: [
         {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader'
            ]
         }
      ]
   }
}
