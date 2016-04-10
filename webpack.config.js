var path = require('path');
var autoprefixer = require('autoprefixer');

module.exports = {
    devtool: 'source-map',
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:8080',
        'webpack/hot/only-dev-server',
        './src/app'
    ],
    output: {
        path: './build',
        publicPath: '/build',
        filename: 'app.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            include: path.resolve(__dirname, './src'),
            loaders: ['babel']
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader!postcss-loader"
        }]
    },
    postcss: function() {
        return [autoprefixer]
    }
};
