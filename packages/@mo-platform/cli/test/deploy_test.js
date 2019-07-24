'use strict';

var expect = require('chai').expect,
    childProcess = require('child_process'),
    fs = require('fs-extra'),
    promptHelper = require('./helpers/prompt_helper');

describe('MoApp', function() {

  describe('deploy', function () {
    var result;

    describe('without package.json', function() {
      before(function (done) {
        childProcess.exec('moapp deploy --configFile=test/fixtures/tmp_config_file.json', function(error, stdout, stderr) {
          result = stderr
          done()
        });
      });

      it('should throw error when package.json is missing', function(done) {
          expect(result).to.match(/ENOENT/)
          done()
      })
    })

    describe('with package.json', function() {
      var result, error;

      before(function (done) {
        fs.copy('./test/fixtures/app', './', function(err) {
          childProcess.exec('moapp deploy --file=test-package.json --configFile=test/fixtures/tmp_config_file.json', function(error, stdout, stderr) {
            error = error
            result = stdout
            done()
          });
        })
      });

      after(function(done) {
        fs.remove('./dist', function(err) {
          fs.remove('test-package.json', function(err) {
            done()
          })
        })
      })

      it('should send request for creating package', function(done) {
        expect(result).to.match(/name: \'test-app\'/)
        done()
      })

      it('should send package', function(done) {
        expect(result).to.match(/done/)
        done()
      })
    })

    describe('with package.json and env=stage', function() {
      let result, error;

      before(function (done) {
        fs.copy('./test/fixtures/app', './', function(err) {
          childProcess.exec('moapp deploy --env=stage --file=test-package.json --configFile=test/fixtures/tmp_config_file.json', function(error, stdout, stderr) {
            error = error
            result = stdout
            done()
          });
        })
      });

      after(function(done) {
        fs.remove('./dist', function(err) {
          fs.remove('test-package.json', function(err) {
            done()
          })
        })
      })

      it('should send request for creating package', function(done) {
        expect(result).to.match(/name: \'test-app\'/)
        done()
      })

      it('should send package', function(done) {
        expect(result).to.match(/done/)
        done()
      })
    })

    describe('with package.json and name=appName', function() {
      let result, error;

      before(function (done) {
        fs.copy('./test/fixtures/app', './', function(err) {
          childProcess.exec('moapp deploy --name=my-lovely-app --file=test-package.json --configFile=test/fixtures/tmp_config_file.json', function(error, stdout, stderr) {
            error = error
            result = stdout
            done()
          });
        })
      });

      after(function(done) {
        fs.remove('./dist', function(err) {
          fs.remove('test-package.json', function(err) {
            done()
          })
        })
      })

      it('should send request for creating package', function(done) {
        expect(result).to.match(/name: \'my-lovely-app\'/)
        done()
      })

      it('should send package', function(done) {
        expect(result).to.match(/done/)
        done()
      })
    })
  });
});
