'use strict';

var expect = require('chai').expect,
    packageJson = require('../package.json'),
    childProcess = require('child_process'),
    fs = require('fs');

describe('Appo', function() {

  describe('info', function () {
    var result, output = '', answers, app_json = "app.json";

    before(function (done) {
      result = childProcess.spawn('appo', ['init'], []);

      answers = {
        name: "name",
        version: "0.0.1",
        description: 'some desc',
        main: null,
        keywords: "some no default keys",
        authors: "Some Author <some.author@example.com>",
        module: "amd",
        license: "MIT"
      };

      done();
    });

    after(function(done) {
      fs.unlink(app_json, function(e) {
        done();
      });
    })

    it('should build app.json file', function (done) {
      var i = 0;
      result.stdout.on('data', function(d) {
        var _d = (''+d).split(':')[0];

        var shift = answers[_d];

        if(shift === null) {
          shift = ''
        }

        result.stdin.write(shift + "\n");

        if(_d === "license") {
            result.stdin.end();
        }
      })

      result.on('exit', function() {
        fs.stat(app_json, function(err, stat) {
          childProcess.exec('appo info', function (error, stdout, stderr) {
            var j = JSON.parse(stdout);

            expect(j.name).to.equal(answers.name)
            done();
          });
        });

      })
    });

  });

});
