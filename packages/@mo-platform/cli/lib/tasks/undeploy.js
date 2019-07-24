'use strict';
const path = require('path');
const fs = require('fs-extra')
const input = path.resolve(__dirname, '../helpers/undeploy_prompt.js');
const requests = require('../helpers/requests');
const chalk = require('chalk');
const prompts = require('prompts');
const error = chalk.bold.red;
const info = chalk.bgYellow;

let prompta;

module.exports = async (options) => {
  const packageFile = path.resolve(options.file || 'mo-app.json');

  try {
    let fileExists = fs.statSync(packageFile);
  } catch (err) {
    return console.error(error('Error in Reading File. ' + err));
  }

  const json = await fs.readJSON(packageFile)
  const appName = options.name || json.name

  return prompta(appName).then((data) => {
    return requests.deletePackage(appName, options)
  })
  .then((data) => {
    console.log(data)
    return
  })
  .catch((e) => {
    console.error(e)
    return
  })
}

prompta = (appName) => {
  return new Promise(async function(resolve, reject) {
    let response = await prompts({
      type: 'confirm',
      name: 'action',
      message: `Are you sure you want to remove ${appName} app?`
    });

    if(!response.action) {
      return reject("Action aborted.")
    } else {
      return resolve()
    }
  })
}
