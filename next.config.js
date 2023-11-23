const path = require('path');

module.exports = {
	trailingSlash: true,
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
	},
	reactStrictMode: true,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
				//port: '',
				pathname: '**',
			},
		],
		/*
		domains: [
			'chart.googleapis.com',
			'gvhip-v2.netlify.app',
			'images.unsplash.com',
			'upload.wikimedia.org',
			'lh3.googleusercontent.com',
			'touringghana.com',
			'en.wikipedia.org',
			'localhost:3000',
		],
		
		loader: 'akamai',
		path:
			process.env.NODE_ENV === 'production'
				? 'https://gvhip-v2.netlify.app'
				: 'http://localhost:3000',
				*/
	},
	optimizeFonts: false,
};
