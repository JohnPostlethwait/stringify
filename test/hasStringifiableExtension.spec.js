/* jshint expr: true */
/* global describe: false, it: false, before: false */
'use strict';
var path      = require('path'),
    should    = require('should'),
    Stringify = require('../index');

describe('the "hasStringifiableExtension" function', function () {
  describe('when the filename has an extension in the array', function () {
    before(function () {
      var fixture = path.join(path.dirname('.'), 'file_fixture.txt');

      this.extensions = ['.txt', '.html', '.babies'];
      this.test_result = Stringify.hasStringifiableExtension(fixture, this.extensions);
    });

    it('should have returned "true"', function () {
      should(this.test_result).ok;
    });
  });

  describe('when the filename does not have an extension', function () {
    before(function () {
      var fixture = path.join(path.dirname('.'), 'file_fixture.txt');

      this.extensions = ['.clouds', '.sausages'];
      this.test_result = Stringify.hasStringifiableExtension(fixture, this.extensions);
    });

    it('should have returned "false"', function () {
      should(this.test_result).not.ok;
    });
  });
});
