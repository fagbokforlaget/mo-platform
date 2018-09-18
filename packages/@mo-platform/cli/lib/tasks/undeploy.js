'use strict';
const path = require('path');
const fs = require('fs-extra')
const input = path.resolve(__dirname, '../helpers/undeploy_prompt.js');
const requests = require('../helpers/requests');
const chalk = require('chalk');
const prompts = require('prompts');
const error = chalk.bold.red;
const info = chalk.bgYellow;
const allowedEnvs = ['prod', 'dev', 'stage'];

let prompta;

module.exports = function(options) {
  let packageFile = path.resolve(options.file || 'mo-app.json');
  let env = options.env || 'prod'

  if (!allowedEnvs.includes(env)) {
    return console.error(error('Invalid env, allowed envs are ' + allowedEnvs.join(', ')))
  }

  try {
    let fileExists = fs.statSync(packageFile);
  } catch (err) {
    return console.error(error('Error in Reading File. ' + err));
  }

  fs.readJSON(packageFile, function(err, json) {
    if(err) {
      console.log(err.message)
      return
    }

    // append name with env
    if (env !== 'prod') {
      json.name = (json.moapp
        && json.moapp.env
        && json.moapp.env[env]
        && json.moapp.env[env].name) ? json.moapp.env[env].name : json.name + '-' + env
    }

    return prompta().then(function(data) {
      return requests.deletePackage(json, options)
    })
    .then(function(data) {
      console.log(data)
      return
    })
    .catch(function(e) {
      console.error(e)
      return
    })
  })
}

prompta = function prompta() {
  return new Promise(async function(resolve, reject) {
    let response = await prompts({
      type: 'confirm',
      name: 'action',
      message: 'Are you sure you want to remove this app?'
    });

    if(!response.action) {
      return reject("Action aborted.")
    } else {
      return resolve()
    }
  })
}
