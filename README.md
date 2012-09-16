# Stringify #

Browserify plugin to require() text files (like templates) inside of your client-side JavaScript files.

## Installation ##

```bash
npm install stringify
```

## Usage ##

Setup Browserify to use this middleware in your app:

```javascript
var browserify = require('browserify'),
    stringify = require('stringify');

var bundle = browserify()
    .use(stringify(['.hjs', '.html', '.whatever']))
    .addEntry('my_app_main.js');

app.use(bundle);
```
You might have noticed that you can pass stringify an optional array of file-extensions that you want to require() in your Browserify packages as strings. By default these are used: .html, .txt, .text, and .tmpl

__NOTE__: You MUST call this as I have above. The Browserify .use() method HAS to plug this middleware in to Browserify BEFORE you add the entry point (your main client-side file) for Browserify.

Now, in your clientside files you can use require() as you would for JSON and JavaScript files, but include text files that have just been parsed into a JavaScript string:

```javascript
var my_text = require('../path/to/my/text/file.txt');

console.log(my_text);
```

## More Realistic Example & Use-Case ##

The reason I created this was to get string versions of my Handlebars templates required in to my client-side JavaScript. You can theoretically use this for any templating parser though.

Here is how that is done:

application.js:
```javascript
var browserify = require('browserify'),
    stringify = require('stringify');

var bundle = browserify()
    .use(stringify(['.hbs', '.handlebars']))
    .addEntry('my_app_main.js');

app.use(bundle);
```

my_app_main.js:
```javascript
var Handlebars = require('handlebars'),
    template = require('my/template/path.hbs'),
    data = require('data.json');

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

data.json
```json
{
  "json_data": "This is my string!"
}
```
