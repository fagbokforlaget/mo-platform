'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const prompts = require('prompts');
const requests = require('../helpers/requests');

module.exports = (options) => {
  const configFile = options.configFile || path.resolve(os.homedir(), '.mo-config.json')
  let config = {}

  fs.readFile(configFile, 'utf8', async (err, data) => {
    let ctx = {};

    if (!err) {
      try {
        ctx = JSON.parse(data);
        config = JSON.parse(data);
      } catch (e) {
        ctx = {}
      }
    }

    ctx.dirname = path.dirname(configFile);
    ctx.basename = path.basename(ctx.dirname);

    let questions = [
      {
        type: 'text',
        name: 'username',
        message: 'Authentication username'
      },
      {
        type: 'text',
        name: 'apiKey',
        message: 'Authentication API key'
      }
    ];

    if (!options.username || !options.apiKey) {
      const response = await prompts(questions)

      config.username = response.username
      config.api_key = response.apiKey
    } else {
      config.username = options.username
      config.api_key = options.apiKey
    }

    requests.authenticate(config, options)
      .then((data) => {
        config.token = data.token
        fs.writeFile(configFile, JSON.stringify(config, null, 2), (err) => {
          if (err) {
            throw err;
          }
          else {
            console.log('Success! config file is located at ' + configFile)
	        }
        })
      })
      .catch((e) => {
        console.error(e)
      });
  })
}
