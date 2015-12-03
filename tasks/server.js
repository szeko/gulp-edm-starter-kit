var browserSync = require('browser-sync');

module.exports = function (gulp, env, errorHandler) {

	gulp.task('reload', function() {
		browserSync.reload();
	});

	return gulp.task('server', function() {
		browserSync({
			server: {
				baseDir: env.dist
			},
			open: false,
			notify: true
		});
	});

};