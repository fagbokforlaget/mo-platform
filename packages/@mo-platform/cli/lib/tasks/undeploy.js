'use strict';

var path = require('path'),
    fs = require('fs-extra'),
    PromZard = require('promzard').PromZard,
    input = path.resolve(__dirname, '../helpers/undeploy_prompt.js'),
    pckgPath = path.resolve('app.json'),
    requests = require('../helpers/requests'),
    prompta;

module.exports = function(options) {
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