var expect = require('chai').expect,
    packageJson = require('../package.json'),
    childProcess = require('child_process');

describe('MoApp', function() {

  describe('--version', function () {
    var result1, result2;

    before(function (done) {
        childProcess.exec('moapp --version', function (error, stdout, stderr) {
            if (error) done(error);
            result1 = stdout.split("\n");
            if (result2) done();
        });
        childProcess.exec('moapp --v', function (error, stdout, stderr) {
            if (error) done(error);
            result2 = stdout.split("\n");
            if (result1) done();
        });
    });

    it('should return the correct version number with --version', function () {
        expect(result1[2]).to.equal(packageJson.version);
    });

    it('should return the correct version number with -v', function () {
        expect(result2[2]).to.equal(packageJson.version);
    });

  });

});