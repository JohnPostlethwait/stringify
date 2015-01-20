# Stringify #

Browserify plugin to require() text files (such as HTML templates) inside of your client-side JavaScript files.

## Installation ##

```bash
npm install stringify
```

## Usage ##

### Browserify Command Line ###

`browserity -t stringify myfile.js`

### Browserify Middleware ###

```javascript
var browserify = require('browserify'),
    stringify = require('stringify');

var bundle = browserify()
    .transform(stringify(['.hjs', '.html', '.whatever']))
    .add('my_app_main.js');

app.use(bundle);
```

You might have noticed that you can pass stringify an optional array of file-extensions that you want to require() in your Browserify packages as strings. By default these are used: .html, .txt, .text, and .tmpl

__NOTE__: You MUST call this as I have above. The Browserify .transform() method HAS to plug this middleware in to Browserify BEFORE you add the entry point (your main client-side file) for Browserify.

Now, in your clientside files you can use require() as you would for JSON and JavaScript files, but include text files that have just been parsed into a JavaScript string:

```javascript
var my_text = require('../path/to/my/text/file.txt');

console.log(my_text);
```

If you require an HTML file and you want to minify the requested string, you can configure Stringify to do it:

```javascript
stringify({
  extensions: ['.txt', '.html'],
  minify: true,
  minifier: {
    extensions: ['.html'],
    options: {
      // html-minifier options
    }
  }
})
```

__minifier__ options are optional.

Default __minifier.extensions__:

```javascript
['.html', '.htm', '.tmpl', '.tpl', '.hbs']
```

Default __minifier.options__ (for more informations or to override those options, please go to [html-minifier github](https://github.com/kangax/html-minifier)):

```javascript
{
  removeComments: true,
  removeCommentsFromCDATA: true,
  removeCDATASectionsFromCDATA: true,
  collapseWhitespace: true,
  conservativeCollapse: false,
  preserveLineBreaks: false,
  collapseBooleanAttributes: false,
  removeAttributeQuotes: true,
  removeRedundantAttributes: false,
  useShortDoctype: false,
  removeEmptyAttributes: false,
  removeScriptTypeAttributes: false,
  removeStyleLinkTypeAttributes: false,
  removeOptionalTags: false,
  removeIgnored: false,
  removeEmptyElements: false,
  lint: false,
  keepClosingSlash: false,
  caseSensitive: false,
  minifyJS: false,
  minifyCSS: false,
  minifyURLs: false
}
```

## Usage with gulp and gulp-browserify

To incorporate stringify into a `gulp` build process using `gulp-browserify`, register `stringify` as a transform as follows:

```javascript
gulp.task('js', function() {
  return gulp.src('src/main.js', { read: false })
    .pipe(browserify({
      transform: stringify({
        extensions: ['.html'], minify: true
      })
    }))
    .pipe(gif(env !== 'dev', uglify()))
    .pipe(gulp.dest(paths.build));
});
```

## More Realistic Example & Use-Case ##

The reason I created this was to get string versions of my Handlebars templates required in to my client-side JavaScript. You can theoretically use this for any templating parser though.

Here is how that is done:

application.js:
```javascript
var browserify = require('browserify'),
    stringify = require('stringify');

var bundle = browserify()
    .transform(stringify(['.hbs', '.handlebars']))
    .addEntry('my_app_main.js');

app.use(bundle);
```

my_app_main.js:
```javascript
var Handlebars = require('handlebars'),
    template = require('my/template/path.hbs'),
    data = {
      "json_data": "This is my string!"
    };

var hbs_template = Handlebars.compile(template);

// Now I can use hbs_template like I would anywhere else, passing it data and getting constructed HTML back.
var constructed_template = hbs_template(data);

/*
  Now 'constructed_template' is ready to be appended to the DOM in the page!
  The result of it should be:

  <p>This is my string!</p>
*/
```

my/template/path.hbs:
```html
<p>{{ json_data }}</p>
```

## Contributing ##

If you would like to contribute code, please do the following:

1. Fork this repository and make your changes.
2. Write tests for any new functionality. If you are fixing a bug that tests did not cover, please make a test that reproduces the bug.
3. Add your name to the "contributors" section in the `package.json` file.
4. Squash all of your commits into a single commit via `git rebase -i`.
5. Run the tests by running `npm install && make test` from the source directory.
6. Assuming those pass, send the Pull Request off to me for review!

Please do not iterate the package.json version number – I will do that myself when I publish it to NPM.

### Style-Guide ###

Please follow this simple style-guide for all code contributions:

* Indent using spaces.
* camelCase all callables.
* Place a space after a conditional or function name, and its conditions/arguments. `function (...) {...}`
