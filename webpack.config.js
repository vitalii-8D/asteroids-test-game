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
   entry: ['@babel/polyfill', './src/index.js'],
   output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'build'),
   },
   resolve: {
      extensions: ['.js'],
      alias: {
         '@static': path.resolve(__dirname, 'static'),
         '@components': path.resolve(__dirname, 'src', 'components'),
         '@constants': path.resolve(__dirname, 'src', 'constants'),
         '@handlers': path.resolve(__dirname, 'src', 'handlers'),
         '@helpers': path.resolve(__dirname, 'src', 'helpers'),
      }
   },
   optimization: optimization(),
   devServer: {
      port: 3000,
      contentBase: path.join(__dirname, 'build')
   },
   devtool: 'source-map',
   plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
         patterns: [
            {
               from: path.resolve(__dirname, 'static/asteroid.ico'),
               to: path.resolve(__dirname, 'build')
            }
         ]
      }),
      new MiniCssExtractPlugin({
         filename: '[name].css',

      }),
      new HTMLWebpackPlugin({
         template: './static/index.html',
         minify: {
            collapseWhitespace: isProd
         },
         inject: 'body'
      }),
      // new BrowserSyncPlugin({
      //    host: 'localhost',
      //    port: 3000,
      //    server: { baseDir: ['build'] }
      // })
   ],
   module: {
      rules: [
         {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
         },
         {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
               loader: "babel-loader",
               options: {
                  presets: ['@babel/preset-env'],
                  plugins: ['@babel/plugin-proposal-class-properties']
               }
            }
         }
      ]
   }
}
