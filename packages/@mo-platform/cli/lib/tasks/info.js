'use strict';

var fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    error = chalk.bold.red,
    info = chalk.bgYellow;

module.exports = function(options) {
  var packageFile = path.resolve(options.file || 'mo-app.json');

  try {
    let fileExists = fs.statSync(packageFile);
  } catch (err) {
    return console.error(error('Error in Reading File. ' + err));
  }

  fs.readFile(packageFile, 'utf8', function (er, d) {
    if(er) return console.log(error(er));
    console.log(d);
  });
}
