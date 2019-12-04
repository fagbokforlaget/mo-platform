'use strict';
const expect = require('chai').expect;
const nixt = require('nixt'),
childProcess = require('child_process');

describe('MoApp', function() {
  describe('cname', function () {

    describe('list', function() {
      it('should list cnames for given app', function (done) {
        nixt()
        .run('moapp cname list --name test-app --file=test/fixtures/app/test-package.json --configFile=test/fixtures/tmp_config_file.json')
        .stdout(/cnames/gi)
        .end(done)
      })
    })

    describe('create', function() {
      it('should create cname for given app', function (done) {
        nixt()
        .run('moapp cname create test-app.com --name test-app --file=test/fixtures/app/test-package.json --configFile=test/fixtures/tmp_config_file.json')
        .stdout(/created/gi)
        .end(done)
      })
    })

    describe('delete', function() {
      it('should delete cname for given app', function (done) {
        nixt()
        .run('moapp cname delete test-app.com --name test-app --file=test/fixtures/app/test-package.json --configFile=test/fixtures/tmp_config_file.json')
        .stdout(/deleted/gi)
        .end(done)
      })
    })

    describe('invalid', function() {
      it('should raise error', function (done) {
        nixt()
        .run('moapp cname invalid test-app.com --name test-app --file=test/fixtures/app/test-package.json --configFile=test/fixtures/tmp_config_file.json')
        .stdout(/invalid/gi)
        .end(done)
      })
    })

  });
});
