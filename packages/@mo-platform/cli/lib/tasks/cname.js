'use strict';

const fs = require('fs-extra')
const requests = require('../helpers/requests')
const path = require('path')
const chalk = require('chalk')


module.exports = async (options) => {
  const packageFile = path.resolve(options.file || 'mo-app.json')
  const json = await fs.readJSON(packageFile)
  const appName = options.name || json.name
  const cmd = options.argv.remain[1]
  const cname = options.argv.remain[2]
  let response = {}
  switch(cmd) {
    case 'list':
      response = await requests.cnameList(appName, options)
      break;
    case 'create':
      response = await requests.cnameCreate(appName, cname, options)
      break;
    case 'delete':
      response = await requests.cnameDelete(appName, cname, options)
      break;
    default:
      response = chalk.red(`Invalid command '${cmd}'`)
  }
  console.log(response)
}
