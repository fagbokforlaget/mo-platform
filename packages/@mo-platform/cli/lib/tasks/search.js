'use strict';

var config = require('../../config/'),
  requests = require('../helpers/requests'),
	chalk = require('chalk'),
	boldInfo = chalk.bold.yellow,
	packageInfo = chalk.blue,
	error = chalk.red,
	table = require('cli-table'),
	searchExpressions,
    searchResults = new table({
	    head: ['Name', 'Description', 'Version', 'Author/s', 'Keyword/s'],
	    colWidths: [10, 20, 10, 20, 20]
	});

function showPackageInfo(element) {
	var description = element.data.description ? element.data.description : "",
		authors = element.data.authors ? element.data.authors.join(",") : "",
		keywords = element.data.keywords ? element.data.keywords.join(",") : "";

	searchResults.push([element.name, description, element.data.version, authors, keywords]);
}

module.exports = async function(options) {
	searchExpressions = options.argv.remain.slice(1);
	/* server supports search for more than one expression now , which can be a regex as well*/
	let params = searchExpressions && searchExpressions.length > 0 ? '?name=' + searchExpressions.join(',') : '';
	let packages = await requests.search(params, options)

	if (!packages || packages.length === 0) {
	  let info = params == '' ? 'No packages found' : 'No packages found for ' + searchExpressions.join(',');
		console.log(boldInfo(info));
		return;
	}

	if (!searchExpressions || searchExpressions.length === 0 || params == '') {
			console.log(boldInfo('Showing all packages'));
	}

	packages.forEach(showPackageInfo);
	console.log(searchResults.toString());
};
