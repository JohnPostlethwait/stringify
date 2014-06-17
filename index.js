var path = require('path');
var through = require('through');

/**
 * Stringifies the content
 * @param   {string}    content
 * @returns {string}
 */
function stringify(content) {
	return 'module.exports = ' + JSON.stringify(content) + ';\n';
}

/**
 * Creates the
 * @param   {object | array}    options
 * @param   {object}            options.extensions
 * @returns {stream}
 */
module.exports = function(options) {

	/**
	 * The file extensions of file which should be stringified
	 * @type    {string[]}
	 */
	var extensions = [
		'.text',
		'.txt',
		'.html',
		'.tmpl',
		'.tpl'
	];

	if (options) {
		if (Object.prototype.toString.call(options) === '[object Array]') {
			extensions = options;
		} else if(options.extensions) {
			extensions = options.extensions;
		}
	}

	// lowercase all file extensions for case-insensitive matching
	extensions = extensions.map(function (ext) {
		return ext.toLowerCase();
	});

	/**
	 * Returns whether the filename ends in an extension
	 * @param   {string} filename
	 * @return  {boolean}
	 */
	function has_stringify_extension(filename) {
		var ext = path.extname(filename).toLowerCase();
		return extensions.indexOf(ext) > -1;
	}

	/**
	 * The browserify transform method
	 * @param   {string} file
	 * @returns {stream}
	 */
	function transform(file) {
		if (!has_stringify_extension(file)) {
			return through();
		}

		var chunks = [];

		function write(buffer) {
			chunks.push(buffer);
		}

		function end() {
			var contents = Buffer.concat(chunks).toString('utf8');
			this.queue(stringify(contents));
			this.queue(null);
		}

		return through(write, end);
	};

	return transform;
};
