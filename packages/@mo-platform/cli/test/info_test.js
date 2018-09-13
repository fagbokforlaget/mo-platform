'use strict';
const expect = require('chai').expect;
const nixt = require('nixt');

describe('MoApp', function() {
  describe('info', function () {
    it('should build mo-app.json file', function (done) {
      nixt()
      .run('moapp info --file=test/fixtures/app/test-package.json')
      .stdout(/test-app/gi)
      .stdout(/0.0.1/gi)
      .end(done)
    });
  });
});
