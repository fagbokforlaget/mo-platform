'use strict';

var expect = require('chai').expect,
    childProcess = require('child_process'),
    fs = require('fs-extra'),
    promptHelper = require('./helpers/prompt_helper');

describe('MoApp', function() {

  describe('undeploy', function () {
    var result;

    describe('without mo-app.json', function() {
      before(function (done) {
        fs.copy('./test/fixtures/tmp_config_file.json', './', (err) => {
          childProcess.exec('moapp delete --configFile=tmp_config_file.json', function (error, stdout, stderr) {
            result = stderr
            done()
          })
        })
      });

      it('should throw error when app.json is missing', function(done) {
          expect(result).to.match(/no such file/)
          done()
      })
    })

    describe('with mo-app.json', function() {
      var result, error;
      before(function (done) {
        fs.copy('./test/fixtures/tmp_config_file.json', './tmp_config_file.json', (err) => {
          fs.copy('./test/fixtures/app', './', function(err) {
            var cp = childProcess.spawn('moapp', ['delete', '--configFile=tmp_config_file.json'])

            promptHelper(cp, {"Are you sure? (y/n)": 'y'}, "Are you sure? (y/n)")
              .then(function(data) {
                result = data
                done()
              })
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

      it('should send request for deleting package', function(done) {
        expect(result).to.match(/status: \'ok\'/)
        done()
      })
    })

    describe('without acceptance', function() {
      var result, error;

      before(function (done) {
        fs.copy('./test/fixtures/tmp_config_file.json', './tmp_config_file.json', (err) => {
          fs.copy('./test/fixtures/app', './', function(err) {
            var cp = childProcess.spawn('moapp', ['delete', '--configFile=tmp_config_file.json'])

            promptHelper(cp, {"Are you sure? (y/n)": 'n'}, "Are you sure? (y/n)")
	      .then(function(err) {
		result = err
		done()
	      })
          })
        })
      });

      after(function(done) {
        fs.remove('./dist', function(err) {
          fs.remove('mo-app.json', function(err) {
            fs.remove('tmp_config_file.json', (err) => {
              done()
            })
          })
        })
      })

      it('should send request for deleting package', function(done) {
        expect(result).to.match(/aborted/)
        done()
      })
    })
  });
});
