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

module.exports = async (options) => {
  const distFolder = options.dist || config.distFolder || 'build';
  const packageFile = path.resolve(options.file || 'mo-app.json');

  try {
    const fileExists = fs.statSync(packageFile);
  } catch (err) {
    return console.error(error('Error in Reading File. ' + err));
  }

  const json = await fs.readJSON(packageFile)
  const appName = options.name || json.name
  const appVersion = options.deploymentVersion || json.version

  let packageVersion

  try {
    const resp = await requests.info(appName, options)
    packageVersion = resp.version
    console.log(info(`package ${appName} exists. Applying update ...`))
  }
  catch (err) {
    console.error(error(err))
    console.log(info(`Package ${appName} does not exist. Creating one ...`))
  }

  const zipper = new ZipFile(distFolder, appName, appVersion)
  let created = false

  return zipper.zip()
    .then((data) => {
      console.log(info('Zipped package file'))
      return requests.postPackageData(appName, appVersion, json, options)
    })
    .then((data) => {
      console.log(info('Created package on server with following:'))
      console.log(data)
      created = true
      return requests.putPackageData(appName, appVersion, options)
    })
    .then((data) => {
      console.log(success(`Hooray! All done. Your web app is live at https://${appName}.app.fagbokforlaget.no/`))
      return true
    })
    .catch((err) => {
      if (created && packageVersion) {
        console.info(info('Rolling back app from server'))
        requests.rollback(appName, packageVersion, options)
          .catch((err) => {
            console.info(info('Rollback failed. you can still delete full app using moapp delete command'))
          })
      }
      else if (created) {
        console.log("errrrrrr", err)
        console.log(info('Removing newly created app ...'))
        requests.deletePackage(appName, options)
      }
      else {
        console.info(info('Could not deploy:' + err))

        const message = (err ? (err.message || err) : "unknown error")
        console.error(error(message))
      }
    })
}
