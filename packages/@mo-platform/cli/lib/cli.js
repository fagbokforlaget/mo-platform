'use strict';

// use nopt to parse commandline options
var nopt = require("nopt");
var tasks = require('./tasks');
var allowedEnvs = ['prod', 'dev', 'stage'];

// CLI options
exports.known = {
  help: Boolean,
  version: Boolean,
  name: [String, null],
  force: Boolean,
  ssl: [Boolean, true],
  www: [Boolean, false],
  dist: [String, null],
  configFile: [String, null],
  file: [String, null]
};

// CLI options aliases
exports.aliases = {
  h:['--help'],
  v: ['--version'],
  undeploy: 'delete',
  n: ['--name'],
  f: ['--force']
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

  if (options.env) {
    if (!allowedEnvs.includes(options.env)) {
      return console.error('Invalid env, allowed envs are ' + allowedEnvs.join(', '))
    }
  } else {
    // Default env
    options.env = 'prod'
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

  if (options.argv.remain.length && options.argv.remain[0] === "migrate") {
    return tasks.migrate(options);
  }

 if (options.argv.remain.length && options.argv.remain[0] === "cname") {
    return tasks.cname(options);
  }

   if (options.argv.remain.length && options.argv.remain[0] === "symlink") {
    return tasks.symlink(options);
   }

  console.error('Invalid command: '+ options.argv.remain[0]);
  return tasks.help();
}
