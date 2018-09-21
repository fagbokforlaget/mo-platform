'use strict';

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const config = require('../../config/');
const ZipFile = require('../helpers/zipfile');
const requests = require('../helpers/requests');

const info = chalk.yellow;
const error = chalk.bold.red;
const success = chalk.bold.green;
const allowedEnvs = ['prod', 'dev', 'stage'];

module.exports = (options) => {
  let distFolder = options.dist || config.distFolder || 'build';
  let packageFile = path.resolve(options.file || 'mo-app.json');

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
        console.info(info('Could not deploy:' + err))

        let message = (err ? (err.message || err) : "unknown error")
        console.error(error(message))
      })

  })
}
