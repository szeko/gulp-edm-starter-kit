var build = require('./build');
var clean = require('./clean');
var images = require('./images');
var process = require('./process');
var styles = require('./styles');
var defaultTask = require('./default');
var watch = require('./watch');
var server = require('./server');
var zip = require('./zip');
var errorHandler = require('./error-handler');

module.exports = function (gulp, env) {

	return {
		build: build(gulp, env, errorHandler),
		clean: clean(gulp, env, errorHandler),
		default: defaultTask(gulp, env, errorHandler),
		errorHandler: errorHandler,
		images: images(gulp, env, errorHandler),
		process: process(gulp, env, errorHandler),
		styles: styles(gulp, env, errorHandler),
		watch: watch(gulp, env, errorHandler),
		server: server(gulp, env, errorHandler),
		zip: zip(gulp, env, errorHandler)
	};

};
