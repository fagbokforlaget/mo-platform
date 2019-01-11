'use strict';

const expect = require('chai').expect;
const nixt = require('nixt');

describe('MoApp', function() {

  describe('undeploy', function () {
    describe('without mo-app.json', function() {
      it('should throw error when app.json is missing', function(done) {
        nixt()
        .run('moapp delete --file=cool --configFile=tmp_config_file.json')
        .on(/sure/gi).respond('y\n')
        .stderr(/error/gi)
        .end(done)
      })
    })

    describe('with mo-app.json', function() {
      it('should send request for deleting package', function(done) {
        nixt()
        .run('moapp delete --configFile=test/fixtures/tmp_config_file.json --file=test/fixtures/app/test-package.json')
        .on(/sure/gi).respond('y\n')
        .stdout(/status: \'ok\'/)
        .end(done)
      })
    })

    describe('without acceptance', function() {
      it('should send request for deleting package', function(done) {
        nixt()
        .run('moapp delete --configFile=test/fixtures/tmp_config_file.json --file=test/fixtures/app/test-package.json')
        .on(/sure/gi).respond('n\n')
        .stderr(/aborted/gi)
        .end(done)
      })
    })
  });
});
