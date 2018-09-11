'use strict';

var expect = require('chai').expect,
    childProcess = require('child_process'),
    fs = require('fs-extra'),
    os = require('os'),
    chalk = require('chalk'),
    error = chalk.red,
    path = require('path'),
    nixt = require('nixt');

describe('MoApp', function() {

  describe('login', function () {
    let result, output = '', mo_config = '.mo-config.json';

    it('should build .mo-config.json file', function (done) {
      nixt()
      .run(`moapp login  --configFile=${mo_config}`)
      .on(/username/gi).respond('fagbokforlaget\n')
      .on(/api/gi).respond('123456\n')
      .stdout(/config file/gi)
      .end(done)
    });

    it('the config file should have username and api_keys as defined', function (done) {
      fs.readFile(mo_config, 'utf8', function (err,data) {
        let j = JSON.parse(data);

        expect(j['username']).to.equal('fagbokforlaget');
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
