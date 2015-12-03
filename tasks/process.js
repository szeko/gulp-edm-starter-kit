var path = require('path');
var del = require('del');
var rename = require('gulp-rename');
var data = require('gulp-data');
var premailer = require('gulp-premailer');
var nunjucks = require('gulp-render-nunjucks');
var nunjucksLib = require('nunjucks');
var htmlmin = require('gulp-htmlmin');
var inlinesource = require('gulp-inline-source');
var runSequence = require('run-sequence');

module.exports = function (gulp, env, errorHandler) {

	// Configure the nunjucks environment
	var nunjucksEnv = nunjucksLib.configure(
		path.resolve(env.paths.src.templates),
		{
			noCache: true,
			watch: false
		}
	);

	gulp.task('process.render', function() {
		return gulp.src('*.nunj', { cwd: env.paths.src.templates }).on("error", errorHandler)
			// .pipe( data(function(file, done) { done(null, {}); }) )
			.pipe( nunjucks.render() )
			.pipe( rename({ extname: '.html' }) )
			.pipe( gulp.dest(env.paths.dist.build) );
	});

	gulp.task('process.inline', function() {
		return gulp.src(env.paths.dist.html).on("error", errorHandler)
			.pipe( premailer({ entities: true }) )
			.pipe(inlinesource({
				ignore: [
					'img'
				]
			}))
			.pipe( htmlmin({ collapseWhitespace: true }) )
			.pipe( gulp.dest(env.paths.dist.build) );
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
