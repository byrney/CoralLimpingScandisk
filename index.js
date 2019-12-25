const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');
const webpackDevServerOptions = {
    publicPath: '/',
    contentBase: path.join(process.cwd(), 'dist'),
    historyApiFallback: true,
    hot: true,
    host: '0.0.0.0',
    allowedHosts: [
        '.repl.it',
        '.repl.co',
        '.repl.run'
    ]
};

WebpackDevServer.addDevServerEntrypoints(webpackConfig, webpackDevServerOptions);
const webpackCompiler = webpack(webpackConfig);

const app = new WebpackDevServer(webpackCompiler, webpackDevServerOptions);

const port = process.env.PORT || 3000;
app.listen(port, undefined, () => process.stdout.write(`\nApp listening on ${port}\n`));
// app.listen(port, () => console.log(`App listening on ${port}`));
