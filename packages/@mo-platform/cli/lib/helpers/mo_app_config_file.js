'use strict';
var fs = require('fs-extra'),
    path = require('path'),
    os = require('os');

exports.read = function(options) {
  let configFile = options.configFile || path.resolve(os.homedir(), '.mo-config.json')

  return new Promise(function(resolve, reject) {
  	fs.readFile(configFile, 'utf8', (err, data) => {
  	  if(err) return reject(configFile + " file is missing. Please login")
  	  try {
  	    return resolve(JSON.parse(data))
  	  } catch(e) {
  	  	console.log(e)
  	  	return reject(e)
  	  }
  	})
  })
}