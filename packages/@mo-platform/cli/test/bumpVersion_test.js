var expect = require('chai').expect,
    childProcess = require('child_process'),
    semver = require('semver'),
    error = require('chalk').bold.red,
    fs = require('fs-extra'),
    path = require('path'),
    file = path.resolve('mo-app.json');

describe('MoApp', function() {

  describe('bumpVersion', function () {
  	var appoVersionBefore, fileDataBefore;

  	before(function(done){
      fs.copy('./test/fixtures/app', './', function(err) {
        childProcess.exec('moapp deploy', function (error, stdout, stderr) {
          error = error
          result = stdout
          done()
        });
      });
  	});

    beforeEach(function(done){
      fileDataBefore = fs.readFileSync(file, 'utf8');
      appoVersionBefore = semver.clean((JSON.parse(fileDataBefore)).version);
      done();
    });

    after(function(done) {
      fs.remove('./dist', function(err) {
        fs.remove('app.json', function(err) {
          done()
        });
      });
    });

  	it('should bump major version with valid version', function() {
		//run appo version major.minor.patch
  		var result = childProcess.execSync('moapp version 6.1.9 --no-commit');
  		if (result.stderr) console.log(error(result.err));
  		var fileData = fs.readFileSync(file, 'utf8');
  		var appoVersionAfter = semver.clean((JSON.parse(fileData)).version);
  		expect(semver.clean(appoVersionAfter)).to.equal('6.1.9');
  	});

  	it('should bump patch when no valid version is given', function() {
  		//run appo version
  		var result = childProcess.execSync('moapp version --no-commit');
  		if (result.stderr) console.log(error(result.err));
  		var fileData = fs.readFileSync(file, 'utf8');
  		var appoVersionAfter = semver.clean((JSON.parse(fileData)).version);
  		expect(semver.inc(appoVersionBefore, 'patch')).to.equal(appoVersionAfter);
  	});

  	it('should bump minor', function() {
  		//run appo version minor
  		var result = childProcess.execSync('moapp version minor --no-commit');
  		if (result.stderr) console.log(error(result.err));
  		var fileData = fs.readFileSync(file, 'utf8');
  		var appoVersionAfter = semver.clean((JSON.parse(fileData)).version);
  		expect(semver.inc(appoVersionBefore, 'minor')).to.equal(appoVersionAfter);
  	});

  	it('should bump major', function() {
		//run appo version major
  		var result = childProcess.execSync('moapp version major --no-commit');
  		if (result.stderr) console.log(error(result.err));
  		var fileData = fs.readFileSync(file, 'utf8');
  		var appoVersionAfter = semver.clean((JSON.parse(fileData)).version);
  		expect(semver.inc(appoVersionBefore, 'major')).to.equal(appoVersionAfter);
  	});


  	it('should bump patch', function() {
		//run appo version patch
  		var result = childProcess.execSync('moapp version patch --no-commit');
  		if (result.stderr) console.log(error(result.err));
  		var fileData = fs.readFileSync(file, 'utf8');
  		var appoVersionAfter = semver.clean((JSON.parse(fileData)).version);
  		expect(semver.inc(appoVersionBefore, 'patch')).to.equal(appoVersionAfter);
  	});

  	it('should not update when semver returns null', function() {
		//run appo version wrongversion
  		var result = childProcess.execSync('moapp version 1.3 --no-commit'); // invalid semver
  		if (result.stderr) console.log(error(result.err));
  		var fileData = fs.readFileSync(file, 'utf8');
  		var appoVersionAfter = semver.clean((JSON.parse(fileData)).version);
  		expect(appoVersionBefore).to.equal(appoVersionAfter);
  	});

  });

});
