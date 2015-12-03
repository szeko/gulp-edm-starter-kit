var path = require('path');

module.exports = function (gulp, env) {

	return gulp.task('watch', ['server'], function() {
		gulp.watch(path.join(env.paths.src.styles, '**/*'), ['styles', 'process']);
		gulp.watch(path.join(env.paths.src.images, '**/*'), ['images']);
		gulp.watch(path.join(env.paths.src.templates, '/**/*.nunj'), ['process']);
	});

};