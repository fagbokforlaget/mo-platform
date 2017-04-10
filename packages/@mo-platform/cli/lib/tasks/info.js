'use strict';

var fs = require('fs'),
    path = require('path'),
    pckgPath = path.resolve('app.json');

module.exports = function() {
  fs.readFile(pckgPath, 'utf8', function (er, d) {
    if(er) return;

    console.log(d);
  });
}
