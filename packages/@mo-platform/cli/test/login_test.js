'use strict';

var expect = require('chai').expect,
    childProcess = require('child_process'),
    fs = require('fs-extra'),
    os = require('os'),
    chalk = require('chalk'),
    error = chalk.red,
    promptHelper = require('./helpers/prompt_helper'),
    path = require('path');

describe('Appo', function() {

  describe('login', function () {
    var result, output = '', answers, mo_config = path.resolve(os.homedir(), '.mo-config.json');

    before(function (done) {
      answers = {
        username: "fagbokforlaget_test",
        api_key: "123456"
      };

      result = childProcess.exec('appo login');
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
            var j = JSON.parse(data);

            expect(j.username).to.equal(answers.username);
            expect(j['api_key']).to.equal(answers['api_key']);
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
