var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var del = require('del');
var rename = require('gulp-rename');
var data = require('gulp-data');
var premailer = require('gulp-premailer');
var nunjucks = require('gulp-render-nunjucks');
var nunjucksLib = require('nunjucks');
var htmlmin = require('gulp-htmlmin');
var inlinesource = require('gulp-inline-source');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var assign = require('lodash/object/assign');

module.exports = function (gulp, env, errorHandler) {

	var minifyHtml = typeof env.minifyHtml === 'undefined' ? true : env.minifyHtml;

	// Configure the nunjucks environment
	var nunjucksEnv = nunjucksLib.configure(
		path.resolve(env.paths.src.templates),
		{
			noCache: true,
			watch: false
		}
	);

	var filters = glob.sync(path.resolve(process.cwd(), env.paths.src.filters, '*.js'));
	filters.forEach(function(filename) {
		var pathData = path.parse(filename);
		nunjucksEnv.addFilter( pathData.name, require(filename) );
	});

	gulp.task('process.render', function() {
		return gulp.src('*.nunj', { cwd: env.paths.src.templates }).on("error", errorHandler)
			.pipe( data(function(file) {
				var filedata = file.data || {};
				var datas = glob.sync(path.resolve(process.cwd(), env.paths.src.data, '*.{js,json}'));

				datas.forEach(function(filename) {
					var pathData = path.parse(filename);
					switch(pathData.ext.toLowerCase()) {
						case '.json':
							filedata = assign(filedata, require(filename));
							break;
						case '.js':
							filedata[pathData.name] = require(filename)(env, nunjucksEnv)
							break;
					}
				});

				return filedata;
			}) )
			.pipe( nunjucks.render() )
			.pipe( rename({ extname: '.html' }) )
			.pipe( gulp.dest(env.paths.dist.build) );
	});

	gulp.task('process.inline', function() {
		return gulp.src(env.paths.dist.html).on("error", errorHandler)
			.pipe( premailer({ entities: true }) )
			.pipe( inlinesource({ ignore: ['img'] }) )
			.pipe( minifyHtml ? htmlmin({ collapseWhitespace: true }) : gutil.noop() )
			.pipe( gulp.dest(env.paths.dist.build) )
			.pipe( browserSync.active ? browserSync.reload({ stream: true, once: true }) : gutil.noop() );
	});

	gulp.task('process.cleanup', del.bind(null, [env.paths.dist.css] ));

	return gulp.task('process', function(done) {
		return runSequence(
			'process.render',
			'process.inline',
			'process.cleanup',
			done
		);
	});

};
