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
  var options = exports.options;
  if (options.argv.original.length === 0 || options['help'] || options.argv.remain[0] === "help") {
    return tasks.help();
  }

  if (options['version']) {
    return tasks.version();
  }

  if (options.argv.remain.length && options.argv.remain[0] === "info") {
    return tasks.info();
  }

  if (options.argv.remain.length && options.argv.remain[0] === "init") {
    return tasks.init();
  }

  if (options.argv.remain.length && options.argv.remain[0] === "deploy") {
    return tasks.deploy(options);
  }

  if (options.argv.remain.length && options.argv.remain[0] === "delete") {
    return tasks.undeploy();
  }

  if (options.argv.remain.length && options.argv.remain[0] === "version") {
    return tasks.bumpVersion(options);
  }

  if (options.argv.remain.length && options.argv.remain[0] === "search") {
    return tasks.search(options);
  }

  if (options.argv.remain.length && options.argv.remain[0] === "login") {
    return tasks.login(options);
  }

  return;
}
