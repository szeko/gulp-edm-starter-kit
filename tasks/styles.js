var sass = require('gulp-sass');

module.exports = function (gulp, env, errorHandler) {

	return gulp.task('styles', function() {

		return gulp.src(env.paths.src.sass).on("error", errorHandler)
			.pipe( sass({
				errLogToConsole: true,
				includePaths: [env.paths.src.node + 'Ink/scss/']
			}) )
			.pipe( gulp.dest(env.paths.src.styles) );

	});

};