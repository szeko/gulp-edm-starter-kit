var path = require('path');
var fs = require('fs');
var glob = require('glob');
var sizeOf = require('image-size');

module.exports = function (env, nunjucksEnv) {

	var srcPath = path.resolve(process.cwd(), env.src);
	var imagesPath = path.resolve(process.cwd(), env.paths.src.images);
	var imagePath = path.resolve(process.cwd(), env.paths.src.image);
	var imagesPaths = glob.sync(imagePath);
	var images = {};

	imagesPaths.forEach(function(image) {
		var pathData = path.parse(image);
		var key = path.relative(imagesPath, image);
		images[key] = {
			path: image,
			src: path.relative(srcPath, image),
			width: 0,
			height: 0
		};
	});

	function getImage(filename) {

		var image = images[filename];

		if(!image) {
			return {
				path: '',
				src: '',
				width: 0,
				height: 0
			};
		}

		if(!image.width) {
			var dimensions = sizeOf(image.path);
			image.width = dimensions.width;
			image.height = dimensions.height;
		}

		return image;
	}

	nunjucksEnv.addGlobal('getImage', getImage);

	return getImage;
}