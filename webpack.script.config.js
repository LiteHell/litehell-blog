/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  entry: {generateFeeds: './generateFeeds.ts', generateSitemap: './generateSitemap.ts', createPost: './createPost.ts', touchPost: './touchPost.ts'},
  target: 'node',
  output: {
    filename: '[name].compiled.js',
    path: __dirname,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.script.json',
          },
        },
      },
    ],
  },
};
