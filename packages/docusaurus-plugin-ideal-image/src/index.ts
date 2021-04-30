/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {LoadContext, Plugin} from '@docusaurus/types';
import {PluginOptions} from './types';
import {Configuration} from 'webpack';

import path from 'path';

export default function (
  _context: LoadContext,
  options: PluginOptions,
): Plugin<void> {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    name: 'docusaurus-plugin-ideal-image',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },

    configureWebpack(_config: Configuration, isServer: boolean) {
      return {
        mergeStrategy: {
          'module.rules': 'prepend',
        },
        module: {
          rules: [
            {
              test: /\.(png|jpe?g)$/i,
              resourceQuery: {
                not: [/asset/],
              },
              type: 'javascript/auto',
              generator: {
                emit: !isServer,
              },
              use: [
                require.resolve('@docusaurus/lqip-loader'),
                {
                  loader: require.resolve('@docusaurus/responsive-loader'),
                  options: {
                    emitFile: !isServer, // don't emit for server-side rendering
                    disable: !isProd,
                    adapter: require('@docusaurus/responsive-loader/sharp'),
                    name:
                      'assets/ideal-img/[name]-[contenthash:8].[width].[ext]',
                    ...options,
                  },
                },
              ],
            },
          ],
        },
      };
    },
  };
}
