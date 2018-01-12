'use strict';

var fs = require('fs-extra'),
    config = require('../../config/'),
    path = require('path'),
    ZipFile = require('../helpers/zipfile'),
    requests = require('../helpers/requests'),
    chalk = require('chalk'),
    info = chalk.yellow,
    error = chalk.bold.red,
    success = chalk.bold.green;


module.exports = function(options) {
  var distFolder = options.dist || config.distFolder || 'build';
  var packageFile = path.resolve(options.file || 'mo-app.json');

  try {
    let fileExists = fs.statSync(packageFile);
  } catch (err) {
    return console.error(error('Error in Reading File. ' + err));
  }

  fs.readJSON(packageFile, function(err, json) {
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
        return true
      })
      .catch((err) => {
        if (created) {
          console.info(info('Removing app from server'))
          requests.deletePackage(json, options)
        }
        console.info(info('Could not deploy:'))

        let message = (err ? (err.message || err) : "unknown error")
        console.error(error(message))
      })

  })
}
