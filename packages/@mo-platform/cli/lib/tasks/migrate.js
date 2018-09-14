'use strict';
const fs = require('fs-extra');
const config = require('../../config/');
const path = require('path');
const chalk = require('chalk');

module.exports = (options, version) => {
  const distFolder = options.dist || config.distFolder || 'build';
  const packageFile = path.resolve(options.file || 'mo-app.json');

  console.log(chalk`{bold Looing for mo-app.json file in current directory}`)

  fs.readJSON(packageFile, (err, json) => {
    if (err) {
      return console.log(chalk`{red package file ${packageFile} not found. Please run {bold npm init}}`)
    }

    fs.readJSON(path.resolve('mo-app.json'), (error, data) => {
      if (error) {
        return console.log(chalk`{green All good nothing to be migrated}`)
      }

      json.name = data.name
      json.version = data.version
      json.main = data.main
      json.moapp = {
        configurable: data.configurable,
      }
      json.moapp.config = data.config
      console.log(json)
      fs.writeFile(packageFile, JSON.stringify(json, null, 2), 'utf-8', (writeError) => {
        if (writeError) {
          conole.error('Could not update package file. Please check if it can be written')
        }
        fs.remove(path.resolve('mo-app.json'), (delError) => {
          if (delError) {
            console.error('Error deleting mo-app.json file.')
          }
          console.log(chalk`{green All good! app migrated}`)
        })
      })
    })
  })
}
