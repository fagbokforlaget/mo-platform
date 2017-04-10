'use strict';

var fs = require('fs');

var walk = function(dir) {
  return new Promise(function(resolve, reject) {
    var results = []
    fs.readdir(dir, function(err, list) {
      if(err) {
        return reject(err)
      }

      var pending = list.length

      if(!pending) {
        return resolve(results)
      }

      list.forEach(function(file) {
        file = dir + "/" + file

        fs.stat(file, function(err, stat) {
          if(stat && stat.isDirectory()) {
            walk(file).then(function(data) {
              results = results.concat(data)
              if(!--pending) {
                return resolve(results)
              }
            })
          } else {
            results.push(file)
            if(!--pending) {
              return resolve(results)
            }
          }
        })
      })
    })
  })
}

module.exports = walk