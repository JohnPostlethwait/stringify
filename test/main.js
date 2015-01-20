/* jshint expr: true */
/* global describe: false, it: false, before: false */
'use strict';
var should    = require('should'),
    spec      = require('stream-spec'),
    stringify = require('../index');

var input = '<p   style="color: grey;"   >   should   be   minified   </p>';
var outputTransformed = 'module.exports = \"<p style=\\"color: grey\\">should be minified</p>";\n';


function write(data, stream) {
  function next() {
    if(stream.write(data) === false) {
      return stream.once('drain', next);
    }
    stream.end();
  }
  next();
}

function read(stream, callback) {
  var returned = [];
  stream.on('data', function (data) {
    returned.push(data);
  });
  stream.once('end', function () {
    callback(null, returned);
  });
  stream.once('error', function (err) {
    callback(err);
  });
}

describe('when the module is required', function () {
  it('should return a function', function () {
    stringify.should.be.a.Function;
  });
});

describe('when the module called', function () {

  describe('with no options', function () {
    before(function () {
      this.transformerFactory = stringify();
    });

    it('should return a factory function named "browserifyTransform"', function () {
      this.transformerFactory.name.should.be.exactly('browserifyTransform');
    });

    describe('when the returned function is called with a valid file path', function () {
      before(function () {
        this.transformer = this.transformerFactory('file_fixture.txt');
      });

      // TODO: Perhaps not the most reliable way to check if it is a Stream...
      it('should return a Stream object', function () {
        should(this.transformer.writable).ok;
        should(this.transformer.readable).ok;
        this.transformer.write.should.be.a.Function;
        this.transformer.end.should.be.a.Function;
      });
    });
  });

  describe('with options as first argument', function () {
    before(function () {
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxx');
      this.transformerFactory = stringify({
        extensions: ['.xxx'],
        minify: true,
        minifier: {
          extensions: ['.xxx']
        }

      });
    });

    it('should return a function named "browserifyTransform"', function () {
      this.transformerFactory.name.should.be.exactly('browserifyTransform');
    });

    it('should respond to input with the given options', function () {
      var transformer = this.transformerFactory('a_file.xxx');
      var s = spec(transformer).pausable();

      read(transformer, function (err, returnedData) {
        should(err).be.null;
        should(returnedData).be.an.array;
        should(returnedData.length).be.equal(1);
        should(returnedData[0]).be.equal(outputTransformed);
      });

      transformer.on('close', s.validate);

      write(input, transformer);
    });
  });

  describe('with a HTML file as first argument', function () {
    before(function () {
      this.transformer = stringify('a_file.html', {
        extensions: ['.html'],
        minify: true,
        minifier: {
          extensions: ['.html']
        }
      });
    });

    it('should return a Stream object', function () {
      should(this.transformer.writable).ok;
      should(this.transformer.readable).ok;
      this.transformer.write.should.be.a.Function;
      this.transformer.end.should.be.a.Function;
    });

    it('should respond to input', function () {
      var s = spec(this.transformer).pausable();

      read(this.transformer, function (err, returnedData) {
        should(err).be.null;
        should(returnedData).be.an.array;
        should(returnedData.length).be.equal(1);
        should(returnedData[0]).be.equal(outputTransformed);
      });

      this.transformer.on('close', s.validate);

      write(input, this.transformer);
    });
  });

  describe('with an unknown file as first argument', function () {
    before(function () {
      this.transformer = stringify('a_file.foo');
    });

    it('should return a Stream object', function () {
      should(this.transformer.writable).ok;
      should(this.transformer.readable).ok;
      this.transformer.write.should.be.a.Function;
      this.transformer.end.should.be.a.Function;
    });

    it('should respond without transformation', function () {
      var s = spec(this.transformer).pausable();

      read(this.transformer, function (err, returnedData) {
        should(err).be.null;
        should(returnedData).be.an.array;
        should(returnedData.length).be.equal(1);
        should(returnedData[0]).be.equal(input);
      });

      this.transformer.on('close', s.validate);

      write(input, this.transformer);
    });
  });

});
