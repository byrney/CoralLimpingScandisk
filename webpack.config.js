const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
                use: [
                    {
                        loader: "vue-loader",
                        options: {
                            compilerOptions: {
                                preserveWhitespace: false
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 4096,
                            fallback: {
                                loader: "file-loader",
                                options: {
                                    name: "img/[name].[hash:8].[ext]"
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(svg)(\?.*)?$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "img/[name].[hash:8].[ext]"
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 4096,
                            fallback: {
                                loader: "file-loader",
                                options: {
                                    name: "media/[name].[hash:8].[ext]"
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 4096,
                            fallback: {
                                loader: "file-loader",
                                options: {
                                    name: "fonts/[name].[hash:8].[ext]"
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.pug$/,
                use: [
                    {
                        loader: "pug-plain-loader"
                    }
                ]
            },
            {
                test: /\.css$/,
                oneOf: [
                    {
                        resourceQuery: /module/,
                        use: [
                            {
                                loader: "vue-style-loader",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false
                                }
                            },
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: "[name]_[local]_[hash:base64:5]"
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: false
                                }
                            }
                        ]
                    },
                    {
                        resourceQuery: /\?vue/,
                        use: [
                            {
                                loader: "vue-style-loader",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false
                                }
                            },
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: false
                                }
                            }
                        ]
                    },
                    {
                        test: /\.module\.\w+$/,
                        use: [
                            {
                                loader: "vue-style-loader",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false
                                }
                            },
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: "[name]_[local]_[hash:base64:5]"
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: false
                                }
                            }
                        ]
                    },
                    {
                        use: [
                            {
                                loader: "vue-style-loader",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false
                                }
                            },
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: false
                                }
                            }
                        ]
                    }
                ]
            },
            {
                test: /\.p(ost)?css$/,
                oneOf: [
                    {
                        resourceQuery: /module/,
                        use: [
                            {
                                loader: "vue-style-loader",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false
                                }
                            },
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: "[name]_[local]_[hash:base64:5]"
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: false
                                }
                            }
                        ]
                    },
                    {
                        resourceQuery: /\?vue/,
                        use: [
                            {
                                loader: "vue-style-loader",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false
                                }
                            },
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: false
                                }
                            }
                        ]
                    },
                    {
                        test: /\.module\.\w+$/,
                        use: [
                            {
                                loader: "vue-style-loader",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false
                                }
                            },
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: "[name]_[local]_[hash:base64:5]"
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: false
                                }
                            }
                        ]
                    },
                    {
                        use: [
                            {
                                loader: "vue-style-loader",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false
                                }
                            },
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: false
                                }
                            }
                        ]
                    }
                ]
            },
            {
                test: /\.less$/,
                oneOf: [
                    {
                        resourceQuery: /module/,
                        use: [
                            {
                                loader: "vue-style-loader",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false
                                }
                            },
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: "[name]_[local]_[hash:base64:5]"
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: false
                                }
                            },
                            {
                                loader: "less-loader",
                                options: {
                                    sourceMap: false
                                }
                            }
                        ]
                    },
                    {
                        resourceQuery: /\?vue/,
                        use: [
                            {
                                loader: "vue-style-loader",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false
                                }
                            },
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: false
                                }
                            },
                            {
                                loader: "less-loader",
                                options: {
                                    sourceMap: false
                                }
                            }
                        ]
                    },
                    {
                        test: /\.module\.\w+$/,
                        use: [
                            {
                                loader: "vue-style-loader",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false
                                }
                            },
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: "[name]_[local]_[hash:base64:5]"
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: false
                                }
                            },
                            {
                                loader: "less-loader",
                                options: {
                                    sourceMap: false
                                }
                            }
                        ]
                    },
                    {
                        use: [
                            {
                                loader: "vue-style-loader",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false
                                }
                            },
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: false
                                }
                            },
                            {
                                loader: "less-loader",
                                options: {
                                    sourceMap: false
                                }
                            }
                        ]
                    }
                ]
            },
            {
                test: /\.m?jsx?$/,
                exclude: [
                    function() {
                        /* omitted long function */
                    }
                ],
                use: [
                    {
                        loader: "babel-loader"
                    }
                ]
            }
        ]
    }
};
