'use strict';

var expect = require('chai').expect,
    childProcess = require('child_process'),
    fs = require('fs-extra'),
    os = require('os'),
    chalk = require('chalk'),
    error = chalk.red,
    promptHelper = require('./helpers/prompt_helper'),
    path = require('path');

describe('MoApp', function() {

  describe('login', function () {
    var result, output = '', answers, mo_config = '.mo-config.json';

    before(function (done) {
      answers = {
        username: "fagbokforlaget",
        api_key: "123456"
      };

      result = childProcess.exec('moapp login  --configFile='+ mo_config);
      done();
    });

    it('should build .mo-config.json file', function (done) {
        promptHelper(result, answers, "api_key")
        .then(function(data) {
          fs.stat(mo_config, function(err, stat) {
            expect(err).to.equal(null);
            done();
          })
        });
    });

    it('the config file should have username and api_keys as defined', function (done) {
       fs.readFile(mo_config, 'utf8', function (err,data) {
            let j = JSON.parse(data);

            expect(j['username']).to.equal(answers['username']);
            done()
       });
    });

    after(function(done) {
      fs.unlink(mo_config, function(e) {
        done();
      });
    });

  });
});
