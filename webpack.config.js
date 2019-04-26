const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
	entry: {
		index: './src/template/part4/index.js',
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, '/dist/'),
		publicPath: './'
	},
	module: {
	  rules: [
	    {
	      test: /\.jsx?$/,
	      exclude: /(node_modules|bower_components)/,
	      use: {
	        loader: 'babel-loader',
	        options: {
	          presets: ['react', 'stage-1'],
	          plugins: ['transform-decorators-legacy','transform-decorators']
	        }
	      }
			},
			{
	      test: /\.png$/,
	      exclude: /(node_modules|bower_components)/,
	      use: 'url-loader?mimetype=image/png'
	    }
	  ]
	},
	plugins: [
		new HtmlWebpackPlugin({
     template: './src/template/part4/index.html'
		}),
	],
	optimization: {
		splitChunks: {
	    chunks: "async",
	    minSize: 1000,
	    minChunks: 1,
	    maxAsyncRequests: 5,
	    maxInitialRequests: 3,
	    name: true,
	    cacheGroups: {
        vendors: {
					test: (module, chunks) => {
						return /node_modules[\\/]echarts/.test(module.context);
					},
         	chunks: 'initial',
          name: "echarts",
          priority: 1,
          reuseExistingChunk: true
				},
				"react": {
					// test:  (module, chunks) => {
					// 	return /[\\/](react|react-dom)[\\/]/.test(module.context);
					// },
					test: /[\\/]node_modules[\\/]/,
					chunks: 'all',
					name: "react",
					priority: -10,
					reuseExistingChunk: true
			 	},
        default: {
        	test: /[\\/]src[\\/]template/,
        	chunks: 'initial',
          minChunks: 2,
          priority: -20
        }
    	}
		},
		runtimeChunk: {
			name: 'manifest'
		}
	},
	devServer: {
		publicPath: '/assets/',
		inline: true,
		contentBase: false,
		port: 60,
		proxy: {
			'/v2/movie/top250': {
        target: 'http://localhost:66',
        pathRewrite: {'^/v2/movie/top250' : '/v2/movie/top250'},
        changeOrigin: true,
			},
		}
	},
}

module.exports = (env, argv) => {
	console.log(argv.mode)
	if(argv.mode === 'production') {
		config.plugins.push(new CleanWebpackPlugin(['dist/*']));
	}
	return config;
}