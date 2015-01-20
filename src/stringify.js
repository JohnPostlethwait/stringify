'use strict';
var htmlMinifier = require('html-minifier'),
    path         = require('path'),
    through      = require('through');

var DEFAULT_MINIFIER_EXTENSIONS = [
  '.html',
  '.htm',
  '.tmpl',
  '.tpl',
  '.hbs'
];

var DEFAULT_EXTENSIONS = DEFAULT_MINIFIER_EXTENSIONS.concat([
  '.text',
  '.txt'
]);

var DEFAULT_MINIFIER_OPTIONS = {
  removeComments: true,
  removeCommentsFromCDATA: true,
  removeCDATASectionsFromCDATA: true,
  collapseWhitespace: true,
  conservativeCollapse: false,
  preserveLineBreaks: false,
  collapseBooleanAttributes: false,
  removeAttributeQuotes: true,
  removeRedundantAttributes: false,
  useShortDoctype: false,
  removeEmptyAttributes: false,
  removeScriptTypeAttributes: false,
  removeStyleLinkTypeAttributes: false,
  removeOptionalTags: false,
  removeIgnored: false,
  removeEmptyElements: false,
  lint: false,
  keepClosingSlash: false,
  caseSensitive: false,
  minifyJS: false,
  minifyCSS: false,
  minifyURLs: false
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
 * Provides user or default options for html-minifier module
 * @param   {object}    options
 * @param   {object}    options.minifier
 * @returns {object}
 */
function getMinifierOptions (_options) {
  var options = _options || {};
  var minifier = options.minifier || {};
  return {
    requested : !!options.minify,
    extensions: minifier.extensions || DEFAULT_MINIFIER_EXTENSIONS,
    options: minifier.options || DEFAULT_MINIFIER_OPTIONS
  };
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

/**
 * Returns minified contents if requested
 * @param   {string} filename
 * @param   {string} contents
 * @param   {object} options
 * @return  {string}
 */
function minify(filename, contents, options) {
  var minifier = getMinifierOptions(options);

  if (minifier.requested && hasStringifiableExtension(filename, minifier.extensions)) {
    return htmlMinifier.minify(contents, minifier.options);
  }

  return contents;
}


/**
 * Exposes the Browserify transform function.
 *
 * This handles two use cases:
 * - Factory: given no arguments or options as first argument it returns
 *   the transform function
 * - Standard: given file (and optionally options) as arguments a stream is
 *   returned. This follows the standard pattern for browserify transformers.
 *
 * @param   {string}            file
 * @param   {object | array}    options
 * @returns {stream | function} depending on if first argument is string.
 */
module.exports = function (file, options) {

  /**
   * The function Browserify will use to transform the input.
   * @param   {string} file
   * @returns {stream}
   */
  function browserifyTransform (file) {
    var extensions = getExtensions(options);

    if (!hasStringifiableExtension(file, extensions)) {
      return through();
    }
    var chunks = [];

    var write = function (buffer) {
      chunks.push(buffer);
    };

    var end = function () {
      var contents = Buffer.concat(chunks).toString('utf8');

      this.queue(stringify(minify(file, contents, options)));
      this.queue(null);
    };

    return through(write, end);
  }

  if (typeof file !== 'string') {
    // Factory: return a function.
    // Set options variable here so it is ready for when browserifyTransform
    // is called. Note: first argument is the options.
    options = file;
    return browserifyTransform;
  } else {
    return browserifyTransform(file);
  }
};

// Test-environment specific exports...
if (process.env.NODE_ENV) {
  module.exports.stringify                   = stringify;
  module.exports.getExtensions               = getExtensions;
  module.exports.DEFAULT_EXTENSIONS          = DEFAULT_EXTENSIONS;
  module.exports.hasStringifiableExtension   = hasStringifiableExtension;
  module.exports.minify                      = minify;
  module.exports.getMinifierOptions          = getMinifierOptions;
  module.exports.DEFAULT_MINIFIER_EXTENSIONS = DEFAULT_MINIFIER_EXTENSIONS;
  module.exports.DEFAULT_MINIFIER_OPTIONS    = DEFAULT_MINIFIER_OPTIONS;
}
