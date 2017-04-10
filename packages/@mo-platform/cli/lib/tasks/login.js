'use strict';

var fs = require('fs'),
    path = require('path'),
    os = require('os'),
    PromZard = require('promzard').PromZard;

module.exports = function(options) {
  let config = {};
  let configInfo = path.resolve(__dirname, '../helpers/app-config.js');
  let configFile = options.configFile || path.resolve(os.homedir(), '.mo-config.json')

  fs.readFile(configFile, 'utf8', function (err, data) {
    var ctx = {};

    if (!err) {
      try {
        ctx = JSON.parse(data);
        config = JSON.parse(data);
      } catch (e) {
        ctx = {}
      }
    } else {
      console.log("This will create a new file: " + configFile);
    }

    ctx.dirname = path.dirname(configFile);
    ctx.basename = path.basename(ctx.dirname);

    var pz = new PromZard(configInfo, ctx);

    pz.on('data', function (configData) {
      if (!config) config = {};

      Object.keys(configData).forEach(function (k) {
        if (configData[k] !== undefined && configData[k] !== null) {
          config[k] = configData[k];
        }
      })


      fs.writeFile(configFile, JSON.stringify(config, null, 2), function (er) {
        if (er) {
          throw er;
        }

      })
    })

    pz.on('error', function(error) {
      console.log("\moapp error:", error.message)
    });
  })
}
