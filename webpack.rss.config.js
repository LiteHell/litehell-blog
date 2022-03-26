const path = require('path');

module.exports = {
  entry: './generateFeeds.js',
  target: 'node',
  output: {
    filename: 'generateFeeds.compiled.js',
    path: __dirname,
  },
};
