'use strict';
var request = require('superagent'),
    config = require('../../config/'),
    fs = require('fs-extra'),
    moConfigFile = require('./mo_app_config_file');

exports.putPackageData = function(name, version, options) {
  if(options == undefined) options = {}

  return moConfigFile.read(options).then((authData) => {
      return new Promise(function(resolve, reject) {
      request.put(config.moServer + "/api/packages/" + name + "/" + version)
        .set('Accept', 'application/json')
	.set('Content-Type', 'multipart/form-data')
        .attach('package', name + "-" + version + ".zip")
        .field('token', authData.token)
        .then(res => {
          fs.remove('' + name + "-" + version + ".zip", (err) => {
            return resolve(res.body)
          })
        })
        .catch(err => {
	  console.log(err)
          return reject(err.body)
	})
      })
    })
}

exports.postPackageData = function(json, options) {
  if(options == undefined) options = {}

  return moConfigFile.read(options).then((authData) => {
    return new Promise(function(resolve, reject) {
      request.post(config.moServer + '/api/packages')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({"data": json, token: authData.token})
        .then(res => {
          return resolve(res.body)
        })
        .catch(err => {
	  console.log(err)
          return reject(err.body)
	})
    })
  })
}

exports.deletePackage = function(json, options) {
  if(options == undefined) options = {}

  return moConfigFile.read(options).then((authData) => {
    return new Promise(function(resolve, reject) {
      request.delete(config.moServer + '/api/packages/' + json.name)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({'token': authData.token})
        .then(res => {
          return resolve(res.body)
        })
        .catch(err => {
          return reject(err.body)
	})
    })
  })
}

exports.authenticate = function(json) {
  return new Promise(function(resolve, reject) {
    request.post(config.moServer + '/api/authenticate')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({"username": json.username, "api_key": json.api_key})
      .then(res => {
        return resolve(res.body)
      })
      .catch(err => {
        return reject(err.response.body)
      })
  })
}

exports.rollback = (json, version, options) => {
  return moConfigFile.read(options).then((authData) => {
    return new Promise((resolve, reject) => {
      request.post(config.moServer + '/api/packages/' + json.name + '/rollback/' + version)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({'token': authData.token})
        .then(res => {
          return resolve(res.body)
        })
        .catch(err => {
          return reject(err.body)
	})
      })
  })
}
