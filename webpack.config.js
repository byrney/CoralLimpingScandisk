const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const vueLoaderConfig = {};

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
    mode: "development",
    devtool: "cheap-module-eval-source-map",
    entry: {
        index: [
            "./src/main.js"
        ]
    },
    output: {
        path: path.resolve(process.cwd(), "dist"),
        filename: "[name].js",
        publicPath: "/",
        globalObject: "this"
    },
    resolve: {
        alias: {
            "@": path.join(process.cwd(), "src"),
            vue$: "vue/dist/vue.runtime.esm.js"
        },
        extensions: [".mjs", ".js", ".jsx", ".vue", ".json", ".wasm"]
    },
    devServer: {
        hot: true,
        progress: true
    },
    plugins: [
        new VueLoaderPlugin(),
        new CaseSensitivePathsPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            env: {
                NODE_ENV: "development",
                BASE_URL: "/"
            },
            template: path.resolve(process.cwd(), "public", "index.html")
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(process.cwd(), "public"),
                to: path.resolve(process.cwd(), "dist"),
                toType: "dir",
                ignore: [".DS_Store"]
            }
        ])
    ],
    watchOptions: {
        // ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 500
    },
    module: {
        noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    }
};
