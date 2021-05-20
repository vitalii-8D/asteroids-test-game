const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production';
console.log(path.resolve(__dirname, 'build'));

const optimization = () => {
   // Minimize JS and CSS in production mode
   let config = {
      minimize: isProd
      // splitChunks: {
      //    cacheGroups: {
      //       commons: {
      //          test: /[\\/]node_modules[\\/]/,
      //          name: 'vendors',
      //          chunks: 'all',
      //          filename: '[name].bundle.js'
      //       }
      //    }
      // }
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
   entry: ['@babel/polyfill', './src/index.js'],
   target: 'web',
   output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].chunk.js',
      path: path.resolve(__dirname, 'build'),
      publicPath: "/"
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
   mode: 'development',
   devtool: 'source-map',
   devServer: {
      // open: true,
      port: 8080,
      // liveReload: true,
      // contentBase: 'build'
      // contentBase: path.join(__dirname, 'src'),
      // watchContentBase: true
   },
   plugins: [
      new CleanWebpackPlugin(), // Deletes build folder before next build
      new CopyWebpackPlugin({ // Copies files (icons in this case)
         patterns: [
            {
               from: path.resolve(__dirname, 'static/asteroid.ico'),
               to: path.resolve(__dirname, 'build')
            }
         ]
      }),
      new MiniCssExtractPlugin({ // Pastes CSS in different file
         filename: '[name].css',
      }),
      new HTMLWebpackPlugin({ // Copies HTML template from 'static' folder
         template: './static/index.html',
         minify: {
            collapseWhitespace: isProd
         },
         inject: 'body' // Injects <script/> tag in body tag
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
         {  // Babel for compiling to previous standard
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
