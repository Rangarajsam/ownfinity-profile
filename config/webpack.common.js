const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    module:{
        rules:[
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/preset-react', '@babel/preset-env', '@babel/preset-typescript'],
                        plugins:['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                "style-loader",
                "css-loader",
                "postcss-loader"
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: "asset/resource", // emits separate files
            },
        ]
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    plugins : [
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        })
    ]
}