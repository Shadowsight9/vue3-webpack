/// <reference types="webpack-dev-server" />

import * as path from 'node:path'
import * as webpack from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as TerserWebpackPlugin from 'terser-webpack-plugin'
import * as CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin'

class WebpackConfigPlugin {
  apply(compiler: webpack.Compiler): void {
    compiler.hooks.afterEnvironment.tap('WebpackConfigPlugin', () => {
      const webpackConfig = compiler.options
      console.log('Webpack configuration:', webpackConfig)
    })
  }
}

function tsLoader(context: string): webpack.RuleSetUseItem {
  return {
    loader: require.resolve('ts-loader'),
    options: {
      appendTsSuffixTo: [/\.vue$/],
      transpileOnly: true,
      configFile: path.join(context, 'tsconfig.json'),
    },
  }
}

function cssLoader(importLoaders = 0): webpack.RuleSetUseItem {
  return {
    loader: require.resolve('css-loader'),
    options: {
      modules: {
        auto: true,
        localIdentName: '[path][name]__[local]',
      },
      importLoaders,
    },
  }
}

interface Env {
  production?: boolean
}

export default function (env: Env): webpack.Configuration {
  const isProduction = env.production
  const mode = env.production ? 'production' : 'development'
  const context = __dirname

  const webpackConfig: webpack.Configuration = {
    mode,
    devtool: false, // 'eval-source-map'
    context,
    target: 'web',
    entry: {
      app: [
        path.join(context, 'src/index'),
      ],
    },
    output: {
      filename: '[name].js',
      path: path.join(context, 'dist'),
      environment: {
        arrowFunction: false,
        bigIntLiteral: false,
        const: false,
        destructuring: false,
        dynamicImport: false,
        forOf: false,
        module: false,
      },
      publicPath: isProduction ? '' : '/',
    },
    node: false,
    stats: {
      colors: true,
      children: false,
      modules: false,
      entrypoints: false,
    },
    module: {
      rules: [
        {
          test: /\.(m|c)?jsx?$/,
          exclude: /node_modules/,
          use: [
            { loader: require.resolve('babel-loader') },
          ],
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            tsLoader(context),
          ],
        },
        {
          test: /\.tsx$/,
          exclude: /node_modules/,
          use: [
            { loader: require.resolve('babel-loader') },
            tsLoader(context),
          ],
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? { loader: MiniCssExtractPlugin.loader } : { loader: require.resolve('style-loader') },
            cssLoader(1),
            { loader: require.resolve('postcss-loader') },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isProduction ? { loader: MiniCssExtractPlugin.loader } : { loader: require.resolve('style-loader') },
            cssLoader(2),
            { loader: require.resolve('postcss-loader') },
            { loader: require.resolve('sass-loader') },
          ],
        },
        {
          test: /\.vue$/,
          use: [
            { loader: require.resolve('vue-loader') },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
          type: 'asset',
          generator: { filename: 'img/[name].[ext]' },
        },
        {
          test: /\.(svg)(\?.*)?$/,
          type: 'asset/resource',
          generator: { filename: 'img/[name].[ext]' },
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          type: 'asset',
          generator: { filename: 'media/[name].[ext]' },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          type: 'asset',
          generator: { filename: 'fonts/[name].[ext]' },
        },
      ],
    },
    resolve: {
      alias: {
        '@': path.join(context, 'src'),
      },
      extensions: [
        '.tsx', '.ts', '.mjs', '.cjs', '.js', '.jsx', '.vue', '.scss', '.sass', '.css', '.json',
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'vue3-webpack',
        template: path.join(context, 'public/index.html'),
        filename: 'index.html',
        minify: false,
        cache: false,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(context, 'public'),
            to: path.join(context, 'dist'),
            toType: 'dir',
            globOptions: {
              ignore: [
                '**/.gitkeep',
                '**/.DS_Store',
                path.join(context, 'public/index.html').replace(/\\/g, '/'),
              ],
            },
            noErrorOnMissing: true,
          },
        ],
      }),
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: 'false',
        __VUE_PROD_DEVTOOLS__: 'false',
      }),
      new VueLoaderPlugin(),
      new WebpackConfigPlugin(),
    ],
  }

  if (isProduction) {
    webpackConfig.plugins!.push(
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
    )
    webpackConfig.optimization = {
      minimizer: [
        new TerserWebpackPlugin({
          parallel: true,
          extractComments: false,
          terserOptions: {
            ecma: 2018 as const,
            output: {
              comments: false,
              beautify: false,
            },
          },
        }),
        new CssMinimizerWebpackPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                mergeLonghand: false,
                cssDeclarationSorter: false,
              },
            ],
          },
        }),
      ],
    }
  } else {
    webpackConfig.devServer = {
      host: '0.0.0.0',
      port: 8090,
      open: false,
      static: path.join(context, 'dist'),
      devMiddleware: {
        publicPath: '/',
      },
      proxy: { /* ... */ },
    }
  }

  return webpackConfig
}
