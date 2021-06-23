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
  // let list = {}
  // list = await requests.cnameList(appName, options)
  let list = [{"cnames":["test-app.com"]}]

  return prompta(appName, list, force).then((data) => {
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

prompta = (appName, list, force = false) => {
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
      if (list.length && list[0].cnames.length) {
        let proceed = await prompts({
          type: 'confirm',
          name: 'action',
          message: `Proceeding will also delete cname: ${list[0].cnames[0]} for this app. Do you want to proceed?`
        })
        if(!proceed.action) {
          abort = true
        }
      }
    } else {
      abort = true
    }

    if (abort) {
      return reject("Action aborted.")
    }
    return resolve()
  })
}
