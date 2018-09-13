'use strict';

// use nopt to parse commandline options
var nopt = require("nopt");
var tasks = require('./tasks');

// CLI options
exports.known = {
  help: Boolean,
  version: Boolean
};

// CLI options aliases
exports.aliases = {
  h:'--help',
  v:'--version'
};

// parse it
Object.defineProperty(exports, 'options', {
  get: function() {
    return nopt(exports.known, exports.aliases, process.argv, 2);
  }
});

exports.run =  function() {
  let options = exports.options;

  if (!options.file) {
    options.file = 'package.json'
  }

  if (options.argv.original.length === 0 || options['help'] || options.argv.remain[0] === "help") {
    return tasks.help();
  }

  if (options['version']) {
    return tasks.version();
  }

  if (options.argv.remain.length && options.argv.remain[0] === "info") {
    return tasks.info(options);
  }

  if (options.argv.remain.length && options.argv.remain[0] === "deploy") {
    return tasks.deploy(options);
  }

  if (options.argv.remain.length && options.argv.remain[0] === "delete") {
    return tasks.undeploy(options);
  }

  if (options.argv.remain.length && options.argv.remain[0] === "search") {
    return tasks.search(options);
  }

  if (options.argv.remain.length && options.argv.remain[0] === "login") {
    return tasks.login(options);
  }

  if (options.argv.remain.length && options.argv.remain[0] === "rollback") {
    return tasks.rollback(options, options.argv.remain[1]);
  }

  console.error('Invalid command: '+ options.argv.remain[0]);
  return;
}
