'use strict';

var fs = require('fs-extra'),
    config = require('../../config/'),
    path = require('path'),
    pckgPath = path.resolve('mo-app.json'),
    pckgFallbackPath = path.resolve('app.json'),
    ZipFile = require('../helpers/zipfile'),
    requests = require('../helpers/requests'),
    chalk = require('chalk'),
    info = chalk.yellow,
    error = chalk.bold.red,
    success = chalk.bold.green;


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
            return console.error(error('Error in Reading File. ' + err));
        }
    }

  fs.readJSON(pckgPath, function(err, json) {
  	if(err) {
  		console.error(error(err.message))
  		return
  	}

    let zipper = new ZipFile(distFolder, json.name, json.version)
    let created = false

    return zipper.zip()
      .then((data) => {
        console.log(info('Zipped package file'))
        return requests.postPackageData(json, options)
      })
      .then((data) => {
        console.log(info('Created package on server with following:'))
        console.log(data)
        created = true
        return requests.putPackageData(json.name, json.version, options)

      })
      .then((data) => {
        console.log(success('All done'))
        return
      })
      .catch((err) => {
        if (created) {
          console.info(info('Removing app from server'))
          requests.deletePackage(json, options)
        }
        console.info(info('Could not deploy:'))
        console.error(error(err.message || err))
      })

  })
}
