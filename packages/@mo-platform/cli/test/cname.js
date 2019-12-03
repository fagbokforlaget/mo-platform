'use strict';
const expect = require('chai').expect;
const nixt = require('nixt');

describe('MoApp', function() {
  describe('cname', function () {

    describe('list', function() {
      it('should list cnames for given app', function (done) {
        nixt()
        .run('moapp cname list --name test-app')
        .stdout(/cnames/gi)
        .end(done)
      });
    })

    describe('create', function() {
      it('should create cname for given app', function (done) {
        nixt()
        .run('moapp cname create test-app.com --name test-app')
        .stdout(/created/gi)
        .end(done)
      });
    })

    describe('delete', function() {
      it('should delete cname for given app', function (done) {
        nixt()
        .run('moapp cname delete test-app.com --name test-app')
        .stdout(/deleted/gi)
        .end(done)
      });
    })

  });
});
