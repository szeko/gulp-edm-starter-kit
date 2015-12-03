var runSequence = require('run-sequence');

module.exports = function (gulp, env, errorHandler) {

	return gulp.task('default', function (done) {

		runSequence(
			'build',
			['server', 'watch'],
			done
		);

	});
};