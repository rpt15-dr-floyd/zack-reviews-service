const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: __dirname + '/server/indexES6.js',

  target: 'node',

  externals: [nodeExternals()],

  output: {
    filename: 'newIndex.js',
    path: __dirname + '/server'
    // path: path.resolve('server-build'),
  },

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
  }
};

// var clientConfig = {
//   // entry: __dirname + '/server/indexES6.js',
//   entry: __dirname + '/client/src/index.jsx',
//   module: {
//     rules: [
//       {
//         test: [/\.(js|jsx)$/],
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-react', '@babel/preset-env']
//           }
//         }
//       },
//       {
//         test: /\.css$/,
//         exclude: /node_modules/,
//         use: [
//           {
//             loader: 'style-loader',
//           },
//           {
//             loader: 'css-loader',
//             options: {
//               sourceMap: true,
//               modules: true
//             }
//           }
//         ]
//       }
//     ]
//   },
//    output: {
//     filename: 'bundle.js',
//     path: __dirname + '/public/dist'//,
//     // publicPath: 'http://localhost:3001/1/public'
//   }
// };

// module.exports = [serverConfig, clientConfig];