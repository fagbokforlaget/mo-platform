'use strict';

var fs = require('fs-extra'),
    config = require('../../config/'),
    path = require('path'),
    requests = require('../helpers/requests'),
    chalk = require('chalk'),
    info = chalk.yellow,
    error = chalk.bold.red,
    success = chalk.bold.green;

module.exports = (options, version) => {
  var distFolder = options.dist || config.distFolder || 'build';
  var packageFile = path.resolve(options.file || 'mo-app.json');
  console.log('Rolling back to v' + version);
  fs.readJSON(packageFile, (err, json) => {
    if(err) {
      console.error(error(err.message))
      return
    }

    requests.rollback(json, version, options)
	    .then((data) => {
	    	console.info(info('Version reset to ' + data.version))
	    	return
	    })
	    .catch((err) => {
	    	console.error(error(err))
	    	return
	    })

  })
}
