var trim = require('trim');


module.exports = function(extra_extensions) {
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
    var text_handler = function (body, file) {
      return 'module.exports = "' + trim(body) + '";\n';
    };

    for (var i = 0; i < extensions.length; i++) {
      bundle.register(extensions[i], text_handler);
    }
  };

  return middleware;
};
