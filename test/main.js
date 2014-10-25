/* jshint expr: true */
/* global describe: false, it: false, before: false */
'use strict';
var path      = require('path'),
    should    = require('should'),
    Stringify = require('../index');

describe('when the module is required', function () {
  it('should return a function', function () {
    Stringify.should.be.a.Function;
  });
});

describe('when the module is instantiated', function () {
  describe('with no options', function () {
    before(function () {
      this.stringify = new Stringify();
    });

    it('should return a function named "browserifyTransform"', function () {
      this.stringify.name.should.be.exactly('browserifyTransform');
    });

    describe('when the return value is called with a valid file path', function () {
      before(function () {
        var fixture = path.join(path.dirname('.'), 'file_fixture.txt');

        this.stringified = this.stringify(fixture);
      });

      // TODO: Perhaps not the most reliable way to check if it is a Stream...
      it('should return a Stream object', function () {
        should(this.stringified.writable).ok;
        should(this.stringified.readable).ok;
        this.stringified.write.should.be.a.Function;
        this.stringified.end.should.be.a.Function;
      });
    });
  });
});
