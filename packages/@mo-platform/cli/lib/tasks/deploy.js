'use strict';

var fs = require('fs-extra'),
    config = require('../../config/'),
    path = require('path'),
    pckgPath = path.resolve('app.json'),
    ZipFile = require('../helpers/zipfile'),
    requests = require('../helpers/requests');


module.exports = function(options) {
  var distFolder = options.dist || config.distFolder || 'build';

  fs.readJSON(pckgPath, function(err, json) {
  	if(err) {
  		console.log(err.message)
  		return
  	}

  	return requests.postPackageData(json, options)
  			.then(function(data) {
  				console.log(data)
  				return new ZipFile(distFolder, json.name, json.version).zip()
  			})
  			.then(function(data) {
  				return requests.putPackageData(json.name, json.version, options)
  			})
  			.then(function(data) {
  				console.log(data)
  				return
  			})
  			.catch(function(e) {
  				console.log("error", e)
  				return
  			})

  })
}
