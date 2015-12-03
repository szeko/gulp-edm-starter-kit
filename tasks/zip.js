var zip = require('gulp-zip');
var path = require('path');
var runSequence = require('run-sequence');

module.exports = function (gulp, env, errorHandler) {

	gulp.task('zip.images', function () {
		return gulp.src( path.join(env.paths.dist.images, '**/*') )
			.pipe( zip('images.zip') )
			.pipe( gulp.dest(env.dist) );
	});

	gulp.task('zip.dist', function () {
		return gulp.src( path.join(env.dist, '**/*') )
			.pipe( zip(env.pjson.name + '.zip') )
			.pipe( gulp.dest('./') );
	});

	return gulp.task('zip', function(done) {
		runSequence(
			'zip-images',
			'zip-dist',
			done
		);
	});

};