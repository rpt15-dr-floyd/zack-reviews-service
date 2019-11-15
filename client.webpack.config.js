// const webpack = require('webpack');
// const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: __dirname + '/client/src/index.jsx',
  module: {
    rules: [
      {
        test: [/\.(js|jsx)$/],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      }//,
      // {
      //   test: /\.css$/,
      //   exclude: /node_modules/,
      //   use: [
      //     {
      //       loader: 'style-loader',
      //     },
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         sourceMap: true,
      //         modules: true
      //       }
      //     }
      //   ]
      // }
    ]
  },
   output: {
    filename: 'bundle.js',
    path: __dirname + '/public/dist'//,
    // publicPath: 'http://localhost:3001/1/public'
  }
};
