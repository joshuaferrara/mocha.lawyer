const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CnameWebpackPlugin = require('cname-webpack-plugin');
const WebpackConcatPlugin = require('webpack-concat-files-plugin');
const settings = require('./settings');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const port = 8262;
const entry = path.join(__dirname, './src/index.tsx');
const output = path.join(__dirname, './dist');
const publicPath = mode === 'production' ? settings.repoPath || '/' : '/';

module.exports = {
  mode,

  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },

  devServer: {
    port,
    compress: true,
    contentBase: output,
    publicPath,
    stats: { colors: true },
    hot: true,
    historyApiFallback: true,
  },

  devtool: mode === 'production' ? false : 'eval',

  entry:
    mode === 'production'
      ? entry
      : [
          `webpack-dev-server/client?http://localhost:${port}`,
          'webpack/hot/only-dev-server',
          entry,
        ],

  output: {
    path: output,
    filename: '[hash].bundle.js',
    publicPath,
  },

  resolve: {
    modules: [path.join(__dirname, './node_modules')],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.less'],
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        include: path.join(__dirname, './src'),
        use: 'ts-loader',
      },

      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      },

      {
        test: /\.(less)$/,
        use: [
          mode === 'production'
            ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath,
                },
              }
            : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName:
                  mode === 'production'
                    ? '[hash:base64:10]'
                    : '[path][name]__[local]--[hash:base64:5]',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              additionalData: "@import 'open-color/open-color.less';",
            },
          },
          ...(mode === 'production' ? ['postcss-loader'] : []),
        ],
      },

      {
        test: /\.(css)$/,
        use: [
          mode === 'production'
            ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath,
                },
              }
            : 'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },

      {
        test: /\.(svg|png|jpg|gif|woff|woff2|otf|ttf|eot)$/,
        loader: 'file-loader',
      },

      {
        test: /\.ya?ml$/,
        use: {
          loader: 'yaml-loader',
          options: {
            asStream: true
          },
        },
      }
    ],
  },

  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(mode) }),
    new FaviconsWebpackPlugin({
      logo: path.join(__dirname, './favicon.png'),
      background: '#ffeeee',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: true,
        twitter: false,
        yandex: false,
        windows: false,
      },
    }),
    new WebpackConcatPlugin({
      bundles: [
        {
          src: path.join(__dirname, 'reviews/**/*.yml'),
          dest: './dist/reviews.yml',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      templateContent: ({ htmlWebpackPlugin }) => `
        <!DOCTYPE html>
        <html>
          <head>
            ${htmlWebpackPlugin.tags.headTags}
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">

            <title>${settings.title}</title>

            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
              integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
              crossorigin=""/>
            <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
              integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
              crossorigin=""></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
          </head>
          <body>
            <noscript>
              Enable JavaScript to use Mocha Laywer
            </noscript>

            <div id="app" style="height: 100%"></div>
            ${htmlWebpackPlugin.tags.bodyTags}
          </body>
        </html>
      `,
    }),
    ...(mode !== 'production'
      ? [
          new webpack.HotModuleReplacementPlugin(),
        ]
      : [
          new MiniCssExtractPlugin(),
          ...(settings.cname ? [new CnameWebpackPlugin({ domain: settings.cname })] : []),
        ]),
  ],
};
