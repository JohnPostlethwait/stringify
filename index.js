var through = require('through');

/**
 * Stringifies the content
 * @param   {string}    content
 * @returns {string}
 */
function stringify(content) {
	var stringified_content;

	stringified_content = '"' + content
		.replace(/\n/g, '\\n')
		.replace(/\r/g, '\\r')
		.replace(/"/g, '\\"')
		+ '"';

	return 'module.exports = ' + stringified_content + ';\n';
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

	/**
	 * Returns whether the file ends in an extension
	 * @param   {string} file
	 * @return  {boolean}
	 */
	function has_stringify_extension(file) {
		for (var i=0; i<extensions.length; ++i) {
			if (file.substr(-1*extensions[i].length) === extensions[i]) {
				return true;
			}
		}
		return false;
	}

	/**
	 * The browserify transform method
	 * @param   {string} file
	 * @returns {stream}
	 */
	function transform(file) {
		var content = '';

		if (!has_stringify_extension(file)) {
			return through();
		}


		function write(buffer) {
			content += buffer;
		}

		function end() {
			this.queue(stringify(content));
			this.queue(null);
		}

		return through(write, end);
	};

	return transform;
};
