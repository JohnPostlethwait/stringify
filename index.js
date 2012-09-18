
module.exports = function (extra_extensions) {

  var extensions = [
    '.text',
    '.txt',
    '.html',
    '.tmpl'
  ];

  if (Object.prototype.toString.call(extra_extensions) !== '[object Array]') {
    extra_extensions = [];
  }

  for (var i = 0; i < extra_extensions.length; i++) {
    if (extensions[extra_extensions[i]]) { continue; }

    extensions.push(extra_extensions[i]);
  }

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
