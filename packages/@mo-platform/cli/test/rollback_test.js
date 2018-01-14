'use strict';

var expect = require('chai').expect,
    childProcess = require('child_process'),
    fs = require('fs-extra'),
    promptHelper = require('./helpers/prompt_helper');

describe('MoApp', function() {

  describe('rollback', function () {
    var result;
    var error;

    describe('without app.json', function() {
      before(function (done) {
        fs.copy('./test/fixtures/tmp_config_file.json', './tmp_config_file.json', (err) => {
          fs.copy('./test/fixtures/app', './', function(err) {
            childProcess.exec('moapp rollback 0.0.1 --configFile=tmp_config_file.json', function(error, stdout, stderr) {
              error = error
              result = stdout
              done()
            });
          })
        })
      });

      after(function(done) {
        fs.remove('./dist', function(err) {
          fs.remove('mo-app.json', function(err) {
            done()
          })
        })
      })

      it('should throw error when app.json is missing', function(done) {
          expect(result).to.match(/name: \'test-app\'/)
          done()
      })
    })

  });
});
