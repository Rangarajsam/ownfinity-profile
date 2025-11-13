
const {ModuleFederationPlugin} = require('webpack').container;
const { merge } = require('webpack-merge');
const webpackCommon = require('./webpack.common');
const ModuleFederationConfig = require('./moduleFederaion.config');

const devConfig = {
  mode: 'development',
  entry: "./src/index.ts",
  output:{
    publicPath:'http://localhost:2006/',
    assetModuleFilename: "images/[hash][ext][query]",
  },
  devServer: {
    port: 2006,
    historyApiFallback: true
  },
  plugins:[
    new ModuleFederationPlugin(ModuleFederationConfig)
  ]
  
}
module.exports = merge(webpackCommon, devConfig);