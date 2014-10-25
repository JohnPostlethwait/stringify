/* jshint expr: true */
/* global describe: false, it: false */
'use strict';
require('should');
var Stringify = require('../index');

describe('the "getMinifierOptions" function', function () {
  it('should have returned default configuration for minifier', function () {
    var options = Stringify.getMinifierOptions();
    options.should.be.an.Object;
    options.requested.should.be.exactly.false;
    options.extensions.should.be.exactly(Stringify.DEFAULT_MINIFIER_EXTENSIONS);
    options.options.should.be.exactly(Stringify.DEFAULT_MINIFIER_OPTIONS);
  });

  it('should have returned overriden configuration for minifier', function () {
    var minifierExtensions = ['html'];
    var minifierOptions = {
      foo: 'bar'
    };
    var options = Stringify.getMinifierOptions({
      minify: true,
      minifier: {
        extensions: minifierExtensions,
        options: minifierOptions
      }
    });

    options.should.be.an.Object;
    options.requested.should.be.exactly.true;
    options.extensions.should.be.exactly(minifierExtensions);
    options.options.should.be.exactly(minifierOptions);
  });
});
