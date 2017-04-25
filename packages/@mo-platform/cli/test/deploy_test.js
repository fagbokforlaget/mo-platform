'use strict';

var expect = require('chai').expect,
    childProcess = require('child_process'),
    fs = require('fs-extra'),
    promptHelper = require('./helpers/prompt_helper');

describe('MoApp', function() {

  describe('deploy', function () {
    var result;

    describe('without app.json', function() {
      before(function (done) {
        fs.copy('./test/fixtures/tmp_config_file.json', './tmp_config_file.json', (err) => {
          childProcess.exec('moapp deploy --configFile=tmp_config_file.json', function(error, stdout, stderr) {
            result = stdout
            done()
          });
        })
      });

      it('should throw error when app.json is missing', function(done) {
          expect(result).to.match(/no such file/)
          done()
      })
    })

    describe('with app.json', function() {
      var result, error;

      before(function (done) {
        fs.copy('./test/fixtures/tmp_config_file.json', './tmp_config_file.json', (err) => {
          fs.copy('./test/fixtures/app', './', function(err) {
            childProcess.exec('moapp deploy --configFile=tmp_config_file.json', function(error, stdout, stderr) {
              error = error
              result = stdout
              done()
            });
          })
        })
      });

      after(function(done) {
        fs.remove('./dist', function(err) {
          fs.remove('app.json', function(err) {
            done()
          })
        })
      })

      it('should send request for creating package', function(done) {
        expect(result).to.match(/name: \'test-app\'/)
        done()
      })

      it('should send package', function(done) {
        expect(result).to.match(/status: \'ok\'/)
        done()
      })
    })
  });
});