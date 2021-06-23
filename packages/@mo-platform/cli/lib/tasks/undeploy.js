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
  const force = options.force || json.force || false

  return prompta(appName, options, force).then((data) => {
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

prompta = (appName, options, force = false) => {
  return new Promise(async function(resolve, reject) {
    if (force) {
      return resolve()
    }

    let response = await prompts({
      type: 'confirm',
      name: 'action',
      message: `Are you sure you want to remove ${appName} app?`
    });

    let abort = false
    if(response.action) {
      let list = {}
      requests.cnameList(appName, options).then((data) => {
        list = data
        if (Object.keys(list).some(v => v == "cnames") && list.cnames.length) {
          let proceed = await prompts({
            type: 'confirm',
            name: 'action',
            message: `Proceeding will also delete cnames: ${list.cnames.join(", ")} for this app. Do you want to proceed?`
          })
          if(!proceed.action) {
            abort = true
          }
        }
      })
    } else {
      abort = true
    }

    if (abort) {
      return reject("Action aborted.")
    }
    return resolve()
  })
}
