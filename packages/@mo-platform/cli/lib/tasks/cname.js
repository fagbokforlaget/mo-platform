'use strict';

const fs = require('fs')
const requests = require('../helpers/requests');
const chalk = require('chalk');

module.exports = async function(options) {
  let cmd = options.argv.remain[1]
  let cname = options.argv.remain[2]
  let packageName = options.name
  let response = {}
  switch(cmd) {
    case 'list':
      response = await requests.cnameList(packageName, options)
      console.log(response)
      break;
    case 'create':
      response = await requests.cnameCreate(packageName, cname, options)
      console.log(response)
      break;
    case 'delete':
      response = await requests.cnameDelete(packageName, cname, options)
      console.log(response)
      break;
    default:
      console.log(chalk.red(`Invalid command '${cmd}'`))
  }
}
