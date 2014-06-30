"use strict";

var path      = require('path'),
    mocha     = require('mocha'),
    should    = require('should'),
    Stringify = require('../index');


describe('when the module is required', function () {
  it('should return a function', function () {
    (typeof Stringify).should.equal('function');
  });
});

describe('when the module is instantiated', function () {
  describe('with no options', function () {
    before(function () {
      this.stringify = Stringify();
    });

    it('should return a function named "browserifyTransform"', function () {
      this.stringify.name.should.equal('browserifyTransform')
    });

    describe('when the return value is called with a valid file path', function () {
      before(function () {
        var fixture = path.join(path.dirname('.'), 'file_fixture.txt');

        this.stringified = this.stringify(fixture);
      });

      // TODO: Perhaps not the most reliable way to check if it is a Stream...
      it('should return a Stream object', function () {
        should(this.stringified['writable']).ok;
        should(this.stringified['readable']).ok;
        (typeof this.stringified['write']).should.equal('function');
        (typeof this.stringified['end']).should.equal('function');
      });
    });
  });
});

describe('the "stringify" function', function () {
  before(function () {
    this.test_string = "<html>\
      <head></head>\
      <body>\
      <h1 class='bananas' title=\"donkies\">This is my test string HTML!</h1>\
      </body>\
      </html>";

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

describe('the "getExtensions" function', function () {
  function assertNonEmptyArrayInReturnedExtensions () {
    it('should have returned a non-empty array', function () {
      this.returned_extensions.should.be.an.Array;
      this.returned_extensions.should.not.be.empty;
    });
  }

  function assertCorrectExtensionsReturned () {
    it('should have returned the correct extensions', function () {
      this.returned_extensions.should.eql(this.correct_test_extensions);
    });
  }

  describe('when passed no options argument', function () {
    before(function () {
      this.correct_test_extensions = Stringify.DEFAULT_EXTENSIONS;
      this.returned_extensions = Stringify.getExtensions();
    });

    assertNonEmptyArrayInReturnedExtensions();
    assertCorrectExtensionsReturned(Stringify.DEFAULT_EXTENSIONS);
  })

  describe('when passed an array of file-extensions as an options argument', function () {
    before(function () {
      this.correct_test_extensions = ['.cookie', '.cupcake', '.halibut'];
      this.returned_extensions = Stringify.getExtensions(this.correct_test_extensions);
    });

    assertNonEmptyArrayInReturnedExtensions();
    assertCorrectExtensionsReturned();
  })

  describe('when passed an object with an "extensions" array property as an options argument', function () {
    before(function () {
      this.correct_test_extensions = ['.trains', '.are', '.fun'];

      var test_object = { extensions: this.correct_test_extensions };

      this.returned_extensions = Stringify.getExtensions(test_object);
    });

    assertNonEmptyArrayInReturnedExtensions();
    assertCorrectExtensionsReturned();
  })
});

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
