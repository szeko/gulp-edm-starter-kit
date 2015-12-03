var argv = require('yargs').argv;
var awspublish = require('gulp-awspublish');
var litmus = require('gulp-litmus');
var replace = require('gulp-replace');
var sendmail = require('gulp-mailgun');

module.exports = function (gulp, env, errorHandler) {

	function publishToS3() {

		if(!env.credentials.aws) {
			errorHandler({ message:
				'AWS credentials are not defined'
			});
		}

		var publisher = awspublish.create(env.credentials.aws),
			s3url = env.credentials.aws.endpoint + '/' + env.pjson.name + '/',
			headers = {};

		gulp.src(env.paths.dist.images + '*').on("error", errorHandler)
			.pipe(rename(function (path) {
				path.dirname += '/' + env.pjson.name;
			}))
			.pipe(publisher.publish(headers))
			.pipe(publisher.cache())
			.pipe(awspublish.reporter());

		return gulp.src([env.paths.dist.html])
			.pipe(replace(/([\"\'])images\//g, '$1' + s3url));
	}

	function sendToLitmus(html, subject) {

		if(!env.credentials.litmus) {
			return errorHandler({
				message: 'Litmus credentials are not defined'
			});
		}

		var options = env.credentials.litmus;
		options.subject = subject || env.pjson.name;

		return html.pipe(litmus(options));
	}

	function sendEmail(html, subject, to) {

		if(!env.credentials.mailgun) {
			return errorHandler({
				message: 'Mailgun credentials are not defined'
			});
		}

		var options = env.credentials.mailgun;
		options.recipient = to;
		options.subject = subject || env.pjson.name;

		// gutil.log(gutil.colors.cyan('[Mailgun]'), 'Test email sent to', gutil.colors.magenta(to));

		return html.pipe(sendmail(options));
	}

	gulp.task('test', ['build'], function() {
		var emails = argv.emails;
		var html = publishToS3();
		var subject = '[PREVIEW] ' + (argv.subject || env.pjson.subject || env.pjson.name);

		if(emails && emails.length) {
			emails = emails.replace(/ /g,'').split(',');
			emails.forEach(function(emailAddress) {
				sendEmail(html, subject, emailAddress);
			});
		} else {
			sendToLitmus(html, subject);
		}

	});

};