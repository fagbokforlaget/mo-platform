'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const requests = require('../helpers/requests');
const config = require('../../config');
const error = chalk.bold.red;
const info = chalk.bgYellow;

module.exports = function(options) {
  var packageFile = path.resolve(options.file || 'mo-app.json');

  try {
    let fileExists = fs.statSync(packageFile);
  } catch (err) {
    return console.error(error('Error in Reading File. ' + err));
  }

  fs.readFile(packageFile, 'utf8', async function (er, d) {
    let packageInfo = {_id: undefined, version: undefined};
    const pkg = JSON.parse(d)

    if(er) return console.log(error(er));

	  packageInfo = await requests.info(pkg.name, options)

    console.log(packageInfo)

    console.log(chalk`
      name: {green ${pkg.name}}
      version: {green ${pkg.version}}
    `)

    console.log(chalk`
      id: {green ${packageInfo._id}}
      version deployed: {green ${packageInfo.version}}
    `)
  });
}
