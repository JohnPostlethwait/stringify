'use strict';
var gulp          = require('gulp'),
    gulpif        = require('gulp-if'),
    istanbul      = require('gulp-istanbul'),
    jshint        = require('gulp-jshint'),
    mocha         = require('gulp-mocha'),
    openInBrowser = require('gulp-open'),
    stylish       = require('jshint-stylish'),
    yargs         = require('yargs').argv,
    browser       = !!yargs.browser,
    coverage      = !!yargs.coverage;

gulp.task('lint', function () {
  return gulp.src([
      './*.js',
      './src/**/*.js',
      './test/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', function () {
  process.env.NODE_ENV = true;
  return gulp.src('./src/**/*.js')
    .pipe(gulpif(coverage, istanbul()))
    .on('finish', function () {
      return gulp.src('./test/**/*.js', {
        read: false
      })
      .pipe(mocha({
        reporter: 'spec'
      }))
      .pipe(gulpif(coverage, istanbul.writeReports({
        dir: './coverage'
      })))
      .on('finish', function () {
        return gulp.src('./coverage/lcov-report/index.html')
          .pipe(gulpif(
            coverage && browser,
            openInBrowser('file://' + __dirname + '/coverage/lcov-report/index.html')
          ));
      });
    });
});
