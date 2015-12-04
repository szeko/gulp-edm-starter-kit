var gulp = require('gulp');

var env = {
	dist: './dist/',
	pjson: require('./package.json'),
	minifyHtml: true
};

env.paths = {
	src: {
		templates: 'templates/',
		sass: 'styles/*.scss',
		styles: 'styles/',
		images: 'images/**/*',
		node: 'node_modules/'
	},
	dist: {
		build: env.dist,
		html: env.dist + '*.html',
		css: env.dist + '*.css',
		images: env.dist + 'images/'
	}
};

try {
	env.credentials = require('./credentials.json');
} catch(e) {
	env.credentials = {};
}

require('./tasks')(gulp, env);
