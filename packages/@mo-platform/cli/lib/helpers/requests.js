'use strict';
var unirest = require('unirest'),
    config = require('../../config/'),
    fs = require('fs-extra'),
    moConfigFile = require('./mo_app_config_file');

exports.putPackageData = function(name, version, options) {
  if(options == undefined) options = {}

  return moConfigFile.read(options).then((authData) => {
      return new Promise(function(resolve, reject) {
      unirest.put(config.moServer + "/api/packages/" + name + "/" + version)
        .headers({'Accept': 'application/json', 'Content-Type': 'multipart/form-data'})
        .field('token', authData.token)
        .attach({'package': '' + name + "-" + version + ".zip"})
        .end(function(response) {
          if(response.body && response.body.error) {
            return reject(response.body.error)
          }

          if(response.status !== 200) {
            let bodyMessage = response.body
            let errorMessage = bodyMessage ? bodyMessage : response.error


            let message = errorMessage ? errorMessage : ("undefined error, code status" + response.status)
            return reject(message)
          }

          fs.remove('' + name + "-" + version + ".zip", function(err) {
            return resolve(response.body)
          })
        })

      })
    })
}

exports.postPackageData = function(json, options) {
  if(options == undefined) options = {}

  return moConfigFile.read(options).then((authData) => {
    return new Promise(function(resolve, reject) {
      unirest.post(config.moServer + '/api/packages')
        .header('Accept', 'application/json')
        .type('json')
        .send({"data": json, token: authData.token})
        .end(function (response) {
          if(response.body && response.body.error) {
            return reject(response.body.error)
          }

          if(response.status !== 200) {
            let bodyMessage = response.body
            let errorMessage = bodyMessage ? bodyMessage : response.error


            let message = errorMessage ? errorMessage : ("undefined error, code status" + response.status)
            return reject(message)
          }

          return resolve(response.body)
        });
    })
  })
}

exports.deletePackage = function(json, options) {
  if(options == undefined) options = {}

  return moConfigFile.read(options).then((authData) => {
    return new Promise(function(resolve, reject) {
      unirest.delete(config.moServer + '/api/packages/' + json.name)
        .header('Accept', 'application/json')
        .type('json')
        .send({'token': authData.token})
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
  })
}

exports.authenticate = function(json) {
  return new Promise(function(resolve, reject) {
    unirest.post(config.moServer + '/api/authenticate')
      .header('Accept', 'application/json')
      .type('json')
      .send({"username": json.username, "api_key": json.api_key})
      .end(function (response) {
        if(response.body && response.body.error) {
          return reject(response.body.error)
        }

        if(response.status !== 200) {
          return reject(response.body)
        }

        return resolve(response.body)
      });
  })
}

exports.rollback = (json, version, options) => {
  return moConfigFile.read(options).then((authData) => {
    return new Promise((resolve, reject) => {
      unirest.post(config.moServer + '/api/packages/' + json.name + '/rollback/' + version)
            .header('Accept', 'application/json')
            .type('json')
            .send({'token': authData.token})
            .end((response) => {
              console.log(response.body)
              if(response.body && response.body.error) {
                return reject(response.body.error)
              }

              if(response.status !== 200) {
                return reject(response.body)
              }

              return resolve(response.body)
            });
    })
  })
}
