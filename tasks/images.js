var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');

module.exports = function (gulp, env, errorHandler) {

	return gulp.task('images', function() {

		return gulp.src(env.paths.src.images).on("error", errorHandler)
			.pipe(imagemin({
				use: [pngcrush()]
			}))
			.pipe(gulp.dest(env.paths.dist.images));

	});

};