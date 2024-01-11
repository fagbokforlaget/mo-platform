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
      request.put(`${moServer}/api/packages/${name}/${version}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'multipart/form-data')
        .attach('package', name + "-" + version + ".zip")
        .field('token', authData.token)
        .then(res => {
          fs.remove(`${name}-${version}.zip`, (err) => {
            return resolve(res.body)
          })
        })
        .catch(err => {
          return reject(`${err} (${err.status})`)
	      })
      })
    })
}

exports.postPackageData = function(name, version, json, options) {
  if(options == undefined) options = {}
  const moServer = config.moServer[options.env || 'dev']
  // Override name and version if present in json
  json.name = name
  json.version = version

  return moConfigFile.read(options).then((authData) => {
    return new Promise(function(resolve, reject) {
      request.post(`${moServer}/api/packages`)
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

exports.deletePackage = function(name, options) {
  if(options == undefined) options = {}
  const moServer = config.moServer[options.env || 'dev']

  return moConfigFile.read(options).then((authData) => {
    return new Promise(function(resolve, reject) {
      request.delete(`${moServer}/api/packages/${name}`)
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

  console.log(moServer)
  return new Promise(function(resolve, reject) {
    request.post(`${moServer}/api/authenticate`)
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

exports.rollback = (name, version, options) => {
  const moServer = config.moServer[options.env || 'dev']

  return moConfigFile.read(options).then((authData) => {
    return new Promise((resolve, reject) => {
      request.post(`${moServer}/api/packages/${name}/rollback/${version}`)
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

exports.info = (name, options) => {
  const moServer = config.moServer[options.env || 'dev']

  return new Promise((resolve, reject) => {
    request.get(`${moServer}/api/packages/${name}`)
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

exports.cnameList = (name, options) => {
  if(options == undefined) options = {}
  const moServer = config.moServer[options.env || 'dev']

  return moConfigFile.read(options).then((authData) => {
    return new Promise((resolve, reject) => {
      request.get(`${moServer}/api/cnames/${name}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({token: authData.token})
        .then(res => {
          return resolve(res.body)
        })
        .catch(err => {
          return reject(`${err} (${err.status})`)
        })
    })
  })
}

exports.cnameCreate = (name, cname, options) => {
  if(options == undefined) options = {}
  const moServer = config.moServer[options.env || 'dev']

  return moConfigFile.read(options).then((authData) => {
    return new Promise((resolve, reject) => {
      request.post(`${moServer}/api/cnames/${name}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({"cname": cname, "ssl": options.ssl, "www": options.www, token: authData.token})
        .then(res => {
          return resolve(res.body)
        })
        .catch(err => {
          throw new Error(`${err} (${err.status})`)
        })
    })
  })
}

exports.cnameDelete = (name, cname, options) => {
  if(options == undefined) options = {}
  const moServer = config.moServer[options.env || 'dev']

  return moConfigFile.read(options).then((authData) => {
    return new Promise((resolve, reject) => {
      request.delete(`${moServer}/api/cnames/${name}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({"cname": cname, token: authData.token})
        .then(res => {
          return resolve(res.body)
        })
        .catch(err => {
          return reject(`${err} (${err.status})`)
        })
    })
  })
}

exports.symlinkCreate = ( name, appName, options ) => {
  if(options == undefined) options = {}
  const moServer = config.moServer[options.env || 'dev']

  return moConfigFile.read(options).then((authData) => {
    return new Promise((resolve, reject) => {
      request.post(`${moServer}/api/symlink/${name}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({"symlink": name, "appName": appName, "www": options.www, token: authData.token})
        .then(res => {
          return resolve(res.body)
        })
        .catch(err => {
          throw new Error(`${err} (${err.status})`)
        })
    })
  })
}

exports.symlinkDelete = (name, options) => {
  if (options == undefined) options = {};
  const moServer = config.moServer[options.env || "dev"];
  return moConfigFile.read(options).then((authData) => {
    return new Promise((resolve, reject) => {
      request
        .delete(`${moServer}/api/symlink/${name}`)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .send({ symlink: name, token: authData.token })
        .then((res) => {
          return resolve(res.status);
        })
        .catch((err) => {
          return reject(`${err} (${err.status})`);
        });
    });
  });
};