var fs = require('fs'),
    path = require('path');

module.exports = {
  "name" : prompt('name', typeof name === 'undefined' ? basename.replace(/^node-|[.-]js$/g, ''): name),

  "version" : prompt('version', typeof version !== "undefined" ? version : '0.0.0'),

  "description" : (function () {
      if (typeof description !== 'undefined' && description) {
        return description
      }

      var value;

      try {
          var src = fs.readFileSync('README.md', 'utf8');
          value = src.split('\n').filter(function (line) {
              return /\s+/.test(line)
                  && line.trim() !== basename.replace(/^node-/, '')
                  && !line.trim().match(/^#/)
              ;
          })[0]
              .trim()
              .replace(/^./, function (c) { return c.toLowerCase() })
              .replace(/\.$/, '')
          ;
      } catch (e) {
        try {
          // Wouldn't it be nice if that file mattered?
          var d = fs.readFileSync('.git/description', 'utf8')
        } catch (e) {}

        if (d && d.trim() && !value) value = d;
      }

      return prompt('description', value);
  })(),

  "main" : prompt('main', 'index.html'),

  "keywords" : prompt(function (s) {
    if (!s) return undefined
    if (Array.isArray(s)) s = s.join(' ')
    if (typeof s !== 'string') return s
    return s.split(/[\s,]+/)
  }),

  "authors" : prompt(function (s, obj) {
    if (!s) return undefined;
    if (Array.isArray(s)) s = s.join(' ');
    if (typeof s !== 'string') return s;
    return s.split(',');
  }),

  "module": prompt('module: (amd, globals, node)', "amd"),

  "license" : prompt('license', 'MIT'),

  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "test",
    "tests"
  ]
}
