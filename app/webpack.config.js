const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map', // 디버깅을 위한 옵션, 본래 코드를 보존하기 때문에 프로덕션용 코드에 적합
  entry: ['./client/js'],
  output: {
    path: path.resolve(__dirname, 'dist/client/js'), filename: 'app.js'
  },
  module: {
    loaders: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
      options: {
        transpileOnly: true
      }
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ],
  resolve: { extensions: [".ts", ".js"] }
  // 번들링 시 취급할 확장자
};