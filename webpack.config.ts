// const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');
// const webpack=require('webpack')
// const logging = require('webpack/lib/logging/runtime');
// logging.configureDefaultLogger({
// 	level: 'none',
// 	//   debug: /something/,
// });
import * as path from 'path';
import * as webpack from 'webpack';
// in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server';

const config: webpack.Configuration = {

	entry: {
		main: './src/index.ts',
		test: './src/scripts/test.ts',
		save: './src/scripts/save.ts',

	},
	target: 'node',
	mode: 'none',
	module: {
		rules: [{ test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ }],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	experiments: {
		topLevelAwait: true,
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},

	plugins: [],
	// 隐藏所有日志并显示错误日志
	stats: {
		all: false,
		errors: true,
		errorDetails: true,
		errorStack: true,

	},

	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					compress: {
						warnings: false,
						drop_console: true,
						drop_debugger: true,
						pure_funcs: ['console.log'],
					},
				},
			}),
		],
	},
};

export default config;
