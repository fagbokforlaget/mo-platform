'use strict';
const expect = require('chai').expect;
const nixt = require('nixt');

describe('MoApp', function() {
  describe('help', function () {
    it('should respond to help command', function (done) {
      nixt()
      .run('moapp --help')
      .stdout(/usage/gi)
      .stdout(/deploy/gi)
      .end(done)
    });
  });
});
