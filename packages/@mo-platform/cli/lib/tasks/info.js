'use strict';

var fs = require('fs'),
    path = require('path'),
    pckgPath = path.resolve('mo-app.json'),
    pckgFallbackPath = path.resolve('app.json'),
    chalk = require('chalk'),
    error = chalk.bold.red,
    info = chalk.bgYellow;

module.exports = function() {

  try {
        let fileExists = fs.statSync(pckgPath);
    } catch (e) {
        try {
            let fallbackFileExists = fs.statSync(pckgFallbackPath);
            fs.rename(pckgFallbackPath, pckgPath, function(renameErr) {
                if ( renameErr ) console.log('ERROR: ' + renameErr);
                console.log(info('fallback file , app.json found , renamed the file to mo-app.json'));
            });
        } catch (err) {
            return console.log(error('Error in Reading File. ' + err));
        }
    }

    fs.readFile(pckgPath, 'utf8', function (er, d) {
        if(er) return console.log(error(er));

        console.log(d);
    });
}
