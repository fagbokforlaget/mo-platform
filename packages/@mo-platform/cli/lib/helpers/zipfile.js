'use strict'

var ZipFileHandler,
    yazl = require("yazl"),
    fs = require('fs'),
    walk = require('./walk');

ZipFileHandler = (function() {
  function ZipFileHandler(folder, app, version) {
    this.folder = folder
    this.name = "" + app + "-" + version
  }

  ZipFileHandler.prototype.zip = function() {
    var self = this

    return new Promise(function(resolve, reject) {
      walk(self.folder).then(function(results) {
        var zipfile = new yazl.ZipFile();
        
        var files = results.map(function(res) {
          var r = res.split('/')
          r.shift()
          r.shift()
          return {file: res, toZip: r.join('/')}
        })
        
        files.forEach(function(file) {
          zipfile.addFile(file.file, file.toZip);         
        })

        zipfile.outputStream
          .pipe(fs.createWriteStream(self.name + ".zip"))
          .on("close", function() {
            resolve(results)
          })
          .on('error', function(e) {
            reject(e)
          });

        zipfile.end();
      }).catch(function(e) {
        return reject(e)
      })
    })
  }

  return ZipFileHandler;

})();

module.exports = ZipFileHandler;
