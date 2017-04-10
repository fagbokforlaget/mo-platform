'use strict';

var expect = require('chai').expect,
    packageJson = require('../package.json'),
    childProcess = require('child_process'),
    fs = require('fs'),
    promptHelper = require('./helpers/prompt_helper');

describe('Appo', function() {

  describe('init', function () {
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
      promptHelper(result, answers, "license")
        .then(function(data) {
          fs.stat(app_json, function(err, stat) {
            expect(err).to.equal(null)
            done()
          })
        })
    });

    it('should return the correct version number with -v', function (done) {
      fs.readFile(app_json, 'utf8', function (err,data) {
        var j = JSON.parse(data);

        expect(j.name).to.equal(answers.name);
        expect(j.version).to.equal(answers.version);
        expect(j.main).to.equal("index.html");
        expect(j.keywords.length).to.equal(4);
        expect(j.keywords.indexOf('some') > -1).to.equal(true);

        done()
      });
    });

  });

});
