// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js', // Adjust this to your entry point
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'GMF-CIAM-sdk.js', // Changed from universal-auth.js
    library: {
      name: 'GMFCIAMAuth', // Changed from UniversalAuth
      type: 'umd', // Universal Module Definition
      export: 'default'
    },
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  optimization: {
    minimize: true
  }
};