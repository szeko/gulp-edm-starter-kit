var del = require('del');

module.exports = function (gulp, env, errorHandler) {

	return gulp.task('clean', del.bind(null, [env.dist] ));

};