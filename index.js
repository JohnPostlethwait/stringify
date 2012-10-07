
module.exports = function (extra_extensions) {

  var extensions = [
    '.text',
    '.txt',
    '.html',
    '.tmpl'
  ];

  if (!Array.isArray(extra_extensions)) {
    extra_extensions = Array.prototype.slice.call(arguments);
  }

  extra_extensions.forEach(function(ext) {
    if (extensions.indexOf(ext) == -1) {
      extensions.push(ext);
    }
  });

  var middleware = function (bundle) {

    function stringifyText(text) {
      var stringified_text;

      stringified_text = text.replace(/\"/g, '\u005C\u0022');
      stringified_text = stringified_text.replace(/^(.*)/gm, '"$1');
      stringified_text = stringified_text.replace(/(.+)$/gm, '$1" +');
      stringified_text = stringified_text.replace(/\+$/, '');

      return stringified_text;
    }

    var text_handler = function (body, file) {
      var safe_body = stringifyText(body);

      return 'module.exports = ' + safe_body + ';\n';
    };

    for (var i = 0; i < extensions.length; i++) {
      bundle.register(extensions[i], text_handler);
    }
  };

  return middleware;
};
