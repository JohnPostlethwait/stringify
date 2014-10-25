/* jshint expr: true */
/* global describe: false, it: false, before: false */
'use strict';
require('should');
var path      = require('path'),
    fs        = require('fs'),
    Stringify = require('../index');

function requireHtml(filename) {
  return fs.readFileSync(path.join(path.dirname('.'), 'test', filename), 'utf8');
}

describe('the "minify" function', function () {
  before(function () {
    this.givenHtml = requireHtml('minify.given.html');
    this.expectedHtml = requireHtml('minify.expected.html').replace(/\r?\n|\r/, '');
  });

  it('should return a function', function () {
    Stringify.minify.should.be.a.Function;
  });

  it('should have default minifier extensions', function () {
    var extensions = Stringify.DEFAULT_MINIFIER_EXTENSIONS;
    extensions.should.be.an.Array;
    extensions.length.should.be.exactly(5);
  });

  it('should minify html content', function () {
    Stringify.minify('some.html', this.givenHtml, {
      minify: true
    }).should.be.exactly(this.expectedHtml);
  });

  it('should not minify html content because minification is not requested', function () {
    Stringify.minify('some.html', this.givenHtml, {
      minify: false
    }).should.be.exactly(this.givenHtml);
  });

  it('should not minify html content because extension is not supported', function () {
    Stringify.minify('some.html', this.givenHtml, {
      minify: true,
      minifier: {
        extensions: ['foobar']
      }
    }).should.be.exactly(this.givenHtml);
  });
});
