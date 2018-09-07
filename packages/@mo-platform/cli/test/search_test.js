'use strict';

var expect = require('chai').expect,
    childProcess = require('child_process'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    error = chalk.red,
    request = require('superagent'),
    config =  require('../config'),
    /* a 5 letter dummy string to make sure the package is random and not registered */
    randomString = 'abcdefghijkl';

describe('MoApp', function() {

  describe('search', function () {

    describe('without any search params', function () {
     it('should search all packages', function (done) {
        var result = childProcess.execSync('moapp search');
        if (result.stderr) { console.log(error(result.stderr)); }
        var output = result.toString('utf-8');
        expect(output).to.contain("No packages found");
        done();
     });
   });

  describe('with one search param having registered packages', function () {
     it('should search package with name matt', function () {
       var result = childProcess.execSync('moapp search matt');
       var output = result.toString('utf-8');

       if (result.stderr) { console.log(error(result.stderr)); }

       expect(output).to.contain('matt');
     });
   });

   describe('with one search param not having any registered packages', function () {
     it('should not search package with name randomString ' + randomString, function (done) {
        var result = childProcess.execSync('moapp search ' + randomString);
        if (result.stderr) { console.log(error(result.stderr)); }
        var output = result.toString('utf-8');
        expect(output).to.contain('No packages found');
        done();
     });
   });

   describe('with two search params both having registered packages', function () {
     it('should not search packages with both matt and app but not overlapping', function () {
        var result = childProcess.execSync('moapp search matt app');
        var output = result.toString('utf-8');

        if (result.stderr) { console.log(error(result.stderr)); }

        expect(output).to.contain('matt');
     });
   });

   describe('with regex as a search param', function () {
     it('should search packages with regex as well ' + randomString, function (done) {
        var result = childProcess.execSync('moapp search /app/gi');
        if (result.stderr) { console.log(error(result.stderr)); }
        var output = result.toString('utf-8');
        expect(output).to.contain('app');
        done();
     });
   });

  });
});
