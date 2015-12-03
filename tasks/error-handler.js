var gutil = require('gulp-util');

module.exports = function errorHandler(error) {
	gutil.beep();
	try {
		gutil.log(
			gutil.colors.bgGreen(error.plugin),
			gutil.colors.bgRed(error.message.replace(/\r?\n|\r/g, ''))
		);
	}
	catch (e) {
		console.error(error)
	}
};