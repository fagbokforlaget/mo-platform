'use strict';

var path = require('path'),
    fs = require('fs-extra'),
    PromZard = require('promzard').PromZard,
    input = path.resolve(__dirname, '../helpers/undeploy_prompt.js'),
    requests = require('../helpers/requests'),
    chalk = require('chalk'),
    error = chalk.bold.red,
    info = chalk.bgYellow,
    prompta;

module.exports = function(options) {
  var packageFile = path.resolve(options.file || 'mo-app.json');

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
  return new Promise(function(resolve, reject) {
    var pz = new PromZard(input, {})

    pz.on('data', function (data) {
      if(data.acceptance.toLowerCase() === 'n') {
        return reject("Action aborted.")
      } else {
        return resolve()
      }
    })
  })
}
