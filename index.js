"use strict";

var path    = require('path'),
    through = require('through');

var DEFAULT_EXTENSIONS = [
  '.text',
  '.txt',
  '.html',
  '.tmpl',
  '.tpl'
];


/**
 * Creates the Browserify transform function which Browserify will pass the 
 * file to.
 * @param   {object | array}    options
 * @param   {object}            options.extensions
 * @returns {stream}
 */
module.exports = function (options) {
  var extensions = getExtensions(options);

  /**
   * The function Browserify will use to transform the input.
   * @param   {string} file
   * @returns {stream}
   */
  function browserifyTransform (file) {
    if (!hasStringifiableExtension(file, extensions)) return through();

    var chunks = [];

    function write (buffer) {
      chunks.push(buffer);
    }

    function end () {
      var contents = Buffer.concat(chunks).toString('utf8');

      this.queue(stringify(contents));
      this.queue(null);
    }

    return through(write, end);
  };

  return browserifyTransform;
};

/**
 * Stringifies the content
 * @param   {string}    content
 * @returns {string}
 */
function stringify (content) {
  return 'module.exports = ' + JSON.stringify(content) + ';\n';
}

/**
 * Takes a set of user-supplied options, and determines which set of file-
 * extensions to run Stringify on.
 * @param   {object | array}    options
 * @param   {object}            options.extensions
 * @returns {string[]}
 */ 
function getExtensions (options) {
  /**
   * The file extensions which are stringified by default.
   * @type    {string[]}
   */
  var extensions = DEFAULT_EXTENSIONS;

  if (options) {
    if (Object.prototype.toString.call(options) === '[object Array]') {
      extensions = options;
    } else if (options.extensions) {
      extensions = options.extensions;
    }
  }

  // Lowercase all file extensions for case-insensitive matching.
  extensions = extensions.map(function (ext) {
    return ext.toLowerCase();
  });

  return extensions;
}

/**
 * Returns whether the filename ends in a Stringifiable extension. Case
 * insensitive.
 * @param   {string} filename
 * @return  {boolean}
 */
function hasStringifiableExtension (filename, extensions) {
  var file_extension = path.extname(filename).toLowerCase();

  return extensions.indexOf(file_extension) > -1;
}


// Test-environment specific exports...
if (process.env.NODE_ENV) {
  module.exports.stringify                  = stringify;
  module.exports.getExtensions              = getExtensions;
  module.exports.DEFAULT_EXTENSIONS         = DEFAULT_EXTENSIONS;
  module.exports.hasStringifiableExtension  = hasStringifiableExtension;
}
