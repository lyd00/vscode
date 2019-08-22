var webpack = require('webpack');
var path = require('path');
var VueLoaderPlugin = require('vue-loader/lib/plugin');

var createCompiler = function (isProduction) {
	// config
	var webpackConfig = {
		entry: './vite/main.ts',
		output: {
			path: path.resolve(__dirname, './out/vite'),
			filename: 'main.js'
		},
		module: {
			rules: [{
					test: /\.vue$/,
					use: [
						'cache-loader',
						{
							loader: 'vue-loader',
							options: {
								loaders: {
									// Since sass-loader (weirdly) has SCSS as its default parse mode, we map
									// the "scss" and "sass" values for the lang attribute to the right configs here.
									// other preprocessors should work out of the box, no loader config like this necessary.
									'scss': 'vue-style-loader!css-loader!sass-loader',
									'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
								}
								// other vue-loader options go here
							}
						}
					]
				},
				{
					test: /\.tsx?$/,
					use: [
						'cache-loader',
						{
							loader: 'ts-loader',
							options: {
								appendTsSuffixTo: [/\.vue$/],
							}
						}
					],
					exclude: /node_modules/

				},
				{
					test: /\.(png|jpg|gif|svg)$/,
					loader: 'file-loader',
					options: {
						name: '[name].[ext]?[hash]'
					}
				},
				{
					test: /\.css$/,
					use: [
						'vue-style-loader',
						'css-loader'
					]
				}
			]
		},
		resolve: {
			extensions: ['.ts', '.js', '.vue', '.json'],
			alias: {
				'vue$': 'vue/dist/vue.esm.js'
			}
		},
		devtool: '#eval-source-map',
		plugins: [
			// make sure to include the plugin for the magic
			new VueLoaderPlugin()
		]
	};

	if (isProduction) {
		webpackConfig.devtool = '#source-map';
		webpackConfig.optimization = {
			minimize: false
		};
		// http://vue-loader.vuejs.org/en/workflow/production.html
		webpackConfig.plugins = (webpackConfig.plugins || []).concat([
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: '"production"'
				}
			}),
			new webpack.LoaderOptionsPlugin({
				minimize: true
			})
		]);
	}


	return webpack(webpackConfig);
};

var createRunCallback = (cb) => {
	return (err, stats) => {
		if (err) {
			console.error(err.stack || err);
			if (err.details) {
				console.error(err.details);
			}
			cb && cb(err);
			return;
		}

		console.log(stats.toString({
			chunks: true, // 使构建过程更静默无输出
			assets: true,

			colors: true // 在控制台展示颜色
		}));
		cb && cb();
	};

};

exports.run = function (cb) {
	createCompiler(true).run(createRunCallback(cb));
};

exports.watch = function (cb) {
	createCompiler(false).watch({
		aggregateTimeout: 10
	}, createRunCallback(cb));
};


createCompiler(false).watch({
	aggregateTimeout: 300
}, createRunCallback());
