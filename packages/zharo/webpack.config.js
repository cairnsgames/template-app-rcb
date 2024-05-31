const path = require('path');
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'zharo.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'zharo',
    libraryTarget: 'umd',
    globalObject: 'this',
    libraryExport: 'default',  // Ensure default export is used
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,  // Add this rule for CSS files
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
  plugins: [
    new Dotenv(),
  ],
};
