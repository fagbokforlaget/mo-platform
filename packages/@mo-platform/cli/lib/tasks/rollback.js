const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const config = require('../../config/')
const requests = require('../helpers/requests')

const info = chalk.yellow
const error = chalk.bold.red
const success = chalk.bold.green

module.exports = async (options, version) => {
  const distFolder = options.dist || config.distFolder || 'build'
  const packageFile = path.resolve(options.file || 'mo-app.json')

  console.log(info(`Rolling back to v${version}`))

  const json = await fs.readJSON(packageFile)
  const appName = options.name || json.name

  requests.rollback(json, version, options)
	  .then((data) => {
	    console.info(info('Version reset to ' + data.version))
	    return
	  })
	  .catch((err) => {
	    console.error(error(err))
	    return
	  })
}
