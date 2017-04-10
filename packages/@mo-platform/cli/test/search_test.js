'use strict';

var expect = require('chai').expect,
    childProcess = require('child_process'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    error = chalk.red,
    app = require('unirest'),
    config =  require('../config'),
    /* a 5 letter dummy string to make sure the package is random and not registered */
    randomString = (Math.random().toString(36)+'00000000000000000').slice(2, 7);

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
        if (result.stderr) { console.log(error(result.stderr)); }
        var output = result.toString('utf-8');
        app.get(config.moServer + 'api/packages?name=matt', function (req, res) {
          var packages = req.toJSON().body;
          if (packages.length === 0) {
            expect(output).to.contain('No Match Found for matt');
          }
          expect(output).to.contain(packages[0].name);
        });
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
        if (result.stderr) { console.log(error(result.stderr)); }
        var output = result.toString('utf-8');

        app.get(config.moServer + 'api/packages?name=matt,app', function (req, res){
          var packages = req.toJSON().body;
          if (packages.length == 0) {
            expect(output).to.contain('No Match Found for matt');
          }
          expect(output).to.contain(packages[0].name);
        });
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
