'use strict';

var path = require('path'),
    fs = require('fs-extra'),
    PromZard = require('promzard').PromZard,
    input = path.resolve(__dirname, '../helpers/undeploy_prompt.js'),
    pckgPath = path.resolve('mo-app.json'),
    pckgFallbackPath = path.resolve('app.json'),
    requests = require('../helpers/requests'),
    chalk = require('chalk'),
    error = chalk.bold.red,
    info = chalk.bgYellow,
    prompta;

module.exports = function(options) {
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

  	return prompta().then(function(data) {
          return requests.deletePackage(json, options)
        })
  			.then(function(data) {
  				console.log(data)
          return
  			})
  			.catch(function(e) {
  				console.log(e)
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