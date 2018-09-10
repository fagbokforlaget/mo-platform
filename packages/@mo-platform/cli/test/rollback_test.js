'use strict';

var expect = require('chai').expect,
    childProcess = require('child_process'),
    fs = require('fs-extra');

describe('MoApp', function() {

  describe('rollback', function () {
    var result;
    var error;

    describe('with package app json', function() {

      it('check rollback', function(done) {
        childProcess.exec('moapp rollback 0.0.1 --file=test/fixtures/app/test-package.json --configFile=test/fixtures/tmp_config_file.json', function(error, stdout, stderr) {
          expect(stdout).to.match(/Rolling back to/)
          done()
        })
      })
    })
  });
});
