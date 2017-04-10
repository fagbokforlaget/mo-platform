module.exports = function(commandOptions) {
	var semver = require('semver'),
		fs = require('fs'),
		preReleaseName = 'moapp',
		exec = require('child_process').exec,
		chalk = require('chalk'),
		error = chalk.bold.red,
		success = chalk.bold.green,
		file = 'app.json',
		characterEncoding = 'utf8',
		noCommit = false;


  if (typeof commandOptions.commit !== "undefined") {
    noCommit = !commandOptions.commit;
  }

	var options = commandOptions.argv.remain.slice(1);
	var type = null;

	var VERSION_REGEXP = new RegExp(
	  '([\'|\"]?version[\'|\"]?[ ]*:[ ]*[\'|\"]?)([=]*[v]*)(\\d+\\.\\d+\\.\\d+(-' + preReleaseName +
	  		'\\.\\d+)?(-\\d+)?)[\\d||A-a|.|-]*([\'|\"]?)', 'i'
	);

	var validVersion = semver.valid(options[0]),
	    version = null,
		tag = null,
		pre = null;

	fs.readFile(file, characterEncoding, function (err, data) {
		if (err) return console.log(error('Error in Reading File. ' + err));

		var result =
			data.replace(VERSION_REGEXP, function(match, versionMatch, prefix, parsedVersion, namedPre, noNamePre, suffix) {
						var type = validVersion ? false : options[0];
						version = validVersion || semver.inc(
							parsedVersion, type || 'patch', preReleaseName
						);
						pre = prefix;
						/* save git tag here */
						tag = 'v' + version ;
						/* replacing the match with the whole string */
						/* replace only in case version is still not valid */
						return version !== null ? versionMatch + prefix + version + (suffix || '')
						    : versionMatch + prefix + parsedVersion + (suffix || '');
	  	});

		fs.writeFile(file, result, characterEncoding, function(err) {
			if (err) return console.log(error(err));

		});

		if (version == null) return console.log(error('Version not bumped : Error'));
		/* Do not commit if  not commit flag set to true */
		if (noCommit) return console.log(success(pre + version));

		/* Check if valid git repository or not(will also get the current HEAD) */

		exec('git rev-parse --abbrev-ref HEAD', function(err, ref, stderr) {
			if (err) return console.log(error(err));

			var cmd = [];

			/* git create Tag */
			cmd.push('git tag -a '+ tag + ' -m "Bumped version to '+ tag +'"');
			/*git push command doesn’t transfer tags to remote servers */
			/* or git push origin --tags , when a lot of tags */
			cmd.push('git push origin '+tag);
			/* git commit */

			/* git add changes */
			cmd = cmd.join(' && ');
			console.log(success(pre + version));

			exec(cmd, function(err, stdout, stderr) {
				if (err) return console.log(error(err));
				console.log(success('Pushed To HEAD'));
			});
		});


	});

};
