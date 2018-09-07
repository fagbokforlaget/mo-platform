'use strict';
const expect = require('chai').expect;
const packageJson = require('./fixtures/app/package.json');
const childProcess = require('child_process');

describe('MoApp', function() {
  describe('info', function () {
    it('should build mo-app.json file', function (done) {
      childProcess.exec('moapp info --file=test/fixtures/app/package.json', function (error, stdout, stderr) {
        let j = JSON.parse(stdout);
	expect(j.name).to.equal(packageJson.name)
          done();
      });
    });
  });
});
