'use strict';
var unirest = require('unirest'),
    config = require('../../config/'),
    fs = require('fs-extra');

exports.putPackageData = function(name, version) {
  return new Promise(function(resolve, reject) {
    unirest.put(config.moServer + "/api/packages/" + name + "/" + version)
      .header('Accept', 'application/json')
      .field('s', 'f')
      .attach({'package': '' + name + "-" + version + ".zip"})
      .end(function(response) {
        if(response.error) {
          return reject(response.error.message)
        }

        if(response.status !== 200) {
          return reject(response.body)
        }

        fs.remove('' + name + "-" + version + ".zip", function(err) {
          return resolve(response.body)
        })
      })

  })
}

exports.postPackageData = function(json) {
  return new Promise(function(resolve, reject) {
    unirest.post(config.moServer + '/api/packages')
      .header('Accept', 'application/json')
      .type('json')
      .send({"data": json})
      .end(function (response) {
        if(response.error) {
          return reject(response.error.message)
        }
        
        if(response.status !== 200) {
          return reject(response.body)
        }

        return resolve(response.body)
      });
  })
}

exports.deletePackage = function(json) {
  return new Promise(function(resolve, reject) {
    unirest.delete(config.moServer + '/api/packages/' + json.name)
      .header('Accept', 'application/json')
      .type('json')
      .end(function (response) {
        if(response.error) {
          return reject(response.error.message)
        }

        if(response.status !== 200) {
          return reject(response.body.error)
        }
        
        return resolve(response.body)
      });
  })
}
