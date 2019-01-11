// determine what config file to load
// if we are in mo-appo folder use development
// if it's a test use test
// otherwise use default

require('dotenv').config({silent: true});

if(process.env.NODE_ENV === "test" || process.env.MOAPP_COV) {
  module.exports = require('./test')
} else if(process.env.NODE_ENV === "development") {
  console.log("development mode\n")
  module.exports = require('./development')
} else {
  module.exports = require('./default')
}
