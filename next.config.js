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
	},
	output: 'standalone',
	optimizeFonts: false,
};
