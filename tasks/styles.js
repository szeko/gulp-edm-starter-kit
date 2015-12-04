var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var mqpacker = require('css-mqpacker');

var responsive = function (css, result) {
	css.walkRules(function(rule) {
		if (rule.parent !== result.root) {
			rule.walkDecls(function(decl) {
				decl.important = true;
			});
		}
	});
};

module.exports = function (gulp, env, errorHandler) {

	return gulp.task('styles', function() {

		return gulp.src(env.paths.src.sass).on("error", errorHandler)
			.pipe( sass({
				outputStyle: 'nested',
				errLogToConsole: true,
				includePaths: [env.paths.src.node + 'Ink/scss/']
			}) )
			.pipe( postcss([
				require('css-mqpacker'),
				responsive
			]))
			.pipe( gulp.dest(env.dist) );

	});

};