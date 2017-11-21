'use strict';

var PromZard = require('promzard').PromZard,
    path = require('path'),
    input = path.resolve(__dirname, '../helpers/app-init-input.js'),
    pckgPath = path.resolve('mo-app.json'),
    fs = require('fs'),
    pkg;

module.exports = function(options) {
  var packageFile = path.resolve(options.file || 'mo-app.json');

  fs.readFile(packageFile, 'utf8', function (er, d) {
    var ctx = {};

    try {
      ctx = JSON.parse(d); pkg = JSON.parse(d)
    } catch (e) {
      ctx = {}
    }

    ctx.dirname = path.dirname(pckgPath)
    ctx.basename = path.basename(ctx.dirname)

    if (!ctx.version) {
      ctx.version = undefined
    }

    ctx.config = {}

    var pz = new PromZard(input, ctx)

    pz.on('data', function (data) {
      if (!pkg) pkg = {}

      Object.keys(data).forEach(function (k) {
        if (data[k] !== undefined && data[k] !== null) {
          pkg[k] = data[k]
        }
      })


      fs.writeFile(packageFile, JSON.stringify(pkg, null, 2), function (er) {
        if (er) {
          throw er
        }

      })
    })

    pz.on('error', function(error) {
      console.log("\nAppo error:", error.message)
    })
  })
}
