'use strict';
var request = require('superagent'),
    config = require('../../config/'),
    fs = require('fs-extra'),
    moConfigFile = require('./mo_app_config_file');


exports.putPackageData = function(name, version, options) {
  if(options == undefined) options = {}
  const moServer = config.moServer[options.env || 'dev']

  return moConfigFile.read(options).then((authData) => {
      return new Promise(function(resolve, reject) {
      request.put(moServer + "/api/packages/" + name + "/" + version)
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
          return reject(`${err} (${err.status})`)
	      })
      })
    })
}

exports.postPackageData = function(json, options) {
  if(options == undefined) options = {}
  const moServer = config.moServer[options.env || 'dev']

  return moConfigFile.read(options).then((authData) => {
    return new Promise(function(resolve, reject) {
      request.post(moServer + '/api/packages')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({"data": json, token: authData.token})
        .then(res => {
          return resolve(res.body)
        })
        .catch(err => {
          return reject(`${err} (${err.status})`)
	      })
    })
  })
}

exports.deletePackage = function(json, options) {
  if(options == undefined) options = {}
  const moServer = config.moServer[options.env || 'dev']

  return moConfigFile.read(options).then((authData) => {
    return new Promise(function(resolve, reject) {
      request.delete(moServer + '/api/packages/' + json.name)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({'token': authData.token})
        .then(res => {
          return resolve(res.body)
        })
        .catch(err => {
          return reject(`${err} (${err.status})`)
        })
    })
  })
}

exports.authenticate = function(json, options) {
  const moServer = config.moServer[options.env || 'dev']

  return new Promise(function(resolve, reject) {
    request.post(moServer + '/api/authenticate')
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
  const moServer = config.moServer[options.env || 'dev']

  return moConfigFile.read(options).then((authData) => {
    return new Promise((resolve, reject) => {
      const packageName = json.name

      request.post(`${moServer}/api/packages/${packageName}/rollback/${version}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({'token': authData.token})
        .then(res => {
          return resolve(res.body)
        })
        .catch(err => {
          return reject(`${err} (${err.status})`)
	      })
      })
  })
}

exports.info = (packageName, options) => {
  const moServer = config.moServer[options.env || 'dev']

  return new Promise((resolve, reject) => {
    request.get(`${moServer}/api/packages/${packageName}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .then(res => {
        return resolve(res.body)
      })
      .catch(err => {
        return reject(`${err} (${err.status})`)
	    })
  })
}

exports.search = (params, options) => {
  const moServer = config.moServer[options.env || 'dev']

  return new Promise((resolve, reject) => {
    request.get(`${moServer}/api/packages${params}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .then(res => {
        return resolve(res.body)
      })
      .catch(err => {
        return reject(`${err} (${err.status})`)
	    })
  })
}
