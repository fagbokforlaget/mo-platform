'use strict';

var fs = require('fs-extra'),
    config = require('../../config/'),
    path = require('path'),
    pckgPath = path.resolve('mo-app.json'),
    pckgFallbackPath = path.resolve('app.json'),
    ZipFile = require('../helpers/zipfile'),
    requests = require('../helpers/requests'),
    chalk = require('chalk'),
    info = chalk.bgYellow,
    error = chalk.bold.red;


module.exports = function(options) {
  var distFolder = options.dist || config.distFolder || 'build';

  try {
        let fileExists = fs.statSync(pckgPath);
    } catch (e) {
        try {
            let fallbackFileExists = fs.statSync(pckgFallbackPath);
            fs.rename(pckgFallbackPath, pckgPath, function(renameErr) {
                if ( renameErr ) console.log('ERROR: ' + renameErr);
                console.log(info('fallback file , app.json found , renaming the file to mo-app.json'));
            });
        } catch (err) {
            return console.log(error('Error in Reading File. ' + err));
        }
    }

  fs.readJSON(pckgPath, function(err, json) {
  	if(err) {
  		console.log(err.message)
  		return
  	}

  	return requests.postPackageData(json, options)
  			.then(function(data) {
  				console.log(data)
  				return new ZipFile(distFolder, json.name, json.version).zip()
  			})
  			.then(function(data) {
  				return requests.putPackageData(json.name, json.version, options)
  			})
  			.then(function(data) {
  				console.log(data)
  				return
  			})
  			.catch(function(e) {
  				console.log("error", e)
  				return
  			})

  })
}
