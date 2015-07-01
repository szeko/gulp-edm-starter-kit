var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var argv = require('yargs').argv;
var browserSync = require('browser-sync');
var zip = require('gulp-zip');

var sass = require('gulp-sass');
var premailer = require('gulp-premailer');

var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');

var awspublish = require('gulp-awspublish');
var litmus = require('gulp-litmus');
var replace = require('gulp-replace');
var sendmail = require('gulp-mailgun');

var pjson = require('./package.json');

try {
	var credentials = require('./credentials.json');
} catch(e) {
	var credentials = {};
}

var paths = {
	src: {
		html: 'templates/*.tpl.html',
		sass: 'styles/*.scss',
		styles: 'styles/',
		images: 'images/**/*',
		bower: 'bower_components/'
	},
	dist: {
		build: 'dist/',
		html: 'dist/*.html',
		images: 'dist/images/'
	}
};

var dev = false;

function errorHandler(error) {
	gutil.beep();
	gutil.log(
		gutil.colors.bgGreen(gutil.colors.white(error.plugin || 'ERROR')),
		gutil.colors.bgRed(gutil.colors.white(error.message.replace(/\r?\n|\r/g, '')))
	);
	this.emit('end');
};

/**
 * Styles
 */

gulp.task('sass', function() {
	return gulp.src(paths.src.sass).on("error", errorHandler)
		.pipe(sass({
			errLogToConsole: true,
			includePaths: [paths.src.bower + 'ink/scss/']
		}))
		.pipe(gulp.dest(paths.src.styles));
});


/**
 * Inline
 */

gulp.task('inline', function() {
	return gulp.src(paths.src.html).on("error", errorHandler)
		.pipe(premailer({
			entities: true
		}))
		.pipe(rename(function (path) {
			path.basename = path.basename.replace('.tpl', '');
		}))
		.pipe(gulp.dest(paths.dist.build))
		.pipe( dev ? browserSync.reload({ stream: true, once: true }) : gutil.noop() );
});


/**
 * Images
 */

gulp.task('imagemin', function() {
	return gulp.src(paths.src.images).on("error", errorHandler)
		.pipe(imagemin({
			use: [pngcrush()]
		}))
		.pipe(gulp.dest(paths.dist.images));
});


/**
 * Server
 */

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: paths.dist.build
		},
		open: false,
		notify: true
	});
});

gulp.task('reload', function() {
	browserSync.reload();
});


/**
 * Testing
 */

gulp.task('test', ['build'], function() {
	var emails = argv.emails;
	var html = publishToS3();
	var subject = '[PREVIEW] ' + (argv.subject || pjson.subject || pjson.name);

	if(emails && emails.length) {
		emails = emails.replace(/ /g,'').split(',');
		emails.forEach(function(emailAddress) {
			sendEmail(html, subject, emailAddress);
		});
	} else {
		sendToLitmus(html, subject);
	}

});

function publishToS3() {

	if(!credentials.aws) {
		errorHandler({ message:
			'AWS credentials are not defined'
		});
	}

	var publisher = awspublish.create(credentials.aws),
		s3url = credentials.aws.endpoint + '/' + pjson.name + '/',
		headers = {};

	gulp.src(paths.dist.images + '*').on("error", errorHandler)
		.pipe(rename(function (path) {
			path.dirname += '/' + pjson.name;
		}))
		.pipe(publisher.publish(headers))
		.pipe(publisher.cache())
		.pipe(awspublish.reporter());

	return gulp.src([paths.dist.html])
		.pipe(replace(/([\"\'])images\//g, '$1' + s3url));
}

function sendToLitmus(html, subject) {

	if(!credentials.litmus) {
		return errorHandler({
			message: 'Litmus credentials are not defined'
		});
	}

	var options = credentials.litmus;
	options.subject = subject || pjson.name;

	return html.pipe(litmus(options));
}

function sendEmail(html, subject, to) {

	if(!credentials.mailgun) {
		return errorHandler({
			message: 'Mailgun credentials are not defined'
		});
	}

	var options = credentials.mailgun;
	options.recipient = to;
	options.subject = subject || pjson.name;

	// gutil.log(gutil.colors.cyan('[Mailgun]'), 'Test email sent to', gutil.colors.magenta(to));

	return html.pipe(sendmail(options));
}


/**
 * Package
 */

gulp.task('zip', ['zip-images', 'zip-dist']);

gulp.task('zip-images', function () {
	return gulp.src(paths.dist.images + '/**/*')
		.pipe(zip('images.zip'))
		.pipe(gulp.dest(paths.dist.build));
});

gulp.task('zip-dist', function () {
	return gulp.src(paths.dist.build + '/**/*')
		.pipe(zip(pjson.name + '.zip'))
		.pipe(gulp.dest('./'));
});


/**
 * Tasks
 */

gulp.task('watch', function() {
	dev = true;
	gulp.watch(paths.src.sass, ['sass', 'inline']);
	gulp.watch(paths.src.images, ['imagemin']);
	gulp.watch(paths.src.html, ['inline']);
});

gulp.task('clean', require('del').bind(null, [paths.dist.build] ));

gulp.task('build-html', ['clean', 'sass', 'inline']);

gulp.task('build-images', ['imagemin']);

gulp.task('build', ['build-html', 'build-images']);

gulp.task('default', ['build', 'browser-sync', 'watch']);

