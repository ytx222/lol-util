const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
// import * as path from 'path';
// import * as webpack from 'webpack';

const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// const logging = require('webpack/lib/logging/runtime');
// logging.configureDefaultLogger({
// 	level: 'none',
// 	//   debug: /something/,

// });




// in case you run into any typescript error when configuring `devServer`
// import 'webpack-dev-server';



// const outputPath = path.resolve(__dirname, 'dist'); // 替换为你的打包目录路径

// // 清空打包目录
// function cleanOutputDir() {
//   if (fs.existsSync(outputPath)) {
//     fs.readdirSync(outputPath).forEach(file => {
//       const curPath = path.join(outputPath, file);
//       fs.unlinkSync(curPath);
//     });
//     fs.rmdirSync(outputPath);
//   }
// }

// // 在打包之前清空目录
// cleanOutputDir();

// const config: webpack.Configuration = {
/** @type {webpack.Configuration }  */
const config = {
	entry: {
		// 这里支持函数和异步
		common: {
			import: ['axios', 'xlsx', 'https', 'fs', 'path', 'url', '/src'],
			filename: './common/common.js',
		},
		main: {
			dependOn: 'common',
			import: './src/index.ts',
			filename: './common/main.js',
		},
		test: {
			dependOn: 'common',
			layer: '/scripts/',
			import: './scripts/test.ts',
		},
		save: {
			dependOn: 'common',
			import: './scripts/save.ts',
		},
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
		layers: true,
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		// module: true,
	},

	plugins: [
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ['dist'], // 指定要清空的目录，例如 'dist' 表示清空 dist 目录
		}),
	],
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

module.exports = config;
// export default config;
