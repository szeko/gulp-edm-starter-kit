var runSequence = require('run-sequence');

module.exports = function (gulp, env, errorHandler) {

	gulp.task('build.html', function () {
		runSequence(
			'styles',
			'process',
			done
		);
	});

	gulp.task('build.images', function () {
		runSequence(
			'images',
			done
		);
	});

	return gulp.task('build', function (done) {

		runSequence(
			'clean',
			['build.images', 'build.html'],
			done
		);

	});

};