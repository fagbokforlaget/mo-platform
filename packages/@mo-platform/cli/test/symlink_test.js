"use strict";
const expect = require("chai").expect;
const nixt = require("nixt"),
  childProcess = require("child_process");

describe("MoApp", function () {
  describe("symlink", function () {

    describe("create", function () {
      it("should create symlink for given app", function (done) {
        nixt()
          .run(
            "moapp symlink create test-app.com --name test-app --file=test/fixtures/app/test-package.json --configFile=test/fixtures/tmp_config_file.json"
          )
          .stdout(/created/gi)
          .end(done);
      });
    });

    describe("delete", function () {
      it("should delete symlink for given app", function (done) {
        nixt()
          .run(
            "moapp symlink delete test-app.com --name test-app --file=test/fixtures/app/test-package.json --configFile=test/fixtures/tmp_config_file.json"
          )
          .stdout(/deleted/gi)
          .end(done);
      });
    });
  });
});
