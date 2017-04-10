'use strict';

var fs = require('fs'),
    path = require('path'),
    os = require('os'),
    PromZard = require('promzard').PromZard,
    configInfo = path.resolve(__dirname, '../helpers/app-config.js'),
    configPath = path.resolve(os.homedir(), '.mo-config.json'),
    config = {};

module.exports = function() {
  fs.readFile(configPath, 'utf8', function (err, data) {
    var ctx = {};

    try {
      ctx = JSON.parse(data);
      config = JSON.parse(data);
    } catch (e) {
      ctx = {}
    }

    ctx.dirname = path.dirname(configPath);
    ctx.basename = path.basename(ctx.dirname);

    var pz = new PromZard(configInfo, ctx);

    pz.on('data', function (configData) {
      if (!config) config = {};

      Object.keys(configData).forEach(function (k) {
        if (configData[k] !== undefined && configData[k] !== null) {
          config[k] = configData[k];
        }
      })


      fs.writeFile(configPath, JSON.stringify(config, null, 2), function (er) {
        if (er) {
          throw er;
        }

      })
    })

    pz.on('error', function(error) {
      console.log("\nAppo error:", error.message)
    })
  })
}
