/* jshint expr: true */
/* global describe: false, it: false, before: false */
'use strict';
require('should');
var Stringify = require('../index');

describe('the "stringify" function', function () {
  before(function () {
    this.test_string = '<html><head></head><body><h1 class="bananas" title="donkies">' +
      'This is my test string HTML!</h1></body></html>';
  });

  describe('called with no XXX (default)', function () {
    before(function () {
      this.stringified_content = Stringify.stringify(this.test_string);
    });

    it('should have returned a string', function () {
      this.stringified_content.should.be.a.String;
    });

    it('should begin with module.exports = "', function () {
      this.stringified_content.should.startWith('module.exports = "');
    });

    // TODO: Figure out how to do a capture-repeat Regex for this to actually ensure all 5 newlines were preserved.
    it('should have perserved newline characters', function () {
      this.stringified_content.should.match(/\n/);
    });

    it('should have escaped the double-quotes', function () {
      this.stringified_content.should.match(/\\\"/);
    });
  });

  describe('called with exportAsEs6Default: true option', function () {
    before(function () {
      this.stringified_content = Stringify.stringify(this.test_string, true);
    });

    it('should begin with module.default = "', function () {
      console.log(this.stringified_content);
      this.stringified_content.should.startWith('exports.default = "');
    });
  });
});
