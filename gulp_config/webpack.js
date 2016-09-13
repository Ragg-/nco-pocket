const path = require('path');
const webpack = require('webpack');
const option  = require('./gulp');

module.exports = {
    watch: true,
    cache: true,
    entry: {
        nco: 'nco'
    },
    output: {
        path: path.join(option.publishDir, 'js'),
        filename: '[name].js',
        sourceMapFilename: 'map/[file].map',
        publicPath: '/js/',
    },
    devtool: process.env.NODE_ENV === 'production' ? 'hidden-source-map' : 'source-map',
    resolve: {
        root: [
            path.join(__dirname, '..'),
            `${option.sourceDir}/scripts`,
        ],
        extensions: ['', '.jsx', '.js'],
        modulesDirectories: [
            'node_modules',
            'bower_components',
        ],
    },
    module: {
        loaders: [
            {test: /\.jsx?$/,   loader: 'babel-loader',     exclude: /node_modules|bower_components|socket\.io\.js/,
             query: {
                "presets": [
                    "stage-3",
                    "es2015",
                ],
                "plugins": [
                    "transform-class-properties",
                    "transform-react-jsx",
                    "add-module-exports",
                ]
             }},
        ],
    },
    plugins: [
        new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("package.json", ["main"])),
        new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])),
        new webpack.DefinePlugin({
          ENV_DEV: JSON.stringify(process.env.NODE_ENV !== 'production'),
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
    ].concat(process.env.NODE_ENV === 'production' ? [
        new webpack.optimize.UglifyJsPlugin()
    ] : []),
};
